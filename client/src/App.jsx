import { useEffect, useState } from "react";
import "./app.css";
import Navbar from "./components/navbar/Navbar";
import Card from "./components/card/Card";
import { posts } from "./data";
import { io } from "socket.io-client";

const App = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        newSocket.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && user) {
            socket.emit("newUser", user);
        }
    }, [socket, user]);

    return (
        <div className="container">
            {user ? (
                <>
                    <Navbar socket={socket} />
                    {posts.map((post) => (
                        <Card key={post.id} post={post} socket={socket} user={user} />
                    ))}
                    <span className="username">{user}</span>
                </>
            ) : (
                <div className="login">
                    <input
                        type="text"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            if (username.trim()) {
                                setUser(username);
                            } else {
                                alert("Please enter a valid username.");
                            }
                        }}
                    >
                        Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
