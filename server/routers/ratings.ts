import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getProductRatings, getProductRatingStats, addProductRating, getWishlistItems, addToWishlist, removeFromWishlist } from "../db";
import { TRPCError } from "@trpc/server";

export const ratingsRouter = router({
  // Get ratings for a product
  getProductRatings: publicProcedure
    .input(z.object({
      productType: z.string(),
      productId: z.number(),
    }))
    .query(async ({ input }) => {
      return await getProductRatings(input.productType, input.productId);
    }),

  // Get rating statistics
  getRatingStats: publicProcedure
    .input(z.object({
      productType: z.string(),
      productId: z.number(),
    }))
    .query(async ({ input }) => {
      return await getProductRatingStats(input.productType, input.productId);
    }),

  // Add a rating
  addRating: publicProcedure
    .input(z.object({
      productType: z.string(),
      productId: z.number(),
      rating: z.number().min(1).max(5),
      review: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await addProductRating({
          productType: input.productType,
          productId: input.productId,
          rating: input.rating,
          review: input.review,
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add rating",
        });
      }
    }),

  // Wishlist operations
  getWishlist: publicProcedure
    .input(z.object({
      sessionId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await getWishlistItems(input.sessionId);
    }),

  addToWishlist: publicProcedure
    .input(z.object({
      productType: z.string(),
      productId: z.number(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await addToWishlist({
          productType: input.productType,
          productId: input.productId,
          sessionId: input.sessionId,
        });
        return { success: true, data: result };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add to wishlist",
        });
      }
    }),

  removeFromWishlist: publicProcedure
    .input(z.object({
      productType: z.string(),
      productId: z.number(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await removeFromWishlist(input.productType, input.productId, input.sessionId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove from wishlist",
        });
      }
    }),
});
