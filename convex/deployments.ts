import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get deployment by ID
 */
export const getDeployment = query({
  args: { deploymentId: v.id("deployments") },
  handler: async (ctx, args) => {
    const deployment = await ctx.db.get(args.deploymentId);
    return deployment;
  },
});

/**
 * Get deployments for a project
 */
export const getProjectDeployments = query({
  args: {
    projectId: v.id("projects"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    const deployments = await ctx.db
      .query("deployments")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .take(limit);

    return deployments;
  },
});

/**
 * Get deployments by status
 */
export const getDeploymentsByStatus = query({
  args: {
    projectId: v.id("projects"),
    status: v.union(
      v.literal("pending"),
      v.literal("building"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const deployments = await ctx.db
      .query("deployments")
      .withIndex("by_project_and_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", args.status)
      )
      .order("desc")
      .collect();

    return deployments;
  },
});

/**
 * Get user's all deployments
 */
export const getUserDeployments = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const deployments = await ctx.db
      .query("deployments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return deployments;
  },
});

/**
 * Get latest successful deployment for a project
 */
export const getLatestSuccessfulDeployment = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const deployment = await ctx.db
      .query("deployments")
      .withIndex("by_project_and_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", "success")
      )
      .order("desc")
      .first();

    return deployment;
  },
});

/**
 * Create a deployment
 */
export const createDeployment = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.string(),
    provider: v.union(
      v.literal("vercel"),
      v.literal("netlify"),
      v.literal("railway")
    ),
    environment: v.union(
      v.literal("production"),
      v.literal("preview"),
      v.literal("development")
    ),
    domain: v.optional(v.string()),
    envVars: v.optional(
      v.array(v.object({ key: v.string(), value: v.string() }))
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const deploymentId = await ctx.db.insert("deployments", {
      projectId: args.projectId,
      userId: args.userId,
      provider: args.provider,
      domain: args.domain,
      status: "pending",
      environment: args.environment,
      envVars: args.envVars,
      createdAt: now,
      updatedAt: now,
    });

    return deploymentId;
  },
});

/**
 * Update deployment status
 */
export const updateDeploymentStatus = mutation({
  args: {
    deploymentId: v.id("deployments"),
    status: v.union(
      v.literal("pending"),
      v.literal("building"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    url: v.optional(v.string()),
    buildId: v.optional(v.string()),
    buildLogs: v.optional(v.string()),
    error: v.optional(v.string()),
    errorCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { deploymentId, ...updates } = args;

    const deployment = await ctx.db.get(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    const now = Date.now();
    const updateData: any = {
      ...updates,
      updatedAt: now,
    };

    // Set deployedAt timestamp when status is success
    if (args.status === "success") {
      updateData.deployedAt = now;
    }

    await ctx.db.patch(deploymentId, updateData);

    return deploymentId;
  },
});

/**
 * Update deployment build logs
 */
export const updateDeploymentLogs = mutation({
  args: {
    deploymentId: v.id("deployments"),
    buildLogs: v.string(),
  },
  handler: async (ctx, args) => {
    const deployment = await ctx.db.get(args.deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    await ctx.db.patch(args.deploymentId, {
      buildLogs: args.buildLogs,
      updatedAt: Date.now(),
    });

    return args.deploymentId;
  },
});

/**
 * Cancel a deployment
 */
export const cancelDeployment = mutation({
  args: { deploymentId: v.id("deployments") },
  handler: async (ctx, args) => {
    const deployment = await ctx.db.get(args.deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    if (deployment.status === "success" || deployment.status === "failed") {
      throw new Error("Cannot cancel a completed deployment");
    }

    await ctx.db.patch(args.deploymentId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return args.deploymentId;
  },
});

/**
 * Get deployment statistics for a user
 */
export const getDeploymentStats = query({
  args: {
    userId: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const deployments = await ctx.db
      .query("deployments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by date range if provided
    const filteredDeployments = deployments.filter((dep) => {
      if (args.startDate && dep.createdAt < args.startDate) return false;
      if (args.endDate && dep.createdAt > args.endDate) return false;
      return true;
    });

    const totalDeployments = filteredDeployments.length;

    const byStatus = filteredDeployments.reduce((acc, dep) => {
      acc[dep.status] = (acc[dep.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byProvider = filteredDeployments.reduce((acc, dep) => {
      acc[dep.provider] = (acc[dep.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byEnvironment = filteredDeployments.reduce((acc, dep) => {
      acc[dep.environment] = (acc[dep.environment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const successRate =
      totalDeployments > 0
        ? ((byStatus.success || 0) / totalDeployments) * 100
        : 0;

    return {
      totalDeployments,
      byStatus,
      byProvider,
      byEnvironment,
      successRate,
    };
  },
});

/**
 * Delete old deployments (cleanup)
 */
export const deleteOldDeployments = mutation({
  args: {
    projectId: v.id("projects"),
    beforeDate: v.number(),
    keepSuccessful: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const deployments = await ctx.db
      .query("deployments")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const toDelete = deployments.filter((dep) => {
      if (dep.createdAt >= args.beforeDate) return false;
      if (args.keepSuccessful && dep.status === "success") return false;
      return true;
    });

    for (const deployment of toDelete) {
      await ctx.db.delete(deployment._id);
    }

    return { deletedCount: toDelete.length };
  },
});
