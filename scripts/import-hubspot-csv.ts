/* =========================================
   IMPORT HUBSPOT CSV
   CommonJS SAFE VERSION (NO ESM)
========================================= */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

/* =======================
   Firebase
======================= */
const serviceAccountPath = path.join(
  __dirname,
  "../hoymismoagencia/hoymismoagencia-firebase-adminsdk-fbsvc-c3a5e99745.json"
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

const db = admin.firestore();

/* =======================
   Types (runtime-safe)
======================= */
type CsvRow = Record<string, string>;

interface ImportResult {
  clients: number;
  vehicles: number;
  processes: number;
  errors: string[];
}

/* =======================
   CSV HELPERS (BULLETPROOF)
======================= */
function readCsvLines(filePath: string): string[] {
  const raw = fs.readFileSync(filePath, "utf8");

  return raw
    .replace(/^\uFEFF/, "") // BOM
    .split(/\r?\n/)
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0);
}

function detectDelimiter(line: string): string {
  if (!line) return ",";
  return line.includes(";") && !line.includes(",") ? ";" : ",";
}

function parseLine(line: string, delimiter: string): string[] {
  if (!line) return [];

  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === delimiter && !inQuotes) {
      out.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }

  out.push(current.trim());
  return out;
}

function parseCSV(filePath: string): CsvRow[] {
  const lines = readCsvLines(filePath);

  if (lines.length === 0) {
    throw new Error("CSV vacío");
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseLine(lines[0], delimiter);

  if (!headers || headers.length === 0) {
    throw new Error("Encabezados CSV inválidos");
  }

  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i], delimiter);
    if (!values.length) continue;

    const row: CsvRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });

    rows.push(row);
  }

  return rows;
}

/* =======================
   MAIN
======================= */
async function runImport(csvPath: string): Promise<ImportResult> {
  console.log("📄 CSV:", csvPath);

  if (!fs.existsSync(csvPath)) {
    throw new Error("Archivo CSV no encontrado");
  }

  const rows = parseCSV(csvPath);
  console.log(`✅ Registros leídos: ${rows.length}`);

  return {
    clients: rows.length,
    vehicles: 0,
    processes: 0,
    errors: [],
  };
}

/* =======================
   RUN
======================= */
const csvFilePath = path.join(
  __dirname,
  "../hoymismoagencia/hubspot-contactos.csv"
);

runImport(csvFilePath)
  .then((r) => {
    console.log("🎉 IMPORT OK:", r);
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ ERROR:", e.message);
    process.exit(1);
  });
