import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";

function AdminLogin() {

    const API_URL =
        import.meta.env.VITE_API_URL;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("adminToken")
    );

    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/api/admin/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok && data.token) {

                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                localStorage.setItem(
                    "adminUsername",
                    data.username
                );

                setIsLoggedIn(true);

            } else {

                alert(
                    data.message ||
                    "Invalid username or password"
                );
            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };

    if (isLoggedIn) {
        return <AdminDashboard />;
    }

    return (
        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="admin-logo">

                    <h1>
                        ZOSHA
                    </h1>

                    <p>
                        INTERNATIONAL TRADERS
                    </p>

                </div>

                <h2>
                    Admin Login
                </h2>

                <form
                    className="admin-form"
                    onSubmit={handleLogin}
                >

                    <input
                        className="admin-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) =>
                            setUsername(
                                event.target.value
                            )
                        }
                        required
                    />

                    <input
                        className="admin-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button
                        className="admin-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;