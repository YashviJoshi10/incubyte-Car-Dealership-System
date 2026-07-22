import { execSync } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client } from 'pg';

export default async function globalSetup() {
  // Load test env vars in this separate process
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

  const dbUrl = process.env['DATABASE_URL']!;

  // Parse connection info to create the test DB if it doesn't exist
  const url = new URL(dbUrl);
  const dbName = url.pathname.slice(1); // remove leading '/'

  const client = new Client({
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    database: 'postgres', // connect to default DB to create test DB
  });

  await client.connect();
  try {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Test database "${dbName}" created`);
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '42P04') {
      console.log(`ℹ️  Test database "${dbName}" already exists`);
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }

  // Push Prisma schema to test database
  execSync('npx prisma db push --force-reset --accept-data-loss', {
    env: { ...process.env },
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });

  console.log('✅ Test database schema ready');
}
