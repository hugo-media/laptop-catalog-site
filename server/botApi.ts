import { Router, Request, Response } from "express";
import {
  createLaptop,
  createMonitor,
  createSmartDevice,
  createTablet,
} from "./db";
import { InsertLaptop, InsertMonitor, InsertSmartDevice, InsertTablet } from "../drizzle/schema";
import { z } from "zod";

const router = Router();

// Middleware to verify BOT_API_SECRET
const verifyBotSecret = (req: Request, res: Response, next: Function) => {
  const secret = req.headers["x-bot-secret"] || req.query.secret;
  const expectedSecret = process.env.BOT_API_SECRET;

  if (!expectedSecret) {
    console.error("BOT_API_SECRET is not configured");
    return res.status(500).json({
      error: "Server configuration error",
      message: "BOT_API_SECRET is not set",
    });
  }

  if (secret !== expectedSecret) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing BOT_API_SECRET",
    });
  }

  next();
};

// Validation schema for product data
const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL"),
  category: z.enum(["laptops", "monitors", "smartDevices", "tablets"]),
  warranty: z.string().optional().default("No warranty"),
  condition: z.string().optional().default("new"),
  // Laptop-specific fields
  processor: z.string().optional(),
  graphicsCard: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  display: z.string().optional(),
  operatingSystem: z.string().optional(),
  // Monitor-specific fields
  resolution: z.string().optional(),
  panelType: z.string().optional(),
  refreshRate: z.string().optional(),
  brightness: z.string().optional(),
  contrast: z.string().optional(),
  responseTime: z.string().optional(),
  connectivity: z.string().optional(),
  size: z.string().optional(),
  // SmartDevice-specific fields
  type: z.string().optional(),
  brand: z.string().optional(),
  battery: z.string().optional(),
  features: z.string().optional(),
  compatibility: z.string().optional(),
  // Tablet-specific fields
  camera: z.string().optional(),
});

type ProductInput = z.infer<typeof ProductSchema>;

// POST /api/bot/product - Add product from Telegram bot
router.post("/product", verifyBotSecret, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = ProductSchema.parse(req.body);

    const {
      name,
      price,
      description,
      imageUrl,
      category,
      warranty,
      condition,
      ...specs
    } = validatedData;

    // Map category to table and insert product
    let result;

    switch (category) {
      case "laptops": {
        const data: InsertLaptop = {
          name,
          price,
          description,
          imageUrl,
          warranty,
          condition,
          processor: specs.processor || "Not specified",
          graphicsCard: specs.graphicsCard || "Not specified",
          ram: specs.ram || "Not specified",
          storage: specs.storage || "Not specified",
          display: specs.display || "Not specified",
          operatingSystem: specs.operatingSystem || "Not specified",
        };
        result = await createLaptop(data);
        break;
      }

      case "monitors": {
        const data: InsertMonitor = {
          name,
          price,
          description,
          imageUrl,
          warranty,
          condition,
          resolution: specs.resolution || "Not specified",
          panelType: specs.panelType || "Not specified",
          refreshRate: specs.refreshRate || "Not specified",
          brightness: specs.brightness || "Not specified",
          contrast: specs.contrast || "Not specified",
          responseTime: specs.responseTime || "Not specified",
          connectivity: specs.connectivity || "Not specified",
          size: specs.size || "Not specified",
        };
        result = await createMonitor(data);
        break;
      }

      case "smartDevices": {
        const data: InsertSmartDevice = {
          type: specs.type || "Device",
          name,
          price,
          description,
          imageUrl,
          warranty,
          condition,
          brand: specs.brand || "Not specified",
          connectivity: specs.connectivity || "Not specified",
          battery: specs.battery || "Not specified",
          features: specs.features || "Not specified",
          compatibility: specs.compatibility || "Not specified",
        };
        result = await createSmartDevice(data);
        break;
      }

      case "tablets": {
        const data: InsertTablet = {
          name,
          price,
          description,
          imageUrl,
          warranty,
          condition,
          processor: specs.processor || "Not specified",
          ram: specs.ram || "Not specified",
          storage: specs.storage || "Not specified",
          display: specs.display || "Not specified",
          operatingSystem: specs.operatingSystem || "Not specified",
          battery: specs.battery || "Not specified",
          camera: specs.camera || "Not specified",
        };
        result = await createTablet(data);
        break;
      }

      default:
        return res.status(400).json({
          error: "Invalid category",
          message: `Category must be one of: laptops, monitors, smartDevices, tablets`,
        });
    }

    return res.status(201).json({
      success: true,
      message: `Product "${name}" added successfully to ${category}`,
      data: {
        name,
        price,
        category,
        condition,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // Handle database errors
    if (error instanceof Error) {
      console.error("Bot API error:", error);
      return res.status(500).json({
        error: "Database error",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// GET /api/bot/health - Health check for bot
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Bot API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
