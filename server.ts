process.env.DISABLE_HMR = 'true';
import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? Number(process.env.PORT) : 3000;
const isProduction = process.env.NODE_ENV === 'production';
const httpServer = http.createServer(app);

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Database helper functions
interface AppDatabase {
  profile: any;
  slipUps: any[];
  cravings: any[];
  goals: any[];
}

function readDatabase(): AppDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read database file:', err);
  }
  return {
    profile: {
      cigarettesPerDay: 20,
      cigarettesPerPack: 20,
      packPrice: 85,
      quitDate: new Date().toISOString(),
      lastSmokedDate: new Date().toISOString(),
      flexibleMode: 'forgiving',
      name: 'Kullanıcı',
      motivation: 'Daha sağlıklı ve özgür bir nefes için',
      completedOnboarding: true,
    },
    slipUps: [],
    cravings: [],
    goals: [],
  };
}

function writeDatabase(data: AppDatabase): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Full state sync
app.get('/api/data', (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  const db = readDatabase();
  res.json(db.profile);
});

app.post('/api/profile', (req, res) => {
  const db = readDatabase();
  db.profile = {
    ...db.profile,
    ...req.body,
    completedOnboarding: true,
  };
  writeDatabase(db);
  res.json({ success: true, profile: db.profile });
});

// Slip-ups (Ufak Kaçamaklar) endpoints
app.get('/api/slip-ups', (req, res) => {
  const db = readDatabase();
  res.json(db.slipUps || []);
});

app.post('/api/slip-ups', (req, res) => {
  const db = readDatabase();
  const newSlipUp = {
    id: Date.now().toString(),
    timestamp: req.body.timestamp || new Date().toISOString(),
    amount: Number(req.body.amount) || 1,
    trigger: req.body.trigger || 'Belirtilmedi',
    actionPlan: req.body.actionPlan || 'compensation',
    notes: req.body.notes || '',
    detoxWaterDrunkLiters: 0,
    walkMinutesDone: 0,
    ...req.body,
  };

  db.slipUps = [newSlipUp, ...(db.slipUps || [])];

  // Update profile lastSmokedDate if applicable
  if (req.body.updateLastSmoked) {
    db.profile.lastSmokedDate = newSlipUp.timestamp;
    if (newSlipUp.actionPlan === 'restart') {
      db.profile.quitDate = newSlipUp.timestamp;
    }
  }

  writeDatabase(db);
  res.json({ success: true, slipUps: db.slipUps, profile: db.profile });
});

app.delete('/api/slip-ups/:id', (req, res) => {
  const db = readDatabase();
  db.slipUps = (db.slipUps || []).filter((s: any) => s.id !== req.params.id);
  writeDatabase(db);
  res.json({ success: true, slipUps: db.slipUps });
});

// Cravings endpoints
app.post('/api/cravings', (req, res) => {
  const db = readDatabase();
  db.cravings = [req.body, ...(db.cravings || [])];
  writeDatabase(db);
  res.json({ success: true, cravings: db.cravings });
});

// Goals endpoints
app.post('/api/goals', (req, res) => {
  const db = readDatabase();
  db.goals = req.body;
  writeDatabase(db);
  res.json({ success: true, goals: db.goals });
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
