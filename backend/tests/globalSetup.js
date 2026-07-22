const { execSync } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

module.exports = async function globalSetup() {
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

  const dbUrl = process.env.DATABASE_URL;
  const url = new URL(dbUrl);
  const dbName = url.pathname.slice(1);

  const client = new Client({
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    database: 'postgres',
  });

  await client.connect();
  try {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Test database "${dbName}" created`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`ℹ️  Test database "${dbName}" already exists`);
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }

  execSync('npx prisma db push --force-reset --accept-data-loss', {
    env: { ...process.env },
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });

  console.log('✅ Test database schema ready');
};
