/* =========================================
   DELETE HUBSPOT IMPORTED DATA
   Elimina todos los datos importados de HubSpot
   para dejar solo registros nuevos
========================================= */

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

/* =======================
   Firebase Setup
======================= */
const posiblesRutas = [
  path.join(__dirname, "../hoymismoagencia/hoymismoagencia-firebase-adminsdk-fbsvc-c3a5e99745.json"),
  path.join(__dirname, "../hoymismoagencia-firebase-adminsdk-fbsvc-c3a5e99745.json"),
  process.env.FIREBASE_CREDENTIALS_PATH || ""
];

const serviceAccountPath = posiblesRutas.find(p => p && fs.existsSync(p));

if (!serviceAccountPath) {
  console.error("❌ No se encontró el archivo de credenciales de Firebase Admin.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

/* =======================
   Delete Functions
======================= */

async function deleteCollection(collectionName: string, query?: admin.firestore.Query) {
  const batchSize = 400;
  let totalDeleted = 0;

  const baseQuery = query || db.collection(collectionName);

  while (true) {
    const snapshot = await baseQuery.limit(batchSize).get();

    if (snapshot.empty) {
      break;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    totalDeleted += snapshot.size;
    console.log(`  - Eliminados ${totalDeleted} documentos de ${collectionName}...`);

    // Si se eliminaron menos que el batchSize, terminamos
    if (snapshot.size < batchSize) {
      break;
    }
  }

  return totalDeleted;
}

async function runCleanup() {
  console.log("🚀 Iniciando limpieza de datos de HubSpot...\n");

  const results = {
    clients: 0,
    vehicles: 0,
    processes: 0,
    invoices: 0
  };

  try {
    // 1. Eliminar clientes con tag "migracion-hubspot"
    console.log("📦 Eliminando clientes importados de HubSpot...");
    const clientsQuery = db.collection('clients').where('tags', 'array-contains', 'migracion-hubspot');
    results.clients = await deleteCollection('clients', clientsQuery);
    console.log(`✅ Clientes eliminados: ${results.clients}\n`);

    // 2. Eliminar vehículos (los que tienen clientId de migración)
    console.log("🚗 Eliminando vehículos...");
    // Primero obtenemos los IDs de clientes eliminados
    const vehiclesSnapshot = await db.collection('vehicles').get();
    let vehicleBatch = db.batch();
    let vehicleCount = 0;
    let vehicleBatchCount = 0;

    for (const doc of vehiclesSnapshot.docs) {
      const data = doc.data();
      // Eliminar vehículos cuyo clientId empiece con CLT- (formato de migración)
      if (data.clientId && data.clientId.startsWith('CLT-')) {
        vehicleBatch.delete(doc.ref);
        vehicleCount++;
        vehicleBatchCount++;

        if (vehicleBatchCount >= 400) {
          await vehicleBatch.commit();
          vehicleBatch = db.batch();
          vehicleBatchCount = 0;
          console.log(`  - Eliminados ${vehicleCount} vehículos...`);
        }
      }
    }

    if (vehicleBatchCount > 0) {
      await vehicleBatch.commit();
    }
    results.vehicles = vehicleCount;
    console.log(`✅ Vehículos eliminados: ${results.vehicles}\n`);

    // 3. Eliminar trámites de importación
    console.log("📄 Eliminando trámites de importación...");
    const processesSnapshot = await db.collection('import_processes').get();
    let processBatch = db.batch();
    let processCount = 0;
    let processBatchCount = 0;

    for (const doc of processesSnapshot.docs) {
      const data = doc.data();
      // Eliminar trámites cuyo clientId empiece con CLT- o que tengan "Importado desde HubSpot" en el historial
      const isHubspotImport = data.clientId?.startsWith('CLT-') ||
        (data.processHistory && data.processHistory.some((h: any) => h.description?.includes('HubSpot')));

      if (isHubspotImport) {
        processBatch.delete(doc.ref);
        processCount++;
        processBatchCount++;

        if (processBatchCount >= 400) {
          await processBatch.commit();
          processBatch = db.batch();
          processBatchCount = 0;
          console.log(`  - Eliminados ${processCount} trámites...`);
        }
      }
    }

    if (processBatchCount > 0) {
      await processBatch.commit();
    }
    results.processes = processCount;
    console.log(`✅ Trámites eliminados: ${results.processes}\n`);

    // 4. Eliminar facturas asociadas a clientes de HubSpot
    console.log("💰 Eliminando facturas asociadas...");
    const invoicesSnapshot = await db.collection('invoices').get();
    let invoiceBatch = db.batch();
    let invoiceCount = 0;
    let invoiceBatchCount = 0;

    for (const doc of invoicesSnapshot.docs) {
      const data = doc.data();
      // Eliminar facturas cuyo clientId empiece con CLT-
      if (data.clientId && data.clientId.startsWith('CLT-')) {
        invoiceBatch.delete(doc.ref);
        invoiceCount++;
        invoiceBatchCount++;

        if (invoiceBatchCount >= 400) {
          await invoiceBatch.commit();
          invoiceBatch = db.batch();
          invoiceBatchCount = 0;
          console.log(`  - Eliminadas ${invoiceCount} facturas...`);
        }
      }
    }

    if (invoiceBatchCount > 0) {
      await invoiceBatch.commit();
    }
    results.invoices = invoiceCount;
    console.log(`✅ Facturas eliminadas: ${results.invoices}\n`);

    return results;

  } catch (error) {
    console.error("❌ Error durante la limpieza:", error);
    throw error;
  }
}

// Ejecutar
runCleanup()
  .then((results) => {
    console.log("======================================");
    console.log("🎉 LIMPIEZA COMPLETADA EXITOSAMENTE");
    console.log("======================================");
    console.log(`👤 Clientes eliminados: ${results.clients}`);
    console.log(`🚗 Vehículos eliminados: ${results.vehicles}`);
    console.log(`📄 Trámites eliminados: ${results.processes}`);
    console.log(`💰 Facturas eliminadas: ${results.invoices}`);
    console.log("======================================");
    console.log("\n✨ La base de datos está lista para nuevos registros.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ ERROR FATAL:", error);
    process.exit(1);
  });
