import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getAllSmartDevices, getSmartDeviceById, createSmartDevice, updateSmartDevice, deleteSmartDevice } from "../db";
import { TRPCError } from "@trpc/server";

const smartDeviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  connectivity: z.string().min(1, "Connectivity is required"),
  battery: z.string().min(1, "Battery is required"),
  features: z.string().min(1, "Features are required"),
  compatibility: z.string().min(1, "Compatibility is required"),
  condition: z.string().min(1, "Condition is required"),
  warranty: z.string().min(1, "Warranty is required"),
  price: z.number().positive("Price must be positive"),
  discountPercent: z.number().min(0).max(100).optional().default(0),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["promotions", "refurbished", "new", "business"]).default("new"),
});

export const smartDevicesRouter = router({
  list: publicProcedure.query(async () => {
    return getAllSmartDevices();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const device = await getSmartDeviceById(input.id);
      if (!device) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Smart device not found",
        });
      }
      return device;
    }),

  create: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create smart devices",
        });
      }
      return next({ ctx });
    })
    .input(smartDeviceSchema)
    .mutation(async ({ input }) => {
      return createSmartDevice({
        ...input,
        category: input.category || "new",
      });
    }),

  update: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update smart devices",
        });
      }
      return next({ ctx });
    })
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.string().optional(),
        brand: z.string().optional(),
        connectivity: z.string().optional(),
        battery: z.string().optional(),
        features: z.string().optional(),
        compatibility: z.string().optional(),
        condition: z.string().optional(),
        warranty: z.string().optional(),
        price: z.number().optional(),
        discountPercent: z.number().min(0).max(100).optional(),
        imageUrl: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["promotions", "refurbished", "new", "business"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateSmartDevice(id, data);
    }),

  delete: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete smart devices",
        });
      }
      return next({ ctx });
    })
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteSmartDevice(input.id);
    }),
});
