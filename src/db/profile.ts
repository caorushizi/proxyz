import { IDBPDatabase, openDB } from "idb";
import { ProfileType } from "../helper/constant";

let db: IDBPDatabase<ProfileType> | null = null;

async function getDB() {
  if (!db) {
    db = await openDB<ProfileType>("Proxyz", 1, {
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
  profile: Omit<ProfileType, "id">,
): Promise<number> {
  const db = await getDB();
  const id = await db.add("profiles", profile);
  return id as number;
}

export async function getProfiles(): Promise<ProfileType[]> {
  const db = await getDB();
  return await db.getAll("profiles");
}

export async function findProfile(id: number) {
  const db = await getDB();
  return await db.get("profiles", id);
}

export async function updateProfile(profile: ProfileType) {
  const db = await getDB();
  await db.put("profiles", profile);
}
