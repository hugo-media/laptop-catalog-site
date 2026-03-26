import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getAllTablets, getTabletById, createTablet, updateTablet, deleteTablet } from "../db";
import { TRPCError } from "@trpc/server";

const tabletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  processor: z.string().min(1, "Processor is required"),
  ram: z.string().min(1, "RAM is required"),
  storage: z.string().min(1, "Storage is required"),
  display: z.string().min(1, "Display is required"),
  operatingSystem: z.string().min(1, "OS is required"),
  battery: z.string().min(1, "Battery is required"),
  camera: z.string().min(1, "Camera is required"),
  condition: z.string().min(1, "Condition is required"),
  warranty: z.string().min(1, "Warranty is required"),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["promotions", "refurbished", "new", "business"]).default("new"),
});

export const tabletsRouter = router({
  list: publicProcedure.query(async () => {
    return getAllTablets();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const tablet = await getTabletById(input.id);
      if (!tablet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tablet not found",
        });
      }
      return tablet;
    }),

  create: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create tablets",
        });
      }
      return next({ ctx });
    })
    .input(tabletSchema)
    .mutation(async ({ input }) => {
      return createTablet({
        ...input,
        category: input.category || "new",
      });
    }),

  update: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update tablets",
        });
      }
      return next({ ctx });
    })
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        processor: z.string().optional(),
        ram: z.string().optional(),
        storage: z.string().optional(),
        display: z.string().optional(),
        operatingSystem: z.string().optional(),
        battery: z.string().optional(),
        camera: z.string().optional(),
        condition: z.string().optional(),
        warranty: z.string().optional(),
        price: z.number().optional(),
        imageUrl: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["promotions", "refurbished", "new", "business"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateTablet(id, data);
    }),

  delete: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete tablets",
        });
      }
      return next({ ctx });
    })
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteTablet(input.id);
    }),
});
