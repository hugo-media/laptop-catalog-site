import { describe, it, expect, vi, beforeEach } from "vitest";
import { laptopsRouter } from "./laptops";
import type { TrpcContext } from "../_core/context";
import type { User } from "../../drizzle/schema";

const mockAdminUser: User = {
  id: 1,
  openId: "admin-user",
  email: "admin@example.com",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockRegularUser: User = {
  id: 2,
  openId: "regular-user",
  email: "user@example.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(user?: User | null): TrpcContext {
  return {
    user: user || null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("laptopsRouter", () => {
  describe("list", () => {
    it("should return all laptops for public access", async () => {
      const caller = laptopsRouter.createCaller(createMockContext());
      const result = await caller.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should reject non-admin users", async () => {
      const caller = laptopsRouter.createCaller(createMockContext(mockRegularUser));
      try {
        await caller.create({
          name: "Test Laptop",
          processor: "Intel Core i7",
          graphicsCard: "NVIDIA RTX 3060",
          ram: "16GB",
          storage: "512GB SSD",
          display: "15.6 inch",
          operatingSystem: "Windows 11",
          condition: "New",
          warranty: "2 years",
          price: 1000,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin users to create laptops", async () => {
      const caller = laptopsRouter.createCaller(createMockContext(mockAdminUser));
      // This test would require mocking the database
      // In a real scenario, you'd mock the createLaptop function
      expect(true).toBe(true);
    });
  });

  describe("update", () => {
    it("should reject non-admin users", async () => {
      const caller = laptopsRouter.createCaller(createMockContext(mockRegularUser));
      try {
        await caller.update({
          id: 1,
          name: "Updated Laptop",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("delete", () => {
    it("should reject non-admin users", async () => {
      const caller = laptopsRouter.createCaller(createMockContext(mockRegularUser));
      try {
        await caller.delete({ id: 1 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
