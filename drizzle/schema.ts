import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const laptops = mysqlTable("laptops", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  processor: varchar("processor", { length: 255 }).notNull(),
  graphicsCard: varchar("graphicsCard", { length: 255 }).notNull(),
  ram: varchar("ram", { length: 100 }).notNull(),
  storage: varchar("storage", { length: 100 }).notNull(),
  display: varchar("display", { length: 100 }).notNull(),
  operatingSystem: varchar("operatingSystem", { length: 100 }).notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  warranty: varchar("warranty", { length: 100 }).notNull(),
  price: int("price").notNull(),
  imageUrl: text("imageUrl"),
  description: text("description"),
  category: mysqlEnum("category", ["promotions", "refurbished", "new", "monitors", "accessories", "business"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Laptop = typeof laptops.$inferSelect;
export type InsertLaptop = typeof laptops.$inferInsert;

export const monitors = mysqlTable("monitors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  resolution: varchar("resolution", { length: 100 }).notNull(), // e.g., "1920x1080", "2560x1440"
  panelType: varchar("panelType", { length: 100 }).notNull(), // e.g., "IPS", "VA", "TN", "OLED"
  refreshRate: varchar("refreshRate", { length: 100 }).notNull(), // e.g., "60Hz", "144Hz", "240Hz"
  brightness: varchar("brightness", { length: 100 }).notNull(), // e.g., "300 nits"
  contrast: varchar("contrast", { length: 100 }).notNull(), // e.g., "1000:1"
  responseTime: varchar("responseTime", { length: 100 }).notNull(), // e.g., "1ms", "5ms"
  connectivity: varchar("connectivity", { length: 255 }).notNull(), // e.g., "HDMI, DisplayPort, USB-C"
  size: varchar("size", { length: 50 }).notNull(), // e.g., "27 inch", "32 inch"
  condition: varchar("condition", { length: 50 }).notNull(),
  warranty: varchar("warranty", { length: 100 }).notNull(),
  price: int("price").notNull(),
  imageUrl: text("imageUrl"),
  description: text("description"),
  category: mysqlEnum("category", ["promotions", "refurbished", "new", "gaming", "professional", "budget"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Monitor = typeof monitors.$inferSelect;
export type InsertMonitor = typeof monitors.$inferInsert;

// TODO: Add your tables here