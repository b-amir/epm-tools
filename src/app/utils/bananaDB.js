import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDB() {
  return open({
    filename: "./banana.db",
    driver: sqlite3.Database,
  });
}

export async function getBananaCount() {
  const db = await openDB();
  await db.run(
    "CREATE TABLE IF NOT EXISTS bananas (id INTEGER PRIMARY KEY, count INTEGER)"
  );
  const row = await db.get("SELECT count FROM bananas WHERE id = 1");
  await db.close();
  return row ? row.count : 0;
}

export async function incrementBananaCount() {
  const db = await openDB();
  await db.run(
    "CREATE TABLE IF NOT EXISTS bananas (id INTEGER PRIMARY KEY, count INTEGER)"
  );
  await db.run(
    "INSERT OR REPLACE INTO bananas (id, count) VALUES (1, COALESCE((SELECT count FROM bananas WHERE id = 1), 0) + 1)"
  );
  const row = await db.get("SELECT count FROM bananas WHERE id = 1");
  await db.close();
  return row.count;
}
