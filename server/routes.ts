import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateLegalDocument } from "./openai";
import { insertBusinessSchema, insertDocumentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Business routes
  app.post("/api/businesses", async (req, res) => {
    try {
      const businessData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(businessData);
      res.json(business);
    } catch (error) {
      res.status(400).json({ message: "Invalid business data", error: error.message });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business", error: error.message });
    }
  });

  app.put("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBusinessSchema.partial().parse(req.body);
      const business = await storage.updateBusiness(id, updates);
      res.json(business);
    } catch (error) {
      res.status(400).json({ message: "Invalid business data", error: error.message });
    }
  });

  // Document generation route
  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { businessId, documentType } = req.body;
      
      if (!businessId || !documentType) {
        return res.status(400).json({ message: "businessId and documentType are required" });
      }

      const business = await storage.getBusiness(businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Generate document using OpenAI
      const generatedContent = await generateLegalDocument(business, documentType);
      
      // Create document record
      const documentData = {
        businessId,
        type: documentType,
        title: `${documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        content: generatedContent.content,
        metadata: {
          compliance: generatedContent.compliance,
          generatedAt: new Date().toISOString(),
          aiModel: "gpt-4o"
        }
      };

      const document = await storage.createDocument(documentData);
      
      // Create initial version
      await storage.createDocumentVersion({
        documentId: document.id,
        version: 1,
        content: generatedContent.content,
        changelog: "Initial generation"
      });

      res.json({ document, generatedContent });
    } catch (error) {
      console.error("Document generation error:", error);
      res.status(500).json({ message: "Failed to generate document", error: error.message });
    }
  });

  // Document routes
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document", error: error.message });
    }
  });

  app.get("/api/businesses/:businessId/documents", async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const documents = await storage.getDocumentsByBusinessId(businessId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents", error: error.message });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertDocumentSchema.partial().parse(req.body);
      const document = await storage.updateDocument(id, updates);
      
      // Create new version if content changed
      if (updates.content) {
        const latestVersion = await storage.getLatestDocumentVersion(id);
        const newVersion = (latestVersion?.version || 0) + 1;
        
        await storage.createDocumentVersion({
          documentId: id,
          version: newVersion,
          content: updates.content,
          changelog: req.body.changelog || "Content updated"
        });
      }
      
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data", error: error.message });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDocument(id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document", error: error.message });
    }
  });

  // Document versions
  app.get("/api/documents/:id/versions", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const versions = await storage.getDocumentVersions(documentId);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document versions", error: error.message });
    }
  });

  // Document download routes
  app.get("/api/documents/:id/download/:format", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const format = req.params.format;
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      switch (format) {
        case 'txt':
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Disposition', `attachment; filename="${document.title}.txt"`);
          res.send(document.content);
          break;
        case 'html':
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Content-Disposition', `attachment; filename="${document.title}.html"`);
          res.send(`<!DOCTYPE html><html><head><title>${document.title}</title></head><body>${document.content}</body></html>`);
          break;
        case 'json':
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Disposition', `attachment; filename="${document.title}.json"`);
          res.json(document);
          break;
        default:
          res.status(400).json({ message: "Unsupported format. Use txt, html, or json." });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to download document", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
