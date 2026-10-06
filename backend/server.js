const express = require("express");
const cors = require("cors");
const pool = require("./db");

pool.query("SELECT NOW()", (err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("Database connected!");
    }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "URL Shortener API is running!" });
});

app.post("/shorten", async (req, res) => {
    const { original_url } = req.body;

    const short_code = Math.random().toString(36).substring(2, 8);

    const result = await pool.query(
        "INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *",
        [original_url, short_code]
    );

    res.json(result.rows[0]);
});

app.get("/urls", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM urls ORDER BY created_at DESC"
    );

    res.json(result.rows);
});

app.get("/:short_code", async (req, res) => {
    const { short_code } = req.params;

    const result = await pool.query(
        "SELECT * FROM urls WHERE short_code = $1",
        [short_code]
    );

    if (result.rows.length === 0) {
        return res.status(404).send("Short URL not found");
    }

    await pool.query(
        "UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1",
        [short_code]
    );

    res.redirect(result.rows[0].original_url);
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});