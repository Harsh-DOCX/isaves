import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { AuthProvider } from "./AuthContext";
import { DialogProvider } from "./components/ui/DialogProvider";

jest.mock("./components/GoogleAuthButton", () => {
    const React = require("react");

    return {
        __esModule: true,
        default: function MockGoogleAuthButton({ mode, onCredential, disabled }) {
            return React.createElement(
                "button",
                {
                    type: "button",
                    disabled,
                    onClick: () => onCredential("test-google-credential"),
                },
                mode === "signup" ? "Sign up with Google" : "Sign in with Google",
            );
        },
    };
});

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

        if (path === "/api/auth/google" && method === "POST") {
            const payload = JSON.parse(options.body);
            if (payload.mode === "signup" && !payload.password) {
                return jsonResponse(200, {
                    requiresSetup: true,
                    email: "google@example.com",
                });
            }

            currentUser = {
                id: "google-user-1",
                username: "Google_User",
                email: "google@example.com",
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

const renderApp = () =>
    render(
        <AuthProvider>
            <DialogProvider>
                <App />
            </DialogProvider>
        </AuthProvider>,
    );

beforeEach(() => {
    window.history.pushState({}, "", "/");
    window.localStorage.clear();
    window.confirm = jest.fn(() => true);
    global.fetch = createApiMock();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("renders the public homepage on the root route", async () => {
    renderApp();
    expect(screen.getByText(/secure your digital life/i)).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

test("shows a custom not-found page for unknown routes", async () => {
    window.history.pushState({}, "", "/this-page-does-not-exist");

    renderApp();

    expect(screen.getByRole("heading", { name: /this page is off the map/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

test("dismisses and remembers the cookie notice", async () => {
    const { unmount } = renderApp();

    expect(screen.getByRole("region", { name: /cookie notice/i })).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("button", { name: /got it/i }));

    expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("isaves-cookie-notice-dismissed")).toBe("true");

    unmount();
    renderApp();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
});

test("allows signup and redirects to the protected vault", async () => {
    const user = userEvent;
    window.history.pushState({}, "", "/sign-up");

    renderApp();

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

test("asks Google signups for a password and recovery details before creating the account", async () => {
    window.history.pushState({}, "", "/sign-up");

    renderApp();

    await userEvent.click(await screen.findByRole("button", { name: /sign up with google/i }));

    expect(await screen.findByText(/google account:/i)).toHaveTextContent("google@example.com");
    await userEvent.type(
        screen.getByLabelText(/new access_key \[password\]/i),
        "StrongGooglePass123!",
    );
    await userEvent.selectOptions(
        screen.getByLabelText(/recovery_question \[security\]/i),
        "What city were you born in?",
    );
    await userEvent.type(
        screen.getByLabelText(/recovery_answer \[answer\]/i),
        "Springfield",
    );
    await userEvent.click(screen.getByRole("button", { name: /complete google signup/i }));

    expect(await screen.findByRole("heading", { name: /stored credentials/i })).toBeInTheDocument();
    const googleRequests = global.fetch.mock.calls.filter(
        ([url]) => normalizeApiPath(url) === "/api/auth/google",
    );
    expect(googleRequests).toHaveLength(2);
    expect(JSON.parse(googleRequests[1][1].body)).toMatchObject({
        credential: "test-google-credential",
        mode: "signup",
        password: "StrongGooglePass123!",
        recoveryQuestion: "What city were you born in?",
        recoveryAnswer: "Springfield",
    });
});

test("handles login, create vault entry, delete entry, and logout to home", async () => {
    const user = userEvent;
    window.history.pushState({}, "", "/login");

    renderApp();

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
    const deleteDialog = await screen.findByRole("dialog");
    await user.click(within(deleteDialog).getByRole("button", { name: /^delete$/i }));
    await waitFor(() => {
        expect(screen.queryAllByText("github.com")).toHaveLength(0);
    });

    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(await screen.findByText(/secure your digital life/i)).toBeInTheDocument();
});
