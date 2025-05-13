import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatCompletionRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Handle chat completion requests
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate request body
      const validatedData = chatCompletionRequestSchema.parse(req.body);
      const { messages, apiKey, options } = validatedData;
      
      // Check if API key is the default or custom one
      const defaultGeminiKey = "AIzaSyCHOlBGd3R5LYeGclWQq3pUXZa028YeF9E";
      const isDefaultKey = apiKey === "d73b7ebf1e8c36d9e3d233156986adc0349bea1c3414b5fecb5faa48715d24fe";
      const isZyahKey = apiKey === "Zyahking2405";
      const isValidCustomKey = isZyahKey || (!isDefaultKey && apiKey.length > 10);
      
      // Use the appropriate key for the API call
      let apiKeyToUse = apiKey;
      
      if (isZyahKey || isDefaultKey) {
        // When using "Zyahking2405" or default key, use the Gemini API key
        apiKeyToUse = defaultGeminiKey;
      }
      
      if (!isDefaultKey && !isValidCustomKey) {
        return res.status(401).json({ message: "Invalid API key" });
      }
      
      try {
        // Make request to Google Gemini API
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        
        // Apply VIP options if provided
        let modelUrl = apiUrl;
        let geminiConfig = {
          temperature: 0.7,
          maxOutputTokens: 1000
        };
        
        // For VIP users with deep thinking enabled, adjust the configuration
        if (options && options.deepThinking === true) {
          // Enable deeper thinking with lower temperature, higher tokens
          geminiConfig.temperature = 0.3;
          geminiConfig.maxOutputTokens = 2000;
          console.log("Deep thinking mode enabled");
        }
        
        // If web search is enabled, we would integrate with a search API here
        if (options && options.webSearch === true) {
          console.log("Web search mode enabled");
          // Add web search context to the prompt
          // Would normally call a search API here
        }
        
        // For file analysis, we'd process the file content here
        if (options && options.fileAnalysis === true) {
          console.log("File analysis mode enabled");
          // Would extract and analyze file content here
        }
        
        // Convert chat messages to Gemini API format
        // Gemini requires specific roles: user or model, not system or assistant
        let systemPromptAdded = false;
        const geminiMessages = messages.filter(msg => {
          // Skip system message for now, we'll handle it specially
          if (msg.role === "system") {
            return false;
          }
          return true;
        }).map(msg => {
          let role = msg.role;
          // Map assistant role to model
          if (role === "assistant") {
            role = "model";
          }
          
          // Check if we need to process any file analysis in a message
          if (options && options.fileAnalysis === true && msg.content.includes("[PhânTíchFile]")) {
            // Format message for file analysis
            return {
              role: role,
              parts: [{ text: `Phân tích chi tiết file sau: ${msg.content}` }]
            };
          }
          
          return {
            role: role,
            parts: [{ text: msg.content }]
          };
        });
        
        // Make sure we have at least one message
        if (geminiMessages.length === 0) {
          geminiMessages.push({
            role: "user",
            parts: [{ text: "Hello, please introduce yourself" }]
          });
        }
        
        // Find the system message if present
        const systemMessage = messages.find(msg => msg.role === "system");
        
        // Prepare the request body for Gemini API
        const requestBody: any = {
          contents: geminiMessages,
          generationConfig: geminiConfig
        };
        
        // If we have a system message, add it as a safety setting
        if (systemMessage) {
          requestBody.systemInstruction = {
            parts: [{ text: systemMessage.content }]
          };
        }
        
        console.log("Sending request to Gemini API:", JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${apiUrl}?key=${apiKeyToUse}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini API error:", errorText);
          return res.status(response.status).json({ 
            message: "Error from AI provider", 
            error: errorText 
          });
        }
        
        const data = await response.json();
        console.log("Gemini API response:", JSON.stringify(data, null, 2));
        
        // Extract text from Gemini response
        const aiMessage = data.candidates[0].content.parts[0].text;
        
        // Store message in memory (optional)
        const sessionId = "user-session";
        await storage.createMessage({
          role: "assistant",
          content: aiMessage,
          sessionId
        });
        
        return res.json({ message: aiMessage });
      } catch (error) {
        console.error("Error calling Together.xyz API:", error);
        return res.status(500).json({ 
          message: "Failed to communicate with AI provider" 
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
