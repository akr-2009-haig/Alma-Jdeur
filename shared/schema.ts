import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'resident', 'surgeon', 'head_of_department'
  createdAt: timestamp("created_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // 'male', 'female'
  idNumber: text("id_number"),
  phone: text("phone"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  admissionType: text("admission_type").notNull(), // 'emergency', 'operation'
  admissionDate: timestamp("admission_date").notNull().defaultNow(),
  diagnosis: text("diagnosis").notNull(),
  operation: text("operation"),
  surgeon: text("surgeon"),
  department: text("department").notNull(),
  bedNumber: text("bed_number"),
  notes: text("notes"),
  status: text("status").notNull().default('active'), // 'active', 'archived'
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Follow-ups table for patient notes
export const followups = pgTable("followups", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  note: text("note").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdByName: text("created_by_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Media table for X-rays and lab images
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // 'image', 'pdf', etc.
  description: text("description"),
  uploadedBy: integer("uploaded_by").notNull().references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Archive table for discharged patients
export const archive = pgTable("archive", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  diagnosis: text("diagnosis").notNull(),
  operation: text("operation"),
  surgeon: text("surgeon"),
  admissionDate: timestamp("admission_date").notNull(),
  dischargeDate: timestamp("discharge_date").notNull().defaultNow(),
  dischargeReason: text("discharge_reason").notNull(), // 'improved', 'by_request', 'escaped', 'died'
  notes: text("notes"),
  dischargedBy: integer("discharged_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Beds management table
export const beds = pgTable("beds", {
  id: serial("id").primaryKey(),
  department: text("department").notNull(),
  totalBeds: integer("total_beds").notNull().default(0),
  occupiedBeds: integer("occupied_beds").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// News/Feed table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table for news
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  newsId: integer("news_id").notNull().references(() => news.id),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

export const insertPatientSchema = createInsertSchema(patients).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const updatePatientSchema = createInsertSchema(patients).partial().omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const insertFollowupSchema = createInsertSchema(followups).omit({ 
  id: true, 
  createdAt: true 
});

export const insertMediaSchema = createInsertSchema(media).omit({ 
  id: true, 
  uploadedAt: true 
});

export const insertArchiveSchema = createInsertSchema(archive).omit({ 
  id: true, 
  createdAt: true,
  dischargeDate: true,
});

export const insertBedSchema = createInsertSchema(beds).omit({ 
  id: true, 
  updatedAt: true 
});

export const insertNewsSchema = createInsertSchema(news).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Followup = typeof followups.$inferSelect;
export type InsertFollowup = z.infer<typeof insertFollowupSchema>;

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;

export type Archive = typeof archive.$inferSelect;
export type InsertArchive = z.infer<typeof insertArchiveSchema>;

export type Bed = typeof beds.$inferSelect;
export type InsertBed = z.infer<typeof insertBedSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
