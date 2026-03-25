import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router, protectedProcedure } from "./trpc";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  uploadImage: protectedProcedure
    .use(async ({ ctx, next }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can upload images",
        });
      }
      return next({ ctx });
    })
    .input(z.any())
    .mutation(async ({ input }) => {
      try {
        const formData = input as FormData;
        const file = formData.get("file") as File;

        if (!file) {
          throw new Error("No file provided");
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `laptop-${nanoid()}.${ext}`;

        // Upload to S3
        const { url } = await storagePut(filename, uint8Array, file.type);

        return { url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }),
});
