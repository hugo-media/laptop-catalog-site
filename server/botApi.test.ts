import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import request from "supertest";
import botApi from "./botApi";

describe("Bot API", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/bot", botApi);
  });

  describe("POST /api/bot/product", () => {
    it("should add a laptop product successfully", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Test Laptop",
        price: 2999.99,
        description: "A test laptop for validation",
        imageUrl: "https://example.com/laptop.jpg",
        category: "laptops",
        warranty: "2 years",
        condition: "new",
        processor: "Intel Core i7",
        ram: "16GB",
        storage: "512GB SSD",
        display: "15.6 inch FHD",
        graphicsCard: "NVIDIA RTX 3050",
        operatingSystem: "Windows 11",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Laptop");
      expect(response.body.data.category).toBe("laptops");
    });

    it("should add a monitor product successfully", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Test Monitor",
        price: 1499.99,
        description: "A test monitor",
        imageUrl: "https://example.com/monitor.jpg",
        category: "monitors",
        warranty: "3 years",
        condition: "new",
        resolution: "4K (3840x2160)",
        panelType: "IPS",
        refreshRate: "60Hz",
        brightness: "350 nits",
        contrast: "1000:1",
        responseTime: "5ms",
        connectivity: "HDMI, DisplayPort",
        size: "27 inch",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Monitor");
      expect(response.body.data.category).toBe("monitors");
    });

    it("should add a tablet product successfully", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Test Tablet",
        price: 1999.99,
        description: "A test tablet",
        imageUrl: "https://example.com/tablet.jpg",
        category: "tablets",
        warranty: "1 year",
        condition: "new",
        processor: "Apple M1",
        ram: "8GB",
        storage: "256GB",
        display: "11 inch",
        operatingSystem: "iPadOS",
        battery: "40Wh",
        camera: "12MP + 12MP",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Tablet");
      expect(response.body.data.category).toBe("tablets");
    });

    it("should add a smart device product successfully", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Test Smart Device",
        price: 799.99,
        description: "A test smart device",
        imageUrl: "https://example.com/device.jpg",
        category: "smartDevices",
        warranty: "1 year",
        condition: "new",
        type: "Smartwatch",
        brand: "Apple",
        battery: "18 hours",
        features: "Heart rate, GPS, Water resistant",
        compatibility: "iOS",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Smart Device");
      expect(response.body.data.category).toBe("smartDevices");
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Incomplete Product",
        // Missing price, description, imageUrl, category
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation error");
      expect(response.body.details).toBeDefined();
      expect(response.body.details.length).toBeGreaterThan(0);
    });

    it("should return 400 for invalid category", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Invalid Category Product",
        price: 999.99,
        description: "Test",
        imageUrl: "https://example.com/test.jpg",
        category: "invalidCategory",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation error");
    });

    it("should return 400 for negative price", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Negative Price Product",
        price: -100,
        description: "Test",
        imageUrl: "https://example.com/test.jpg",
        category: "laptops",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation error");
    });

    it("should return 400 for invalid image URL", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Invalid URL Product",
        price: 999.99,
        description: "Test",
        imageUrl: "not-a-valid-url",
        category: "laptops",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation error");
    });

    it("should use default values for optional fields", async () => {
      const response = await request(app).post("/api/bot/product").send({
        name: "Product with Defaults",
        price: 1500,
        description: "Test product",
        imageUrl: "https://example.com/test.jpg",
        category: "laptops",
        // warranty and condition are optional, should use defaults
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/bot/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/bot/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.message).toBe("Bot API is running");
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
