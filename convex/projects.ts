import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get all projects for a user
 */
export const getUserProjects = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return projects;
  },
});

/**
 * Get projects by status
 */
export const getProjectsByStatus = query({
  args: {
    userId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("archived"),
      v.literal("deploying"),
      v.literal("deployed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", args.status)
      )
      .order("desc")
      .collect();

    return projects;
  },
});

/**
 * Get a single project by ID
 */
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    return project;
  },
});

/**
 * Create a new project
 */
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    framework: v.union(
      v.literal("react"),
      v.literal("nextjs"),
      v.literal("vue"),
      v.literal("html"),
      v.literal("node")
    ),
    template: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      userId: args.userId,
      framework: args.framework,
      template: args.template,
      status: "active",
      isPublic: args.isPublic,
      tags: [],
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: now,
    });

    return projectId;
  },
});

/**
 * Update a project
 */
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("archived"),
        v.literal("deploying"),
        v.literal("deployed"),
        v.literal("failed")
      )
    ),
    isPublic: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    deploymentUrl: v.optional(v.string()),
    deploymentProvider: v.optional(
      v.union(
        v.literal("vercel"),
        v.literal("netlify"),
        v.literal("railway")
      )
    ),
    gitUrl: v.optional(v.string()),
    gitBranch: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;

    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const updateData: any = {
      ...updates,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(projectId, updateData);

    return projectId;
  },
});

/**
 * Update project last accessed time
 */
export const updateLastAccessed = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.projectId, {
      lastAccessedAt: Date.now(),
    });

    return args.projectId;
  },
});

/**
 * Delete a project
 */
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Delete all files associated with the project
    const files = await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const file of files) {
      await ctx.db.delete(file._id);
    }

    // Delete the project
    await ctx.db.delete(args.projectId);

    return args.projectId;
  },
});

/**
 * Get public projects
 */
export const getPublicProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .take(50);

    return projects;
  },
});

/**
 * Search projects by name
 */
export const searchProjects = query({
  args: {
    userId: v.string(),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const allProjects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Simple text search in name and description
    const filtered = allProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        (project.description &&
          project.description
            .toLowerCase()
            .includes(args.searchTerm.toLowerCase()))
    );

    return filtered;
  },
});
