import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * AUTOCREA Database Schema
 *
 * This schema defines all the tables and their relationships for the AUTOCREA platform.
 *
 * Tables:
 * - users: User profiles and preferences
 * - projects: User projects (React, Next.js, Vue, HTML apps)
 * - files: Project files and their content
 * - aiRequests: AI code generation requests tracking
 * - deployments: Deployment history and status
 */

export default defineSchema({
  // ============================================================================
  // USERS TABLE
  // ============================================================================
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (unique identifier from Clerk)
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),

    // Subscription plan
    plan: v.union(
      v.literal("free-trial"),
      v.literal("creator"),
      v.literal("pro"),
      v.literal("enterprise")
    ),

    // Usage tracking
    aiRequestsUsed: v.number(), // Current month AI requests used
    storageUsed: v.number(), // Storage used in bytes
    projectsCount: v.number(), // Number of projects

    // Preferences
    preferences: v.optional(v.object({
      editorTheme: v.optional(v.string()),
      fontSize: v.optional(v.number()),
      autoSave: v.optional(v.boolean()),
      language: v.optional(v.string()),
    })),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_plan", ["plan"]),

  // ============================================================================
  // PROJECTS TABLE
  // ============================================================================
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(), // Clerk user ID (not _id reference for flexibility)

    // Project configuration
    framework: v.union(
      v.literal("react"),
      v.literal("nextjs"),
      v.literal("vue"),
      v.literal("html"),
      v.literal("node")
    ),

    template: v.optional(v.string()), // Template used (if any)

    // Project status
    status: v.union(
      v.literal("active"),
      v.literal("archived"),
      v.literal("deploying"),
      v.literal("deployed"),
      v.literal("failed")
    ),

    // Deployment info
    deploymentUrl: v.optional(v.string()),
    deploymentProvider: v.optional(v.union(
      v.literal("vercel"),
      v.literal("netlify"),
      v.literal("railway")
    )),

    // Repository info
    gitUrl: v.optional(v.string()),
    gitBranch: v.optional(v.string()),

    // Metadata
    tags: v.optional(v.array(v.string())),
    isPublic: v.boolean(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastAccessedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_framework", ["framework"]),

  // ============================================================================
  // FILES TABLE
  // ============================================================================
  files: defineTable({
    projectId: v.id("projects"),
    path: v.string(), // Relative path: e.g., "src/App.tsx"
    content: v.string(),

    // File metadata
    language: v.string(), // javascript, typescript, html, css, json, etc.
    size: v.number(), // Size in bytes

    // File type
    type: v.union(
      v.literal("file"),
      v.literal("directory")
    ),

    // Version control
    version: v.optional(v.number()),
    hash: v.optional(v.string()), // Content hash for change detection

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastEditedBy: v.optional(v.string()), // User ID who last edited
  })
    .index("by_project", ["projectId"])
    .index("by_project_and_path", ["projectId", "path"])
    .index("by_language", ["language"]),

  // ============================================================================
  // AI REQUESTS TABLE
  // ============================================================================
  aiRequests: defineTable({
    userId: v.string(), // Clerk user ID
    projectId: v.optional(v.id("projects")),

    // Request details
    type: v.union(
      v.literal("generate"), // Generate code from scratch
      v.literal("explain"), // Explain existing code
      v.literal("fix"), // Fix code errors
      v.literal("refactor"), // Refactor code
      v.literal("complete") // Auto-complete
    ),

    prompt: v.string(),
    context: v.optional(v.string()), // Additional context (existing code, error messages, etc.)

    // Response
    response: v.string(),
    code: v.optional(v.string()), // Generated code (if applicable)

    // AI model info
    model: v.string(), // claude-3-5-sonnet-20241022, etc.
    tokensUsed: v.number(),

    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),

    error: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_created_at", ["createdAt"]),

  // ============================================================================
  // DEPLOYMENTS TABLE
  // ============================================================================
  deployments: defineTable({
    projectId: v.id("projects"),
    userId: v.string(), // Clerk user ID

    // Deployment configuration
    provider: v.union(
      v.literal("vercel"),
      v.literal("netlify"),
      v.literal("railway")
    ),

    url: v.optional(v.string()), // Deployment URL
    domain: v.optional(v.string()), // Custom domain (if configured)

    // Deployment status
    status: v.union(
      v.literal("pending"),
      v.literal("building"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled")
    ),

    // Build info
    buildId: v.optional(v.string()), // External build ID from provider
    buildLogs: v.optional(v.string()),

    // Environment
    environment: v.union(
      v.literal("production"),
      v.literal("preview"),
      v.literal("development")
    ),

    envVars: v.optional(v.array(v.object({
      key: v.string(),
      value: v.string(),
    }))),

    // Error info
    error: v.optional(v.string()),
    errorCode: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    deployedAt: v.optional(v.number()),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_project_and_status", ["projectId", "status"])
    .index("by_provider", ["provider"]),

  // ============================================================================
  // COLLABORATORS TABLE (Future feature)
  // ============================================================================
  collaborators: defineTable({
    projectId: v.id("projects"),
    userId: v.string(), // Clerk user ID

    // Permission level
    role: v.union(
      v.literal("owner"),
      v.literal("editor"),
      v.literal("viewer")
    ),

    // Status
    status: v.union(
      v.literal("active"),
      v.literal("invited"),
      v.literal("removed")
    ),

    // Timestamps
    addedAt: v.number(),
    removedAt: v.optional(v.number()),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"])
    .index("by_project_and_user", ["projectId", "userId"]),
});
