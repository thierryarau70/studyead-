const EmbeddedPostgresRaw = require('embedded-postgres');
const EmbeddedPostgres = EmbeddedPostgresRaw.default || EmbeddedPostgresRaw;
import * as path from 'path';
import * as fs from 'fs';

const dbDir = path.resolve(__dirname, '../../../.local_postgres_data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const pg = new EmbeddedPostgres({
  databaseDir: dbDir,
  port: 5432,
  user: 'studyead',
  password: 'localdevpassword',
  persistent: true,
});

async function main() {
  console.log('🐘 Starting embedded PostgreSQL database on port 5432...');
  try {
    await pg.initialise();
  } catch (err: any) {
    // If already initialized, ignore
    console.log('Database already initialized or preparing...');
  }

  await pg.start();

  try {
    await pg.createDatabase('studyead');
  } catch (err) {
    // If already exists, ignore
  }

  console.log('✅ Embedded PostgreSQL running at: postgresql://studyead:localdevpassword@localhost:5432/studyead');
  console.log('Database is ready for Prisma migrations and NestJS API.');

  // Keep alive
  process.on('SIGINT', async () => {
    console.log('Stopping PostgreSQL...');
    await pg.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Failed to start embedded PostgreSQL:', err);
});
