import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getAllLaptops, getLaptopById, createLaptop, updateLaptop, deleteLaptop } from "../db";
import { TRPCError } from "@trpc/server";

const laptopSchema = z.object({
  name: z.string().min(1, "Name is required"),
  processor: z.string().min(1, "Processor is required"),
  graphicsCard: z.string().min(1, "Graphics card is required"),
  ram: z.string().min(1, "RAM is required"),
  storage: z.string().min(1, "Storage is required"),
  display: z.string().min(1, "Display is required"),
  operatingSystem: z.string().min(1, "OS is required"),
  condition: z.string().min(1, "Condition is required"),
  warranty: z.string().min(1, "Warranty is required"),
  price: z.number().positive("Price must be positive"),
});

export const laptopsRouter = router({
  list: publicProcedure.query(async () => {
    return getAllLaptops();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const laptop = await getLaptopById(input.id);
      if (!laptop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Laptop not found",
        });
      }
      return laptop;
    }),

  create: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create laptops",
        });
      }
      return next({ ctx });
    })
    .input(laptopSchema)
    .mutation(async ({ input }) => {
      return createLaptop(input);
    }),

  update: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update laptops",
        });
      }
      return next({ ctx });
    })
    .input(
      z.object({
        id: z.number(),
        ...laptopSchema.partial().shape,
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateLaptop(id, data);
    }),

  delete: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete laptops",
        });
      }
      return next({ ctx });
    })
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteLaptop(input.id);
    }),
});
