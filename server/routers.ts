import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sdk } from "./_core/sdk";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { laptopsRouter } from "./routers/laptops";
import { monitorsRouter } from "./routers/monitors";
import { accessoriesRouter } from "./routers/accessories";
import { tabletsRouter } from "./routers/tablets";
import { smartDevicesRouter } from "./routers/smartdevices";
import { ratingsRouter } from "./routers/ratings";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword || input.password !== adminPassword) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid password" });
        }
        const adminOpenId = "admin-local";
        await db.upsertUser({
          openId: adminOpenId,
          name: "Admin",
          email: null,
          role: "admin",
          lastSignedIn: new Date(),
        });
        const sessionToken = await sdk.signSession(
          { openId: adminOpenId, appId: "local", name: "Admin" },
          { expiresInMs: ONE_YEAR_MS }
        );
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true } as const;
      }),
  }),

  laptops: laptopsRouter,
  monitors: monitorsRouter,
  accessories: accessoriesRouter,
  tablets: tabletsRouter,
  smartDevices: smartDevicesRouter,
  ratings: ratingsRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
