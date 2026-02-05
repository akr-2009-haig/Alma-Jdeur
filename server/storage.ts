import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import {
  users,
  patients,
  followups,
  media,
  archive,
  beds,
  news,
  comments,
  type InsertUser,
  type User,
  type InsertPatient,
  type Patient,
  type InsertFollowup,
  type Followup,
  type InsertMedia,
  type Media,
  type InsertArchive,
  type Archive,
  type InsertBed,
  type Bed,
  type InsertNews,
  type News,
  type InsertComment,
  type Comment,
} from "@shared/schema";

// Hospital data access layer with custom methods
class HospitalDataManager {
  // Surgeon and medical staff operations
  async registerSurgeon(surgeonData: InsertUser): Promise<User> {
    const results = await db.insert(users).values(surgeonData).returning();
    return results[0];
  }

  async findSurgeonByEmail(emailAddr: string): Promise<User | undefined> {
    const surgeons = await db.select().from(users).where(eq(users.email, emailAddr));
    return surgeons[0];
  }

  async findSurgeonById(surgeonId: number): Promise<User | undefined> {
    const surgeons = await db.select().from(users).where(eq(users.id, surgeonId));
    return surgeons[0];
  }

  async fetchAllSurgeons(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async changeSurgeonRole(surgeonId: number, newRole: string): Promise<User> {
    const updated = await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, surgeonId))
      .returning();
    return updated[0];
  }

  // Patient record operations
  async admitPatient(patientData: InsertPatient): Promise<Patient> {
    const admitted = await db.insert(patients).values(patientData).returning();
    const patientRecord = admitted[0];
    
    // Adjust bed count for department
    if (patientRecord.department) {
      await this.adjustBedOccupancy(patientRecord.department, 1);
    }
    
    return patientRecord;
  }

  async fetchPatientRecord(patientId: number): Promise<Patient | undefined> {
    const records = await db.select().from(patients).where(eq(patients.id, patientId));
    return records[0];
  }

  async fetchAllPatientRecords(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.admissionDate));
  }

  async fetchActivePatientRecords(): Promise<Patient[]> {
    return await db
      .select()
      .from(patients)
      .where(eq(patients.status, 'active'))
      .orderBy(desc(patients.admissionDate));
  }

  async modifyPatientRecord(patientId: number, modifications: Partial<InsertPatient>): Promise<Patient> {
    const updated = await db
      .update(patients)
      .set({ ...modifications, updatedAt: new Date() })
      .where(eq(patients.id, patientId))
      .returning();
    return updated[0];
  }

  async removePatientRecord(patientId: number): Promise<void> {
    await db.delete(patients).where(eq(patients.id, patientId));
  }

  // Medical notes and observations
  async recordFollowupNote(noteData: InsertFollowup): Promise<Followup> {
    const recorded = await db.insert(followups).values(noteData).returning();
    return recorded[0];
  }

  async fetchPatientFollowupNotes(patientId: number): Promise<Followup[]> {
    return await db
      .select()
      .from(followups)
      .where(eq(followups.patientId, patientId))
      .orderBy(desc(followups.createdAt));
  }

  async removeFollowupNote(noteId: number): Promise<void> {
    await db.delete(followups).where(eq(followups.id, noteId));
  }

  // Medical imaging and documents
  async uploadMedicalFile(fileData: InsertMedia): Promise<Media> {
    const uploaded = await db.insert(media).values(fileData).returning();
    return uploaded[0];
  }

  async fetchPatientMedicalFiles(patientId: number): Promise<Media[]> {
    return await db
      .select()
      .from(media)
      .where(eq(media.patientId, patientId))
      .orderBy(desc(media.uploadedAt));
  }

  async removeMedicalFile(fileId: number): Promise<void> {
    await db.delete(media).where(eq(media.id, fileId));
  }

  // Discharged patient archives
  async archiveDischargedPatient(archiveData: InsertArchive): Promise<Archive> {
    const archived = await db.insert(archive).values(archiveData).returning();
    return archived[0];
  }

  async fetchAllArchivedRecords(): Promise<Archive[]> {
    return await db.select().from(archive).orderBy(desc(archive.dischargeDate));
  }

  async fetchArchivedRecordsByPeriod(periodStart: Date, periodEnd: Date): Promise<Archive[]> {
    return await db
      .select()
      .from(archive)
      .where(
        and(
          gte(archive.dischargeDate, periodStart),
          lte(archive.dischargeDate, periodEnd)
        )
      )
      .orderBy(desc(archive.dischargeDate));
  }

  // Hospital bed management
  async fetchDepartmentBedInfo(deptName: string): Promise<Bed | undefined> {
    const bedInfo = await db.select().from(beds).where(eq(beds.department, deptName));
    return bedInfo[0];
  }

  async modifyDepartmentBeds(deptName: string, bedChanges: Partial<InsertBed>): Promise<Bed> {
    const currentInfo = await this.fetchDepartmentBedInfo(deptName);
    
    if (currentInfo) {
      const modified = await db
        .update(beds)
        .set({ ...bedChanges, updatedAt: new Date() })
        .where(eq(beds.department, deptName))
        .returning();
      return modified[0];
    } else {
      const created = await db
        .insert(beds)
        .values({ department: deptName, ...bedChanges })
        .returning();
      return created[0];
    }
  }

  async adjustBedOccupancy(deptName: string, adjustment: number): Promise<void> {
    const currentInfo = await this.fetchDepartmentBedInfo(deptName);
    
    if (currentInfo) {
      const newCount = Math.max(0, currentInfo.occupiedBeds + adjustment);
      await db
        .update(beds)
        .set({ 
          occupiedBeds: newCount,
          updatedAt: new Date()
        })
        .where(eq(beds.department, deptName));
    } else if (adjustment > 0) {
      await db.insert(beds).values({
        department: deptName,
        totalBeds: 0,
        occupiedBeds: adjustment,
      });
    }
  }

  // Hospital announcements and news
  async publishAnnouncement(announcementData: InsertNews): Promise<News> {
    const published = await db.insert(news).values(announcementData).returning();
    return published[0];
  }

  async fetchAllAnnouncements(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }

  async fetchAnnouncementById(announcementId: number): Promise<News | undefined> {
    const announcements = await db.select().from(news).where(eq(news.id, announcementId));
    return announcements[0];
  }

  async modifyAnnouncement(announcementId: number, modifications: Partial<InsertNews>): Promise<News> {
    const modified = await db
      .update(news)
      .set({ ...modifications, updatedAt: new Date() })
      .where(eq(news.id, announcementId))
      .returning();
    return modified[0];
  }

  async removeAnnouncement(announcementId: number): Promise<void> {
    // Clean up related discussion first
    await db.delete(comments).where(eq(comments.newsId, announcementId));
    // Remove the announcement
    await db.delete(news).where(eq(news.id, announcementId));
  }

  // Discussion and feedback on announcements
  async postDiscussion(discussionData: InsertComment): Promise<Comment> {
    const posted = await db.insert(comments).values(discussionData).returning();
    return posted[0];
  }

  async fetchAnnouncementDiscussion(announcementId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.newsId, announcementId))
      .orderBy(desc(comments.createdAt));
  }

  async removeDiscussion(discussionId: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, discussionId));
  }
}

export const hospitalData = new HospitalDataManager();
