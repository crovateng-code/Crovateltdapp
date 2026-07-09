import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Parsers with generous size threshold
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DATA_DIR = path.join(process.cwd(), "data");

// Replicated default properties catalog from src/data.ts to prevent empty data states on server boots
const DEFAULT_PROPERTIES = [];

const DEFAULT_LOCATIONS = ["California", "New York", "Dubai", "Colorado", "Boston", "Lagos", "Abuja"];

// Helper to ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Helpers for file reading/writing with auto-seeding defaults
function readDataFile(filename: string): any[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    // Primary auto-seeding logic
    if (filename === "properties.json") {
      try {
        fs.writeFileSync(filePath, JSON.stringify(DEFAULT_PROPERTIES, null, 2), "utf-8");
        return DEFAULT_PROPERTIES;
      } catch (err) {
        console.error("Error writing default properties.json", err);
        return DEFAULT_PROPERTIES;
      }
    }
    if (filename === "locations.json") {
      try {
        fs.writeFileSync(filePath, JSON.stringify(DEFAULT_LOCATIONS, null, 2), "utf-8");
        return DEFAULT_LOCATIONS;
      } catch (err) {
        console.error("Error writing default locations.json", err);
        return DEFAULT_LOCATIONS;
      }
    }
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If files somehow exist but hold empty arrays, seed them
    if (filename === "properties.json") {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_PROPERTIES, null, 2), "utf-8");
      return DEFAULT_PROPERTIES;
    }
    if (filename === "locations.json") {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_LOCATIONS, null, 2), "utf-8");
      return DEFAULT_LOCATIONS;
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${filename}`, err);
    return [];
  }
}

function writeDataFile(filename: string, data: any[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filename}`, err);
  }
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// PROPERTIES API
app.get("/api/properties", (req, res) => {
  const data = readDataFile("properties.json");
  res.json({ success: true, properties: data });
});

app.post("/api/properties", (req, res) => {
  const { properties } = req.body;
  if (Array.isArray(properties)) {
    writeDataFile("properties.json", properties);
    res.json({ success: true, count: properties.length });
  } else {
    res.status(400).json({ success: false, error: "Properties must be an array" });
  }
});

// LOCATIONS API
app.get("/api/locations", (req, res) => {
  const data = readDataFile("locations.json");
  res.json({ success: true, locations: data });
});

app.post("/api/locations", (req, res) => {
  const { locations } = req.body;
  if (Array.isArray(locations)) {
    writeDataFile("locations.json", locations);
    res.json({ success: true, count: locations.length });
  } else {
    res.status(400).json({ success: false, error: "Locations must be an array" });
  }
});

// INQUIRIES API
app.get("/api/inquiries", (req, res) => {
  const data = readDataFile("inquiries.json");
  res.json({ success: true, inquiries: data });
});

app.post("/api/inquiries", (req, res) => {
  const { inquiries } = req.body;
  if (Array.isArray(inquiries)) {
    writeDataFile("inquiries.json", inquiries);
    res.json({ success: true, count: inquiries.length });
  } else {
    res.status(400).json({ success: false, error: "Inquiries must be an array" });
  }
});

// NEWSLETTER SUBSCRIPTIONS API
app.get("/api/subs", (req, res) => {
  const data = readDataFile("subs.json");
  res.json({ success: true, subs: data });
});

app.post("/api/subs", (req, res) => {
  const { subs } = req.body;
  if (Array.isArray(subs)) {
    writeDataFile("subs.json", subs);
    res.json({ success: true, count: subs.length });
  } else {
    res.status(400).json({ success: false, error: "Subscriptions must be an array" });
  }
});

// ==========================================
// VITE INTEGRATION / SPA FILE SERVING
// ==========================================

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    // Development Environment: Hook Vite dev middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production / Deployed environment: Serve pre-built static client files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Crovation Server] Full-Stack sync active on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to boot Vite integration middleware in Express:", err);
});
