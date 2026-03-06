const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - allow all origins for flexibility (Render provides dynamic URLs)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── In-Memory Storage ───────────────────────────────────────────────

// ─── In-Memory Storage ───────────────────────────────────────────────
let nextTodoId = 1;
let todos = [];
let preferences = { theme: "dark", accentColor: "purple" };

// ─── Todo CRUD ───────────────────────────────────────────────────────

// List all todos
app.get("/api/todos", (_req, res) => {
  res.json(todos);
});

// Add a todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  const todo = {
    id: nextTodoId++,
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// Update a todo
app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const { text, completed } = req.body;
  if (text !== undefined) todos[idx].text = text;
  if (completed !== undefined) todos[idx].completed = completed;
  res.json(todos[idx]);
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(idx, 1);
  res.json({ success: true });
});

// ─── Preferences CRUD ────────────────────────────────────────────────

// Get preferences
app.get("/api/preferences", (_req, res) => {
  res.json(preferences);
});

// Set preferences
app.put("/api/preferences", (req, res) => {
  const { theme, accentColor } = req.body;
  if (theme !== undefined) preferences.theme = theme;
  if (accentColor !== undefined) preferences.accentColor = accentColor;
  res.json(preferences);
});

// ─── Geocoding API ──────────────────────────────────────────────────

app.get("/api/geocode", async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "city query param required" });
  }
  try {
    const encodedCity = encodeURIComponent(city);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API responded with ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }
    const location = data.results[0];
    res.json({
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  } catch (err) {
    console.error("Geocoding fetch error:", err);
    res.status(502).json({ error: "Failed to geocode city" });
  }
});

// ─── Weather Proxy ───────────────────────────────────────────────────

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon query params required" });
  }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API responded with ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Weather fetch error:", err);
    res.status(502).json({ error: "Failed to fetch weather data" });
  }
});

// ─── Start ───────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
