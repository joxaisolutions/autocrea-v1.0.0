import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get AI request by ID
 */
export const getAIRequest = query({
  args: { requestId: v.id("aiRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    return request;
  },
});

/**
 * Get AI requests for a user
 */
export const getUserAIRequests = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    const requests = await ctx.db
      .query("aiRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return {
      requests: requests.slice(offset, offset + limit),
      total: requests.length,
    };
  },
});

/**
 * Get AI requests for a project
 */
export const getProjectAIRequests = query({
  args: {
    projectId: v.id("projects"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const requests = await ctx.db
      .query("aiRequests")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .take(limit);

    return requests;
  },
});

/**
 * Get AI requests by status
 */
export const getAIRequestsByStatus = query({
  args: {
    userId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("aiRequests")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", args.status)
      )
      .order("desc")
      .collect();

    return requests;
  },
});

/**
 * Create an AI request
 */
export const createAIRequest = mutation({
  args: {
    userId: v.string(),
    projectId: v.optional(v.id("projects")),
    type: v.union(
      v.literal("generate"),
      v.literal("explain"),
      v.literal("fix"),
      v.literal("refactor"),
      v.literal("complete")
    ),
    prompt: v.string(),
    context: v.optional(v.string()),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const requestId = await ctx.db.insert("aiRequests", {
      userId: args.userId,
      projectId: args.projectId,
      type: args.type,
      prompt: args.prompt,
      context: args.context,
      response: "",
      model: args.model,
      tokensUsed: 0,
      status: "pending",
      createdAt: now,
    });

    return requestId;
  },
});

/**
 * Update AI request with response
 */
export const updateAIRequest = mutation({
  args: {
    requestId: v.id("aiRequests"),
    response: v.string(),
    code: v.optional(v.string()),
    tokensUsed: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { requestId, ...updates } = args;

    const request = await ctx.db.get(requestId);
    if (!request) {
      throw new Error("AI request not found");
    }

    await ctx.db.patch(requestId, {
      ...updates,
      completedAt: Date.now(),
    });

    return requestId;
  },
});

/**
 * Get AI usage statistics for a user
 */
export const getAIUsageStats = query({
  args: {
    userId: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("aiRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by date range if provided
    const filteredRequests = requests.filter((req) => {
      if (args.startDate && req.createdAt < args.startDate) return false;
      if (args.endDate && req.createdAt > args.endDate) return false;
      return true;
    });

    const totalRequests = filteredRequests.length;
    const totalTokens = filteredRequests.reduce(
      (sum, req) => sum + req.tokensUsed,
      0
    );

    const byType = filteredRequests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = filteredRequests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests,
      totalTokens,
      byType,
      byStatus,
      averageTokensPerRequest:
        totalRequests > 0 ? totalTokens / totalRequests : 0,
    };
  },
});

/**
 * Delete old AI requests (cleanup)
 */
export const deleteOldAIRequests = mutation({
  args: {
    userId: v.string(),
    beforeDate: v.number(),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("aiRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const toDelete = requests.filter(
      (req) => req.createdAt < args.beforeDate
    );

    for (const request of toDelete) {
      await ctx.db.delete(request._id);
    }

    return { deletedCount: toDelete.length };
  },
});
