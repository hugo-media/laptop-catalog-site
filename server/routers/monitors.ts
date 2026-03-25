import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getAllMonitors, getMonitorById, createMonitor, updateMonitor, deleteMonitor } from "../db";
import { TRPCError } from "@trpc/server";

const monitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  resolution: z.string().min(1, "Resolution is required"),
  panelType: z.string().min(1, "Panel type is required"),
  refreshRate: z.string().min(1, "Refresh rate is required"),
  brightness: z.string().min(1, "Brightness is required"),
  contrast: z.string().min(1, "Contrast is required"),
  responseTime: z.string().min(1, "Response time is required"),
  connectivity: z.string().min(1, "Connectivity is required"),
  size: z.string().min(1, "Size is required"),
  condition: z.string().min(1, "Condition is required"),
  warranty: z.string().min(1, "Warranty is required"),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["promotions", "refurbished", "new", "gaming", "professional", "budget"]).default("new"),
});

export const monitorsRouter = router({
  list: publicProcedure.query(async () => {
    return getAllMonitors();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const monitor = await getMonitorById(input.id);
      if (!monitor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Monitor not found",
        });
      }
      return monitor;
    }),

  create: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create monitors",
        });
      }
      return next({ ctx });
    })
    .input(monitorSchema)
    .mutation(async ({ input }) => {
      return createMonitor({
        ...input,
        category: input.category || "new",
      });
    }),

  update: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update monitors",
        });
      }
      return next({ ctx });
    })
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        resolution: z.string().optional(),
        panelType: z.string().optional(),
        refreshRate: z.string().optional(),
        brightness: z.string().optional(),
        contrast: z.string().optional(),
        responseTime: z.string().optional(),
        connectivity: z.string().optional(),
        size: z.string().optional(),
        condition: z.string().optional(),
        warranty: z.string().optional(),
        price: z.number().optional(),
        imageUrl: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["promotions", "refurbished", "new", "gaming", "professional", "budget"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateMonitor(id, data);
    }),

  delete: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete monitors",
        });
      }
      return next({ ctx });
    })
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteMonitor(input.id);
    }),
});
