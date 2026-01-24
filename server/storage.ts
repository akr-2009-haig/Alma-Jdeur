import { db } from "./db";
import {
  registrations,
  type InsertRegistration,
  type Registration
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistrationById(id: number): Promise<Registration | undefined>;
  getRegistrationsCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db
      .select()
      .from(registrations)
      .orderBy(desc(registrations.createdAt));
  }

  async getRegistrationById(id: number): Promise<Registration | undefined> {
    const [registration] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));
    return registration;
  }

  async getRegistrationsCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(registrations);
    return Number(result.count);
  }
}

export const storage = new DatabaseStorage();
