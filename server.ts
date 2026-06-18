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
const DEFAULT_PROPERTIES = [
  {
    id: "prop-1",
    title: "The Obsidian Pavilion",
    type: "Villa",
    location: "Malibu Coastline, California",
    price: 8450000,
    bedrooms: 5,
    bathrooms: 6,
    size: 7800,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An architectural masterwork balancing raw concrete cantilever pavilions with endless Pacific panorama."
  },
  {
    id: "prop-2",
    title: "Summit Ritz Penthouse",
    type: "Apartment",
    location: "Park Avenue, Manhattan, NY",
    price: 12500000,
    bedrooms: 3,
    bathrooms: 3.5,
    size: 4200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Bespoke triple-aspect penthouse framing unobstructed lines of Central Park and the Manhattan skyline."
  },
  {
    id: "prop-3",
    title: "Aura Glass Duplex",
    type: "Duplex",
    location: "Trousdale Estates, Beverly Hills",
    price: 6900000,
    bedrooms: 4,
    bathrooms: 5,
    size: 5600,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Floor-to-ceiling glass retractable boundaries that merge luxury interior space with private hillside panoramic views."
  },
  {
    id: "prop-4",
    title: "The Helix Commercial Center",
    type: "Commercial",
    location: "Metropolitan Financial District, Boston",
    price: 18200000,
    bedrooms: 0,
    bathrooms: 12,
    size: 15400,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "State-of-the-art office spaces featuring LEED Platinum efficiency systems and high-density fiber hubs."
  },
  {
    id: "prop-5",
    title: "Amalfi Coast Villa",
    type: "Villa",
    location: "Palm Jumeirah Crescent, Dubai",
    price: 14200000,
    bedrooms: 6,
    bathrooms: 8,
    size: 9200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Over-water coastal oasis complete with custom yacht slipway, infinity-edge ocean water system and wellness court."
  },
  {
    id: "prop-6",
    title: "The Alpine Crest Retreat",
    type: "Apartment",
    location: "Millers Ridge, Aspen, Colorado",
    price: 4850000,
    bedrooms: 3,
    bathrooms: 4,
    size: 3800,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High-altitude luxury ski chalet designed with cedar-beams, dual grand hearths, and sub-zero outdoor hot spa."
  }
];

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
