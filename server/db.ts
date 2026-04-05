import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { InsertLaptop, InsertUser, InsertMonitor, InsertAccessory, InsertTablet, InsertSmartDevice, InsertProductRating, InsertWishlist, laptops, users, monitors, accessories, tablets, smartDevices, productRatings, wishlist } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // PostgreSQL: Use insert with onConflict
    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllLaptops() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(laptops).orderBy(desc(laptops.createdAt));
}

export async function getLaptopById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(laptops).where(eq(laptops.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLaptop(data: InsertLaptop) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(laptops).values(data);
  return result;
}

export async function updateLaptop(id: number, data: Partial<InsertLaptop>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const processedData = { ...data };
  if (typeof processedData.categories === 'string' && !processedData.categories.startsWith('[')) {
    processedData.categories = JSON.stringify([processedData.categories]);
  }
  return db.update(laptops).set(processedData).where(eq(laptops.id, id));
}

export async function deleteLaptop(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(laptops).where(eq(laptops.id, id));
}

export async function getAllMonitors() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(monitors).orderBy(desc(monitors.createdAt));
}

export async function getMonitorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(monitors).where(eq(monitors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMonitor(data: InsertMonitor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(monitors).values(data);
  return result;
}

export async function updateMonitor(id: number, data: Partial<InsertMonitor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const processedData = { ...data };
  if (Array.isArray(processedData.categories)) {
    processedData.categories = JSON.stringify(processedData.categories) as any;
  }
  return db.update(monitors).set(processedData).where(eq(monitors.id, id));
}

export async function deleteMonitor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(monitors).where(eq(monitors.id, id));
}

export async function getAllAccessories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accessories).orderBy(desc(accessories.createdAt));
}

export async function getAccessoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accessories).where(eq(accessories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAccessory(data: InsertAccessory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(accessories).values(data);
  return result;
}

export async function updateAccessory(id: number, data: Partial<InsertAccessory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const processedData = { ...data };
  if (Array.isArray(processedData.categories)) {
    processedData.categories = JSON.stringify(processedData.categories) as any;
  }
  return db.update(accessories).set(processedData).where(eq(accessories.id, id));
}

export async function deleteAccessory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(accessories).where(eq(accessories.id, id));
}

export async function getAllTablets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tablets).orderBy(desc(tablets.createdAt));
}

export async function getTabletById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tablets).where(eq(tablets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTablet(data: InsertTablet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tablets).values(data);
  return result;
}

export async function updateTablet(id: number, data: Partial<InsertTablet>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const processedData = { ...data };
  if (Array.isArray(processedData.categories)) {
    processedData.categories = JSON.stringify(processedData.categories) as any;
  }
  return db.update(tablets).set(processedData).where(eq(tablets.id, id));
}

export async function deleteTablet(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(tablets).where(eq(tablets.id, id));
}

export async function getAllSmartDevices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(smartDevices).orderBy(desc(smartDevices.createdAt));
}

export async function getSmartDeviceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(smartDevices).where(eq(smartDevices.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSmartDevice(data: InsertSmartDevice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(smartDevices).values(data);
  return result;
}

export async function updateSmartDevice(id: number, data: Partial<InsertSmartDevice>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const processedData = { ...data };
  if (Array.isArray(processedData.categories)) {
    processedData.categories = JSON.stringify(processedData.categories) as any;
  }
  return db.update(smartDevices).set(processedData).where(eq(smartDevices.id, id));
}

export async function deleteSmartDevice(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(smartDevices).where(eq(smartDevices.id, id));
}

// Ratings and Reviews
export async function getProductRatings(productType: string, productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productRatings).where(and(eq(productRatings.productType, productType), eq(productRatings.productId, productId))).orderBy(desc(productRatings.createdAt));
}

export async function getProductRatingStats(productType: string, productId: number) {
  const db = await getDb();
  if (!db) return { averageRating: 0, totalRatings: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  
  const ratings = await db.select().from(productRatings).where(and(eq(productRatings.productType, productType), eq(productRatings.productId, productId)));
  
  if (ratings.length === 0) {
    return { averageRating: 0, totalRatings: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  
  ratings.forEach(r => {
    totalRating += r.rating;
    distribution[r.rating as keyof typeof distribution]++;
  });
  
  return {
    averageRating: Math.round((totalRating / ratings.length) * 10) / 10,
    totalRatings: ratings.length,
    distribution
  };
}

export async function addProductRating(data: InsertProductRating) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(productRatings).values(data);
}

// Wishlist
export async function getWishlistItems(sessionId?: string, userId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (userId) {
    return db.select().from(wishlist).where(eq(wishlist.userId, userId)).orderBy(desc(wishlist.createdAt));
  } else if (sessionId) {
    return db.select().from(wishlist).where(eq(wishlist.sessionId, sessionId)).orderBy(desc(wishlist.createdAt));
  }
  return [];
}

export async function addToWishlist(data: InsertWishlist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already in wishlist
  const existing = await db.select().from(wishlist).where(
    and(
      eq(wishlist.productType, data.productType),
      eq(wishlist.productId, data.productId),
      data.userId ? eq(wishlist.userId, data.userId) : eq(wishlist.sessionId, data.sessionId || '')
    )
  ).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  return db.insert(wishlist).values(data);
}

export async function removeFromWishlist(productType: string, productId: number, sessionId?: string, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (userId) {
    return db.delete(wishlist).where(
      and(
        eq(wishlist.productType, productType),
        eq(wishlist.productId, productId),
        eq(wishlist.userId, userId)
      )
    );
  } else if (sessionId) {
    return db.delete(wishlist).where(
      and(
        eq(wishlist.productType, productType),
        eq(wishlist.productId, productId),
        eq(wishlist.sessionId, sessionId)
      )
    );
  }
}

// TODO: add feature queries here as your schema grows.
