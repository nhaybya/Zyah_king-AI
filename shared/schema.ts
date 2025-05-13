import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Chat message model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: text("session_id").notNull(),
});

// Insert schema for messages
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

// Chat completion request schema
export const chatCompletionRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  apiKey: z.string(),
  options: z.object({
    deepThinking: z.boolean(),
    webSearch: z.boolean(),
    imageGeneration: z.boolean(),
    fileAnalysis: z.boolean(),
  }).optional(),
});

// Types
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>;
