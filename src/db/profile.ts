import { IDBPDatabase, openDB } from "idb";
import { ProxyMode } from "../helper";
import { Profile } from "../helper/constant";

let db: IDBPDatabase<Profile> | null = null;

async function getDB() {
  if (!db) {
    db = await openDB<Profile>("Proxyz", 1, {
      upgrade(db) {
        const store = db.createObjectStore("profiles", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("date", "index");
      },
    });
  }
  return db;
}

async function addProfile(
  name: string,
  type: ProxyMode,
  color: string,
): Promise<number> {
  const db = await getDB();
  const id = await db.add("profiles", {
    name,
    type,
    color,
  });
  return id as number;
}

async function getProfiles() {
  const db = await getDB();
  return await db.getAll("profiles");
}

async function findProfile(id: number) {
  const db = await getDB();
  return await db.get("profiles", id);
}

export default {
  addProfile,
  getProfiles,
  findProfile,
};
