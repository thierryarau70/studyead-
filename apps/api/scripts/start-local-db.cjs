const ep = require('embedded-postgres');
const EmbeddedPostgres = ep.default || ep.EmbeddedPostgres || ep;
const path = require('path');
const fs = require('fs');

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
  } catch (err) {
    console.log('Database already initialized, starting...');
  }

  await pg.start();

  try {
    await pg.createDatabase('studyead');
  } catch (err) {
    // If already exists, ignore
  }

  console.log('✅ Embedded PostgreSQL running at: postgresql://studyead:localdevpassword@localhost:5432/studyead');

  // Keep process alive
  setInterval(() => {}, 60000);
}

main().catch((err) => {
  console.error('Failed to start embedded PostgreSQL:', err);
});
