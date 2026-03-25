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
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { fileName, fileData, mimeType } = input;

        if (!fileData) {
          throw new Error("No file data provided");
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(fileData, "base64");

        // Generate unique filename
        const ext = fileName.split(".").pop() || "jpg";
        const filename = `laptop-${nanoid()}.${ext}`;

        // Upload to S3
        const { url } = await storagePut(filename, buffer, mimeType);

        return { url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }),
});
