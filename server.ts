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
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    video_url TEXT,
    category TEXT,
    interpreter TEXT,
    origin TEXT,
    duration TEXT,
    year INTEGER,
    rating REAL,
    views INTEGER DEFAULT 0,
    type TEXT DEFAULT 'movie',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add 'type' column if it doesn't exist
try {
  const tableInfo = db.prepare("PRAGMA table_info(movies)").all() as any[];
  const hasTypeColumn = tableInfo.some(column => column.name === 'type');
  if (!hasTypeColumn) {
    db.exec("ALTER TABLE movies ADD COLUMN type TEXT DEFAULT 'movie'");
    console.log("Migration: Added 'type' column to movies table");
  } else {
    console.log("Migration: 'type' column already exists in movies table");
  }
} catch (error) {
  console.error("Migration error:", error);
}

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM movies").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO movies (title, description, thumbnail, video_url, category, interpreter, origin, duration, year, rating, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mockMovies = [
    // Rocky Kimomo
    ["John Wick 4 (Agasobanuye)", "A retired hitman is forced back into the underground world of assassins.", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/qEVUtrk8_B4", "Action", "Rocky Kimomo", "American", "2h 49m", 2023, 4.8],
    ["Extraction 2", "Tyler Rake is back for another high-stakes mission.", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/Y274jZs5s7s", "Action", "Rocky Kimomo", "American", "2h 3m", 2023, 4.7],
    ["Oppenheimer", "The story of American scientist J. Robert Oppenheimer.", "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/uYPbbksJxIg", "Drama", "Rocky Kimomo", "American", "3h 0m", 2023, 4.9],
    ["The Equalizer 3", "Robert McCall finds himself at home in Southern Italy.", "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/19iQ798W6I8", "Action", "Rocky Kimomo", "American", "1h 49m", 2023, 4.6],
    
    // Junior Giti
    ["Avatar: The Way of Water", "Jake Sully lives with his newfound family on Pandora.", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/d9MyW72ELq0", "Sci-Fi", "Junior Giti", "American", "3h 12m", 2022, 4.5],
    ["Spider-Man: Across the Spider-Verse", "Miles Morales catapults across the Multiverse.", "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/shW9i6k8cB0", "Cartoon", "Junior Giti", "American", "2h 20m", 2023, 4.9],
    ["Barbie", "Barbie and Ken are having the time of their lives.", "https://images.unsplash.com/photo-1497124401559-3e75ec2ed774?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/pBk4NYhWNMM", "Comedy", "Junior Giti", "American", "1h 54m", 2023, 4.3],
    ["Elemental", "Follows Ember and Wade in a city where fire, water, land and air residents live together.", "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/hXzcyx9V0xw", "Cartoon", "Junior Giti", "American", "1h 41m", 2023, 4.4],

    // Sankara
    ["The Flash (Agasobanuye)", "Barry Allen uses his super speed to change the past.", "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/hebWYacbdvc", "Adventure", "Sankara", "American", "2h 24m", 2023, 4.2],
    ["Mission: Impossible - Dead Reckoning", "Ethan Hunt and his IMF team embark on their most dangerous mission.", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/avz06PDqDbM", "Action", "Sankara", "American", "2h 43m", 2023, 4.7],
    ["Indiana Jones and the Dial of Destiny", "Archaeologist Indiana Jones races against time.", "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/eQfMbSe7F2g", "Adventure", "Sankara", "American", "2h 34m", 2023, 4.1],
    ["Transformers: Rise of the Beasts", "A globetrotting adventure with the Autobots.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/itnqEauWQZM", "Sci-Fi", "Sankara", "American", "2h 7m", 2023, 4.3],

    // Skovi
    ["Fast X (Agasobanuye)", "Dom Toretto and his family are targeted by a vengeful son.", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/32RAq6JzY-w", "Action", "Skovi", "American", "2h 21m", 2023, 4.4],
    ["Blue Beetle", "An alien scarab chooses Jaime Reyes to be its host.", "https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/vS3_72n-m7I", "Action", "Skovi", "American", "2h 7m", 2023, 4.0],
    ["Meg 2: The Trench", "A research team encounters multiple threats while exploring the depths.", "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/dG91B3hHyY4", "Action", "Skovi", "American", "1h 56m", 2023, 3.9],
    ["The Nun II", "Sister Irene once again comes face-to-face with Valak.", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/QF-oyCwaArU", "Horror", "Skovi", "American", "1h 50m", 2023, 4.2],

    // Be the Great
    ["Guardians of the Galaxy Vol. 3", "Peter Quill rallies his team to defend the universe.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/u3V5KDHRQvk", "Sci-Fi", "Be the Great", "American", "2h 30m", 2023, 4.6],
    ["Gran Turismo", "Based on the unbelievable true story of a team of underdogs.", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/GVPzGBvPrzw", "Sport", "Be the Great", "American", "2h 14m", 2023, 4.5],
    ["Dungeons & Dragons: Honor Among Thieves", "A charming thief and a band of unlikely adventurers.", "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/IiMinixSX8s", "Fantasy", "Be the Great", "American", "2h 14m", 2023, 4.4],
    ["The Super Mario Bros. Movie", "A plumber named Mario travels through an underground labyrinth.", "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/TnGl01FkMMo", "Cartoon", "Be the Great", "American", "1h 32m", 2023, 4.7],

    // Yanga
    ["The Little Mermaid", "A young mermaid makes a deal with a sea witch.", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/kpGo2_d3o0o", "Fantasy", "Yanga", "American", "2h 15m", 2023, 4.1],
    ["Puss in Boots: The Last Wish", "Puss in Boots discovers that his passion for adventure has taken its toll.", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/RqrXhwS33yc", "Cartoon", "Yanga", "American", "1h 42m", 2022, 4.8],
    ["Encanto", "A young Colombian girl has to face the frustration of being the only member of her family without magical powers.", "https://images.unsplash.com/photo-1501446529957-6226bd447c46?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/CaimKeHiudo", "Cartoon", "Yanga", "American", "1h 42m", 2021, 4.6],
    ["Sing 2", "Buster Moon and his all-star cast of performers prepare to launch their most dazzling stage extravaganza yet.", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/EPZu5MA2uqI", "Cartoon", "Yanga", "American", "1h 50m", 2021, 4.5],

    // Pati
    ["The Super Mario Bros. Movie", "A plumber named Mario travels through an underground labyrinth.", "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/TnGl01FkMMo", "Cartoon", "Pati", "American", "1h 32m", 2023, 4.7],
    ["Spider-Man: Across the Spider-Verse", "Miles Morales catapults across the Multiverse.", "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/shW9i6k8cB0", "Cartoon", "Pati", "American", "2h 20m", 2023, 4.9],
    ["Minions: The Rise of Gru", "The untold story of one twelve-year-old's dream to become the world's greatest supervillain.", "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/6DxjJzmYsXo", "Cartoon", "Pati", "American", "1h 27m", 2022, 4.4],
    ["The Bad Guys", "A crackerjack criminal crew of animal outlaws are about to attempt their most challenging con yet.", "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/m8Xt0yXaDPU", "Cartoon", "Pati", "American", "1h 40m", 2022, 4.3],

    // Dany
    ["The Hangover", "Three buddies wake up from a bachelor party in Las Vegas.", "https://images.unsplash.com/photo-1514525253344-f814d074358a?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/tcdUjG9n7aw", "Comedy", "Dany", "American", "1h 40m", 2009, 4.7],
    ["Superbad", "Two co-dependent high school seniors are forced to deal with separation anxiety.", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/4eaZ_adZwWk", "Comedy", "Dany", "American", "1h 53m", 2007, 4.6],
    ["Step Brothers", "Two aimless, middle-aged focal points still living at home.", "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/8Qn_sqTTVNM", "Comedy", "Dany", "American", "1h 38m", 2008, 4.5],
    ["21 Jump Street", "A pair of underachieving cops are sent back to a local high school.", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/RLoK9fZEp-w", "Comedy", "Dany", "American", "1h 49m", 2012, 4.4],

    // Zizou
    ["Top Gun: Maverick", "After more than thirty years of service as one of the Navy's top aviators.", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/giXcoGa8nzo", "Action", "Zizou", "American", "2h 10m", 2022, 4.9],
    ["The Batman", "When a sadistic serial killer begins murdering key political figures in Gotham.", "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/mqqft2x_Aa4", "Action", "Zizou", "American", "2h 56m", 2022, 4.7],
    ["No Time to Die", "James Bond has left active service.", "https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/vw2FOYjCz38", "Action", "Zizou", "American", "2h 43m", 2021, 4.6],
    ["Dune", "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/n9xhJrPXop4", "Sci-Fi", "Zizou", "American", "2h 35m", 2021, 4.8],

    // Global Cartoons
    ["Nezha: Rebirth", "3000 years after the boy-god Nezha conquers the Dragon King.", "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/7-Vv6TqY7vE", "Cartoon", "Junior Giti", "Chinese", "1h 56m", 2021, 4.7],
    ["The Monkey King", "A stick-wielding monkey teams up with a young girl on an epic quest for immortality.", "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/O-L97vI8L-Q", "Cartoon", "Pati", "Chinese", "1h 32m", 2023, 4.5],
    ["Wish Dragon", "Determined teen Din is longing to reconnect with his childhood best friend.", "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/2_m9_R_8S6M", "Cartoon", "Yanga", "Chinese", "1h 38m", 2021, 4.6],
    ["Ne Zha (2019)", "The young boy Nezha is birthed from a heavenly pearl and must fight his destiny.", "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/m_u_V8v-P-A", "Cartoon", "Junior Giti", "Chinese", "1h 50m", 2019, 4.9],
    ["Demon Slayer: Mugen Train", "Tanjiro and his friends accompany Kyojuro Rengoku on a mission.", "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/ATJYac_dORw", "Cartoon", "Sankara", "Japanese", "1h 57m", 2020, 4.8],
    ["Jujutsu Kaisen 0", "Yuta Okkotsu, a high schooler who gains control of an extremely powerful Cursed Spirit.", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/WGi32fJ_060", "Cartoon", "Skovi", "Japanese", "1h 45m", 2021, 4.7],

    // Indian Movies
    ["RRR", "A tale of two legendary revolutionaries and their journey far from home.", "https://images.unsplash.com/photo-1524492459426-03032ad3197a?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/NgBoMJy386M", "Action", "Rocky Kimomo", "Indian", "3h 7m", 2022, 4.9],
    ["Pathaan", "An Indian spy takes on the leader of a group of mercenaries who have nefarious plans for his country.", "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/vqu4z34wENw", "Action", "Sankara", "Indian", "2h 26m", 2023, 4.5],
    ["Jawan", "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/MWO67wMFn3E", "Action", "Junior Giti", "Indian", "2h 49m", 2023, 4.7],
    
    // Shorts
    ["Funny Cat Moment", "A hilarious short clip of a cat being a cat.", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop", "https://www.youtube.com/embed/0Xp5bS2uX0U", "Comedy", "Capull", "Global", "0m 59s", 2024, 4.9, "short"]
  ];

  for (const movie of mockMovies) {
    const [title, description, thumbnail, video_url, category, interpreter, origin, duration, year, rating, type] = movie;
    insert.run(
      title, 
      description, 
      thumbnail, 
      video_url, 
      category, 
      interpreter, 
      origin, 
      duration, 
      year, 
      rating, 
      type || 'movie'
    );
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.post("/api/movies", (req, res) => {
    const { title, description, thumbnail, video_url, category, interpreter, origin, duration, year, type } = req.body;
    
    if (!title || !video_url || !category || !interpreter) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO movies (title, description, thumbnail, video_url, category, interpreter, origin, duration, year, rating, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        title, 
        description || "", 
        thumbnail || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop", 
        video_url, 
        category, 
        interpreter, 
        origin || "Unknown",
        duration || "Unknown",
        year || new Date().getFullYear(), 
        4.0,
        type || 'movie'
      );
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error uploading movie:", error);
      res.status(500).json({ error: "Failed to upload movie" });
    }
  });
  app.get("/api/movies", (req, res) => {
    const { category, interpreter, search, type } = req.query;
    let query = "SELECT * FROM movies WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (interpreter) {
      query += " AND interpreter = ?";
      params.push(interpreter);
    }
    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type);
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

  app.get("/api/interpreters", (req, res) => {
    const interpreters = db.prepare(`
      SELECT interpreter as name, COUNT(*) as count 
      FROM movies 
      GROUP BY interpreter 
      ORDER BY count DESC
    `).all();
    
    // Add default images for known interpreters, fallback for others
    const interpreterImages: Record<string, string> = {
      'Capull': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      'Rocky Kimomo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      'Junior Giti': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      'Sankara': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      'Skovi': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
      'Be the Great': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
      'Yanga': 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop',
      'Pati': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=200&auto=format&fit=crop',
      'Dany': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
      'Zizou': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    };

    const result = interpreters.map((t: any) => ({
      ...t,
      image: interpreterImages[t.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=ea580c&color=fff&bold=true`
    }));

    res.json(result);
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
