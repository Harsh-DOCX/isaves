import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL || "";

const parseError = async (response) => {
    try {
        const data = await response.json();
        return data.message || "Request failed.";
    } catch {
        return "Request failed.";
    }
};

const request = async (path, options = {}) => {
    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await request("/api/auth/me");
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const signup = async (payload) => {
        const data = await request("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        setUser(data.user);
        return data.user;
    };

    const login = async (credentials) => {
        const data = await request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        setUser(data.user);
        return data.user;
    };

    const loginWithGoogle = async (credential) => {
        const data = await request("/api/auth/google", {
            method: "POST",
            body: JSON.stringify({ credential }),
        });

        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try {
            await request("/api/auth/logout", { method: "POST" });
        } catch {
            // Always clear local state, even if backend logout request fails.
        }

        setUser(null);
    };

    const updateProfile = async (payload) => {
        const data = await request("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify(payload),
        });

        setUser(data.user);
        return data.user;
    };

    const authFetch = useCallback((path, options = {}) => {
        if (!user) {
            throw new Error("You must be logged in to perform this action.");
        }

        return request(path, options);
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                loginWithGoogle,
                logout,
                updateProfile,
                authFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
