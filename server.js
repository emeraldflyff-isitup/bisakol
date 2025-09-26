import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const TARGET_URL = "https://patch.emeraldflyff.com/91/";

function contains404Phrase(text) {
  if (!text) return false;
  return text.includes("404 - File or directory not found.");
}

app.get("/api/check", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, { method: "GET" });

    if (response.status === 404) {
      return res.json({ status: "no-patch", message: "atm there is not yet" });
    }

    const text = await response.text();

    if (contains404Phrase(text)) {
      return res.json({ status: "no-patch", message: "atm there is not yet" });
    }

    return res.json({
      status: "patched",
      message: "spam tractor"
    });
  } catch (err) {
    console.error("Error checking patch:", err.message || err);
    return res.status(502).json({
      status: "error",
      message: "error checking upstream site",
      details: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("patch-checker api is running. GET /api/check");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
