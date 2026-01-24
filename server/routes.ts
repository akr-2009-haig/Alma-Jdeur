import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Create a new registration
  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      const registration = await storage.createRegistration(input);
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Get all registrations
  app.get(api.registrations.list.path, async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.status(200).json(registrations);
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve registrations",
      });
    }
  });

  // Get registration statistics (must come before /:id route)
  app.get('/api/registrations/stats', async (req, res) => {
    try {
      const total = await storage.getRegistrationsCount();
      res.status(200).json({ total });
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve statistics",
      });
    }
  });

  // Get a single registration by ID
  app.get('/api/registrations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid ID format",
        });
      }
      
      const registration = await storage.getRegistrationById(id);
      if (!registration) {
        return res.status(404).json({
          message: "Registration not found",
        });
      }
      
      res.status(200).json(registration);
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve registration",
      });
    }
  });

  return httpServer;
}
