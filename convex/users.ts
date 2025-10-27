import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get user by Clerk ID
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return user;
  },
});

/**
 * Get user by email
 */
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return user;
  },
});

/**
 * Create a new user
 */
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      plan: "free-trial",
      aiRequestsUsed: 0,
      storageUsed: 0,
      projectsCount: 0,
      preferences: {
        editorTheme: "vs-dark",
        fontSize: 14,
        autoSave: true,
        language: "en",
      },
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    });

    return userId;
  },
});

/**
 * Update user profile
 */
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

    await ctx.db.patch(user._id, updates);

    return user._id;
  },
});

/**
 * Update user preferences
 */
export const updateUserPreferences = mutation({
  args: {
    clerkId: v.string(),
    preferences: v.object({
      editorTheme: v.optional(v.string()),
      fontSize: v.optional(v.number()),
      autoSave: v.optional(v.boolean()),
      language: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      preferences: {
        ...user.preferences,
        ...args.preferences,
      },
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Update last login timestamp
 */
export const updateLastLogin = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Increment AI requests used
 */
export const incrementAIRequests = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      aiRequestsUsed: user.aiRequestsUsed + 1,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Update storage used
 */
export const updateStorageUsed = mutation({
  args: {
    clerkId: v.string(),
    storageChange: v.number(), // Positive to add, negative to subtract
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const newStorageUsed = Math.max(0, user.storageUsed + args.storageChange);

    await ctx.db.patch(user._id, {
      storageUsed: newStorageUsed,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Increment project count
 */
export const incrementProjectCount = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      projectsCount: user.projectsCount + 1,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Decrement project count
 */
export const decrementProjectCount = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      projectsCount: Math.max(0, user.projectsCount - 1),
      updatedAt: Date.now(),
    });

    return user._id;
  },
});
