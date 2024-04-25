import { IDBPDatabase, openDB } from "idb";
import { Profile } from "../store/Profile";
import { ProxyMode } from "../helper";

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

export async function addProfile(
  name: string,
  type: ProxyMode,
): Promise<number> {
  const db = await getDB();
  const id = await db.add("profiles", {
    name,
    type,
  });
  return id as number;
}

export async function getProfiles() {
  const db = await getDB();
  return await db.getAll("profiles");
}
