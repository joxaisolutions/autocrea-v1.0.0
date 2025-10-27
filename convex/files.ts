import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get all files for a project
 */
export const getProjectFiles = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();

    return files;
  },
});

/**
 * Get a single file by ID
 */
export const getFile = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    return file;
  },
});

/**
 * Get file by path
 */
export const getFileByPath = query({
  args: {
    projectId: v.id("projects"),
    path: v.string(),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("files")
      .withIndex("by_project_and_path", (q) =>
        q.eq("projectId", args.projectId).eq("path", args.path)
      )
      .unique();

    return file;
  },
});

/**
 * Create a new file
 */
export const createFile = mutation({
  args: {
    projectId: v.id("projects"),
    path: v.string(),
    content: v.string(),
    language: v.string(),
    type: v.union(v.literal("file"), v.literal("directory")),
    lastEditedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const size = Buffer.byteLength(args.content, "utf8");

    const fileId = await ctx.db.insert("files", {
      projectId: args.projectId,
      path: args.path,
      content: args.content,
      language: args.language,
      size,
      type: args.type,
      version: 1,
      createdAt: now,
      updatedAt: now,
      lastEditedBy: args.lastEditedBy,
    });

    return fileId;
  },
});

/**
 * Update a file
 */
export const updateFile = mutation({
  args: {
    fileId: v.id("files"),
    content: v.optional(v.string()),
    path: v.optional(v.string()),
    lastEditedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fileId, ...updates } = args;

    const file = await ctx.db.get(fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.content !== undefined) {
      updateData.content = updates.content;
      updateData.size = Buffer.byteLength(updates.content, "utf8");
      updateData.version = (file.version || 0) + 1;
    }

    if (updates.path !== undefined) {
      updateData.path = updates.path;
    }

    if (updates.lastEditedBy !== undefined) {
      updateData.lastEditedBy = updates.lastEditedBy;
    }

    await ctx.db.patch(fileId, updateData);

    return fileId;
  },
});

/**
 * Delete a file
 */
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    await ctx.db.delete(args.fileId);

    return args.fileId;
  },
});

/**
 * Create multiple files at once (bulk insert)
 */
export const createBulkFiles = mutation({
  args: {
    projectId: v.id("projects"),
    files: v.array(
      v.object({
        path: v.string(),
        content: v.string(),
        language: v.string(),
        type: v.union(v.literal("file"), v.literal("directory")),
      })
    ),
    lastEditedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const fileIds: any[] = [];

    for (const file of args.files) {
      const size = Buffer.byteLength(file.content, "utf8");

      const fileId = await ctx.db.insert("files", {
        projectId: args.projectId,
        path: file.path,
        content: file.content,
        language: file.language,
        size,
        type: file.type,
        version: 1,
        createdAt: now,
        updatedAt: now,
        lastEditedBy: args.lastEditedBy,
      });

      fileIds.push(fileId);
    }

    return fileIds;
  },
});

/**
 * Get files by language
 */
export const getFilesByLanguage = query({
  args: {
    projectId: v.id("projects"),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const allFiles = await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return allFiles.filter((file) => file.language === args.language);
  },
});

/**
 * Calculate total storage for a project
 */
export const getProjectStorageSize = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    return {
      totalSize,
      fileCount: files.length,
    };
  },
});

/**
 * Delete all files in a project
 */
export const deleteAllProjectFiles = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const file of files) {
      await ctx.db.delete(file._id);
    }

    return { deletedCount: files.length };
  },
});
