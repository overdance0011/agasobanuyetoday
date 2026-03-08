import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("movies.db");

// Initialize database
db.exec(`
  DROP TABLE IF EXISTS movies;
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    video_url TEXT,
    category TEXT,
    translator TEXT,
    year INTEGER,
    rating REAL,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM movies").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO movies (title, description, thumbnail, video_url, category, translator, year, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mockMovies = [
    ["John Wick 4 (Agasobanuye)", "A retired hitman is forced back into the underground world of assassins.", "https://picsum.photos/seed/johnwick/400/600", "https://www.youtube.com/embed/qEVUtrk8_B4", "Action", "Rocky Kimomo", 2023, 4.8],
    ["Avatar: The Way of Water", "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.", "https://picsum.photos/seed/avatar/400/600", "https://www.youtube.com/embed/d9MyW72ELq0", "Sci-Fi", "Junior Giti", 2022, 4.5],
    ["The Flash (Agasobanuye)", "Barry Allen uses his super speed to change the past, but his attempt to save his family creates a world without superheroes.", "https://picsum.photos/seed/flash/400/600", "https://www.youtube.com/embed/hebWYacbdvc", "Adventure", "Sankara", 2023, 4.2],
    ["Extraction 2", "Tyler Rake is back for another high-stakes mission.", "https://picsum.photos/seed/extraction/400/600", "https://www.youtube.com/embed/Y274jZs5s7s", "Action", "Rocky Kimomo", 2023, 4.7],
    ["Spider-Man: Across the Spider-Verse", "Miles Morales catapults across the Multiverse.", "https://picsum.photos/seed/spiderman/400/600", "https://www.youtube.com/embed/shW9i6k8cB0", "Animation", "Junior Giti", 2023, 4.9],
    ["Fast X (Agasobanuye)", "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.", "https://picsum.photos/seed/fastx/400/600", "https://www.youtube.com/embed/32RAq6JzY-w", "Action", "Skovi", 2023, 4.4],
    ["Guardians of the Galaxy Vol. 3", "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe.", "https://picsum.photos/seed/guardians/400/600", "https://www.youtube.com/embed/u3V5KDHRQvk", "Sci-Fi", "Be the Great", 2023, 4.6],
    ["The Little Mermaid", "A young mermaid makes a deal with a sea witch to become human.", "https://picsum.photos/seed/mermaid/400/600", "https://www.youtube.com/embed/kpGo2_d3o0o", "Fantasy", "Yanga", 2023, 4.1],
    ["Oppenheimer", "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", "https://picsum.photos/seed/oppenheimer/400/600", "https://www.youtube.com/embed/uYPbbksJxIg", "Drama", "Rocky Kimomo", 2023, 4.9],
    ["Barbie", "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.", "https://picsum.photos/seed/barbie/400/600", "https://www.youtube.com/embed/pBk4NYhWNMM", "Comedy", "Junior Giti", 2023, 4.3],
    ["Mission: Impossible - Dead Reckoning", "Ethan Hunt and his IMF team embark on their most dangerous mission yet.", "https://picsum.photos/seed/mission/400/600", "https://www.youtube.com/embed/avz06PDqDbM", "Action", "Sankara", 2023, 4.7],
    ["Blue Beetle", "An alien scarab chooses Jaime Reyes to be its symbiotic host, bestowing the teenager with a suit of armor.", "https://picsum.photos/seed/beetle/400/600", "https://www.youtube.com/embed/vS3_72n-m7I", "Action", "Skovi", 2023, 4.0],
    ["Gran Turismo", "Based on the unbelievable true story of a team of unlikely underdogs.", "https://picsum.photos/seed/gt/400/600", "https://www.youtube.com/embed/GVPzGBvPrzw", "Sport", "Be the Great", 2023, 4.5]
  ];

  for (const movie of mockMovies) {
    insert.run(...movie);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/movies", (req, res) => {
    const { category, translator, search } = req.query;
    let query = "SELECT * FROM movies WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (translator) {
      query += " AND translator = ?";
      params.push(translator);
    }
    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY created_at DESC";
    const movies = db.prepare(query).all(...params);
    res.json(movies);
  });

  app.get("/api/movies/:id", (req, res) => {
    const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(req.params.id);
    if (movie) {
      // Increment views
      db.prepare("UPDATE movies SET views = views + 1 WHERE id = ?").run(req.params.id);
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT DISTINCT category FROM movies").all();
    res.json(categories.map((c: any) => c.category));
  });

  app.get("/api/translators", (req, res) => {
    const translators = db.prepare("SELECT DISTINCT translator FROM movies").all();
    res.json(translators.map((t: any) => t.translator));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
