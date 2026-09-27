import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    const loadHistory = async () => {
        const response = await fetch("http://localhost:5000/urls");
        const data = await response.json();
        setHistory(data);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const shortenUrl = async () => {
        if (!url) return;

        const response = await fetch("http://localhost:5000/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ original_url: url })
        });

        const data = await response.json();

        setShortUrl(data.short_code);
        setCopied(false);
        setUrl("");

        loadHistory();
    };

    const copyUrl = async () => {
        const fullUrl = `http://localhost:5000/${shortUrl}`;

        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
    };

    if (showHistory) {
        return (
            <div className="container">
                <div className="card">
                    <button
                        className="back-button"
                        onClick={() => setShowHistory(false)}
                    >
                        ← Back
                    </button>

                    <h1>📜 URL History</h1>

                    <div className="history">
                        {history.map((item) => (
                            <div className="history-item" key={item.id}>
                                <div>
                                    <p>{item.original_url}</p>

                                    <a
                                        href={`http://localhost:5000/${item.short_code}`}
                                        target="_blank"
                                    >
                                        http://localhost:5000/{item.short_code}
                                    </a>
                                </div>

                                <span>
                                    Clicks: {item.click_count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">

                <h1>🔗 URL Shortener</h1>

                <p className="subtitle">
                    Turn long URLs into short, shareable links.
                </p>

                <div className="input-area">
                    <input
                        type="text"
                        placeholder="Paste your long URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <button onClick={shortenUrl}>
                        Shorten URL
                    </button>
                </div>

                {shortUrl && (
                    <div className="result">
                        <p>Your shortened URL:</p>

                        <strong>
                            http://localhost:5000/{shortUrl}
                        </strong>

                        <button onClick={copyUrl}>
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                )}

                <button
                    className="history-button"
                    onClick={() => {
                        loadHistory();
                        setShowHistory(true);
                    }}
                >
                    📜 View History
                </button>

            </div>
        </div>
    );
}

export default App;