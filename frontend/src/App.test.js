import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { AuthProvider } from "./AuthContext";

const jsonResponse = (status, body) =>
    Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    });

const normalizeApiPath = (url) => {
    try {
        return new URL(url, "http://localhost").pathname;
    } catch {
        return url;
    }
};

const createApiMock = () => {
    let currentUser = null;
    let entries = [];

    return jest.fn(async (url, options = {}) => {
        const path = normalizeApiPath(url);
        const method = (options.method || "GET").toUpperCase();

        if (path === "/api/auth/me" && method === "GET") {
            return currentUser
                ? jsonResponse(200, { user: currentUser })
                : jsonResponse(401, { message: "Invalid or expired session." });
        }

        if (path === "/api/auth/signup" && method === "POST") {
            const payload = JSON.parse(options.body);
            currentUser = {
                id: "user-1",
                username: payload.username,
                email: payload.email,
                createdAt: new Date().toISOString(),
            };
            return jsonResponse(201, { user: currentUser });
        }

        if (path === "/api/auth/login" && method === "POST") {
            const payload = JSON.parse(options.body);
            currentUser = {
                id: "user-1",
                username: "Tester",
                email: payload.email,
                createdAt: new Date().toISOString(),
            };
            return jsonResponse(200, { user: currentUser });
        }

        if (path === "/api/auth/logout" && method === "POST") {
            currentUser = null;
            return Promise.resolve({ ok: true, status: 204 });
        }

        if (path === "/api/vault" && method === "GET") {
            return currentUser
                ? jsonResponse(200, { entries })
                : jsonResponse(401, { message: "Authentication required." });
        }

        if (path === "/api/vault" && method === "POST") {
            const payload = JSON.parse(options.body);
            const entry = {
                id: `entry-${entries.length + 1}`,
                userId: currentUser?.id || "user-1",
                siteName: payload.siteName,
                username: payload.username,
                password: payload.password,
                notes: payload.notes || "",
                createdAt: new Date().toISOString(),
            };
            entries = [entry, ...entries];
            return jsonResponse(201, { entry });
        }

        if (path.startsWith("/api/vault/") && method === "DELETE") {
            const entryId = path.split("/").pop();
            entries = entries.filter((entry) => entry.id !== entryId);
            return Promise.resolve({ ok: true, status: 204 });
        }

        return jsonResponse(404, { message: `Unhandled route in test mock: ${method} ${url}` });
    });
};

beforeEach(() => {
    window.history.pushState({}, "", "/");
    window.confirm = jest.fn(() => true);
    global.fetch = createApiMock();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("renders the public homepage on the root route", async () => {
    render(
        <AuthProvider>
            <App />
        </AuthProvider>,
    );
    expect(screen.getByText(/secure your digital life/i)).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

test("allows signup and redirects to the protected vault", async () => {
    const user = userEvent;
    window.history.pushState({}, "", "/sign-up");

    render(
        <AuthProvider>
            <App />
        </AuthProvider>,
    );

    const usernameInput = await screen.findByLabelText(/designation \[username\]/i);
    const emailInput = await screen.findByLabelText(/identifier \[email\]/i);
    const passwordInput = await screen.findByLabelText(/new access_key \[password\]/i);

    await user.type(usernameInput, "Harsh");
    await user.type(emailInput, "harsh@example.com");
    await user.type(passwordInput, "VeryStrongPass123!");
    await user.click(screen.getByRole("button", { name: /generate profile/i }));

    expect(await screen.findByRole("heading", { name: /your secure vault/i })).toBeInTheDocument();
    expect(await screen.findByText(/operator harsh is authenticated/i)).toBeInTheDocument();
});

test("handles login, create vault entry, delete entry, and logout to home", async () => {
    const user = userEvent;
    window.history.pushState({}, "", "/login");

    render(
        <AuthProvider>
            <App />
        </AuthProvider>,
    );

    const loginEmailInput = await screen.findByLabelText(/identifier \[email\]/i);
    const loginPasswordInput = await screen.findByLabelText(/access_key \[password\]/i);

    await user.type(loginEmailInput, "tester@example.com");
    await user.type(loginPasswordInput, "SomeStrongPassword123!");
    await user.click(screen.getByRole("button", { name: /initialize connection/i }));

    expect(await screen.findByRole("heading", { name: /stored credentials/i })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /\+ add credential/i }));
    expect(await screen.findByRole("heading", { name: /store a new credential/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/system \[site name \/ url\]/i), "github.com");
    await user.type(screen.getByLabelText(/identifier \[username \/ email\]/i), "tester@example.com");
    await user.type(screen.getByLabelText(/access_key \[password\]/i), "AnotherStrongPass!123");
    await user.click(screen.getByRole("button", { name: /store credential/i }));

    expect((await screen.findAllByText("github.com")).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
        expect(screen.queryByText("github.com")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(await screen.findByText(/secure your digital life/i)).toBeInTheDocument();
});
