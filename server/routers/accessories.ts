import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getAllAccessories, getAccessoryById, createAccessory, updateAccessory, deleteAccessory } from "../db";
import { TRPCError } from "@trpc/server";

const accessorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  compatibility: z.string().min(1, "Compatibility is required"),
  color: z.string().min(1, "Color is required"),
  condition: z.string().min(1, "Condition is required"),
  warranty: z.string().min(1, "Warranty is required"),
  price: z.number().positive("Price must be positive"),
  discountPercent: z.number().min(0).max(100).optional().default(0),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["promotions", "refurbished", "new", "business"]).default("new"),
});

export const accessoriesRouter = router({
  list: publicProcedure.query(async () => {
    return getAllAccessories();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const accessory = await getAccessoryById(input.id);
      if (!accessory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Accessory not found",
        });
      }
      return accessory;
    }),

  create: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create accessories",
        });
      }
      return next({ ctx });
    })
    .input(accessorySchema)
    .mutation(async ({ input }) => {
      return createAccessory({
        ...input,
        category: input.category || "new",
      });
    }),

  update: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update accessories",
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
        compatibility: z.string().optional(),
        color: z.string().optional(),
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
      return updateAccessory(id, data);
    }),

  delete: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete accessories",
        });
      }
      return next({ ctx });
    })
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteAccessory(input.id);
    }),
});
