/* =========================================
   IMPORT HUBSPOT CSV (CORREGIDO)
   Mapea Clientes, Vehículos y Trámites
   Evita error de serverTimestamp en arrays
========================================= */

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

// Definición básica de tipos para el script
interface CsvRow {
  [key: string]: string;
}

/* =======================
   Firebase Setup
======================= */
// Busca la credencial en varias ubicaciones posibles
const posiblesRutas = [
  path.join(__dirname, "../hoymismoagencia/hoymismoagencia-firebase-adminsdk-fbsvc-c3a5e99745.json"),
  path.join(__dirname, "../hoymismoagencia-firebase-adminsdk-fbsvc-c3a5e99745.json"),
  process.env.FIREBASE_CREDENTIALS_PATH || ""
];

const serviceAccountPath = posiblesRutas.find(p => p && fs.existsSync(p));

if (!serviceAccountPath) {
  console.error("❌ No se encontró el archivo de credenciales de Firebase Admin.");
  console.error("   Por favor descarga el JSON de Firebase Console > Project Settings > Service Accounts");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

/* =======================
   Helpers CSV
======================= */
function readCsvLines(filePath: string): string[] {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw
    .replace(/^\uFEFF/, "") // Eliminar BOM si existe
    .split(/\r?\n/) // Separar por líneas
    .filter((l) => l.trim().length > 0); // Quitar líneas vacías
}

// Parsea una línea respetando comillas
function parseLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
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
  if (lines.length === 0) return [];

  // Asumimos que la primera línea son los headers
  const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, '')); // Quitar comillas extra de headers
  
  const rows: CsvRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    // Mapear headers a valores
    const row: CsvRow = {};
    headers.forEach((h, idx) => {
      // Quitar comillas de los valores si las tienen
      let val = values[idx] || "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      row[h] = val;
    });
    rows.push(row);
  }
  
  return rows;
}

/* =======================
   Lógica de Importación
======================= */

// Helper para limpiar strings
const clean = (str: string) => str ? str.trim() : "";
// Helper para fechas
const now = admin.firestore.Timestamp.now();

async function runImport() {
  const csvFilePath = path.join(__dirname, "../hoymismoagencia/hubspot-contactos.csv");
  
  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`Archivo CSV no encontrado en: ${csvFilePath}`);
  }

  console.log("🚀 Iniciando importación...");
  const rows = parseCSV(csvFilePath);
  console.log(`📊 Total de filas encontradas: ${rows.length}`);

  let clientsCount = 0;
  let vehiclesCount = 0;
  let processesCount = 0;
  let errors: string[] = [];

  const batchSize = 400; // Firebase permite max 500 por batch
  let batch = db.batch();
  let operationCount = 0;

  for (const row of rows) {
    try {
      const email = clean(row["Correo"]);
      if (!email) continue; // Saltar si no hay email

      // 1. Crear ID de Cliente (basado en email para evitar duplicados en importaciones sucesivas)
      const clientId = "CLT-" + Buffer.from(email).toString('base64').replace(/=/g, '').substring(0, 10).toUpperCase();
      const clientRef = db.collection('clients').doc(clientId);

      // Datos del Cliente
      const clientData = {
        clientId: clientId,
        hubspotId: clean(row["ID de registro"]),
        name: clean(row["Nombre"]) || "Desconocido",
        lastName: clean(row["Apellidos"]) || "",
        email: email,
        phone: clean(row["Número de teléfono"]) || clean(row["Número de móvil"]),
        whatsapp: clean(row["Número de móvil"]),
        address: {
          street: clean(row["Dirección"]),
          city: clean(row["Ciudad"]),
          state: clean(row["Estado/región"]),
          zipCode: clean(row["Código postal"]),
          country: clean(row["País/región"]) || "Mexico"
        },
        type: "individual",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        tags: ["migracion-hubspot"],
        totalProcesses: 0
      };

      batch.set(clientRef, clientData, { merge: true });
      clientsCount++;
      operationCount++;

      // 2. Crear Vehículo (si existe VIN)
      const vin = clean(row["VIN"]);
      let vehicleId = null;
      
      if (vin) {
        vehicleId = "VEH-" + vin;
        const vehicleRef = db.collection('vehicles').doc(vehicleId);
        
        const vehicleData = {
          vin: vin,
          brand: clean(row["MARCA"]),
          model: clean(row["MODELO"]),
          color: clean(row["COLOR"]),
          year: parseInt(clean(row["Antigüedad"])) || null,
          clientId: clientId,
          createdAt: now,
          updatedAt: now,
          // Convertir URLs de fotos separadas por ;
          photosUrls: clean(row["FOTOS"]).split(';').map(u => u.trim()).filter(u => u)
        };

        batch.set(vehicleRef, vehicleData, { merge: true });
        vehiclesCount++;
        operationCount++;
      }

      // 3. Crear Trámite (Si hay Folio o Estatus)
      const folio = clean(row["FOLIO"]);
      const statusHubspot = clean(row["ESTATUS ACTUAL"]);
      
      if (folio || statusHubspot) {
        const processId = folio ? `USHO-${folio}` : `PROC-${clientId}`;
        const processRef = db.collection('import_processes').doc(processId);

        // Mapeo simple de estatus
        let status = 'contacto-creado';
        if (statusHubspot.toLowerCase().includes('finalizado')) status = 'tramite-finalizado';
        else if (statusHubspot.toLowerCase().includes('proceso')) status = 'tramite-en-proceso';
        else if (statusHubspot.toLowerCase().includes('document')) status = 'documentacion-inicial';

        // NOTA: Aquí usamos 'now' (Timestamp) en lugar de serverTimestamp() para evitar el error en arrays
        const historyEvent = {
          date: now, 
          status: status,
          location: clean(row["OFICINA"]) || "Sistema",
          description: "Importado desde HubSpot"
        };

        const processData = {
          folio: folio || "PENDIENTE",
          clientId: clientId,
          clientName: `${clientData.name} ${clientData.lastName}`,
          vehicleId: vehicleId || "",
          vehicleVin: vin || "",
          vehicleBrand: clean(row["MARCA"]),
          vehicleModel: clean(row["MODELO"]),
          status: status,
          oficina: clean(row["OFICINA"]),
          tipoPedimento: clean(row["TIPO DE PEDIMENTO"]),
          anticipo: parseFloat(clean(row["ANTICIPO"])) || 0,
          liquidacion: parseFloat(clean(row["LIQUIDACIÓN"])) || 0,
          gestorName: clean(row["GESTOR"]) || clean(row["GESTOR HoyMismo"]),
          createdAt: now,
          updatedAt: now,
          // Aquí evitamos serverTimestamp dentro del array
          processHistory: [historyEvent] 
        };

        batch.set(processRef, processData, { merge: true });
        processesCount++;
        operationCount++;
      }

      // Ejecutar batch si alcanza el límite
      if (operationCount >= batchSize) {
        console.log(`💾 Guardando lote...`);
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }

    } catch (e: any) {
      console.error(`❌ Error en fila: ${e.message}`);
      errors.push(e.message);
    }
  }

  // Guardar remanentes
  if (operationCount > 0) {
    console.log(`💾 Guardando lote final...`);
    await batch.commit();
  }

  return { clients: clientsCount, vehicles: vehiclesCount, processes: processesCount, errors };
}

runImport()
  .then((r) => {
    console.log("======================================");
    console.log("🎉 IMPORTACIÓN EXITOSA");
    console.log(`👤 Clientes: ${r.clients}`);
    console.log(`🚗 Vehículos: ${r.vehicles}`);
    console.log(`folder Trámites: ${r.processes}`);
    console.log(`❌ Errores: ${r.errors.length}`);
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ ERROR FATAL:", e);
    process.exit(1);
  });