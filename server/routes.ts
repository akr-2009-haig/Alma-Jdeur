import type { Express } from "express";
import type { Server } from "http";
import { hospitalData } from "./storage";
import { passwordManager, permissionChecker } from "./authHelper";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { patients, archive } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Authentication endpoints
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      
      // Check if surgeon already registered
      const existingSurgeon = await hospitalData.findSurgeonByEmail(email);
      if (existingSurgeon) {
        return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل' });
      }

      // Encrypt password
      const securedPassword = await passwordManager.encryptPassword(password);

      // Register new surgeon with default role
      const newSurgeon = await hospitalData.registerSurgeon({
        email,
        password: securedPassword,
        name,
        role: role || 'surgeon', // Default to surgeon role
      });

      // Remove password from response
      const { password: _, ...surgeonWithoutPassword } = newSurgeon;
      
      // Setup session
      req.session.surgeonInfo = surgeonWithoutPassword as any;

      res.status(201).json(surgeonWithoutPassword);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'خطأ في التسجيل' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const surgeon = await hospitalData.findSurgeonByEmail(email);
      if (!surgeon) {
        return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
      }

      const isPasswordCorrect = await passwordManager.verifyPassword(password, surgeon.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
      }

      // Setup session
      const { password: _, ...surgeonWithoutPassword } = surgeon;
      req.session.surgeonInfo = surgeonWithoutPassword as any;

      res.json({ user: surgeonWithoutPassword });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'خطأ في تسجيل الدخول' });
    }
  });

  app.get('/api/auth/me', permissionChecker.requireAuthenticated, async (req, res) => {
    res.json(req.session.surgeonInfo);
  });

  app.post('/api/auth/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'خطأ في تسجيل الخروج' });
      }
      res.json({ message: 'تم تسجيل الخروج بنجاح' });
    });
  });

  // User management endpoints
  app.get('/api/users', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const allSurgeons = await hospitalData.fetchAllSurgeons();
      const surgeonsWithoutPasswords = allSurgeons.map(s => {
        const { password, ...rest } = s;
        return rest;
      });
      res.json(surgeonsWithoutPasswords);
    } catch (error) {
      console.error('Fetch surgeons error:', error);
      res.status(500).json({ message: 'خطأ في جلب البيانات' });
    }
  });

  app.put('/api/users/:id/role', 
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['head_of_department']),
    async (req, res) => {
      try {
        const surgeonId = parseInt(req.params.id);
        const { role } = req.body;
        
        const updatedSurgeon = await hospitalData.changeSurgeonRole(surgeonId, role);
        const { password: _, ...surgeonWithoutPassword } = updatedSurgeon;
        
        res.json(surgeonWithoutPassword);
      } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'خطأ في تحديث الصلاحيات' });
      }
    }
  );

  // Patient management endpoints
  app.post('/api/patients',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['resident', 'head_of_department']),
    async (req, res) => {
      try {
        const patientData = {
          ...req.body,
          createdBy: req.session.surgeonInfo!.id,
        };
        
        const newPatient = await hospitalData.admitPatient(patientData);
        res.status(201).json(newPatient);
      } catch (error) {
        console.error('Admit patient error:', error);
        res.status(500).json({ message: 'خطأ في إضافة المريض' });
      }
    }
  );

  app.get('/api/patients', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const allPatients = await hospitalData.fetchAllPatientRecords();
      res.json(allPatients);
    } catch (error) {
      console.error('Fetch patients error:', error);
      res.status(500).json({ message: 'خطأ في جلب البيانات' });
    }
  });

  app.get('/api/patients/active', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const activePatients = await hospitalData.fetchActivePatientRecords();
      res.json(activePatients);
    } catch (error) {
      console.error('Fetch active patients error:', error);
      res.status(500).json({ message: 'خطأ في جلب البيانات' });
    }
  });

  app.get('/api/patients/:id', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const patient = await hospitalData.fetchPatientRecord(patientId);
      
      if (!patient) {
        return res.status(404).json({ message: 'المريض غير موجود' });
      }
      
      res.json(patient);
    } catch (error) {
      console.error('Fetch patient error:', error);
      res.status(500).json({ message: 'خطأ في جلب البيانات' });
    }
  });

  app.put('/api/patients/:id', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const updatedPatient = await hospitalData.modifyPatientRecord(patientId, req.body);
      res.json(updatedPatient);
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({ message: 'خطأ في تحديث البيانات' });
    }
  });

  app.delete('/api/patients/:id',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['head_of_department']),
    async (req, res) => {
      try {
        const patientId = parseInt(req.params.id);
        await hospitalData.removePatientRecord(patientId);
        res.status(204).send();
      } catch (error) {
        console.error('Delete patient error:', error);
        res.status(500).json({ message: 'خطأ في حذف المريض' });
      }
    }
  );

  // Patient discharge endpoint
  app.post('/api/patients/:id/discharge',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['resident', 'head_of_department']),
    async (req, res) => {
      try {
        const patientId = parseInt(req.params.id);
        const { dischargeReason, notes } = req.body;
        
        const patient = await hospitalData.fetchPatientRecord(patientId);
        if (!patient) {
          return res.status(404).json({ message: 'المريض غير موجود' });
        }

        if (patient.status === 'archived') {
          return res.status(400).json({ message: 'المريض مؤرشف بالفعل' });
        }

        // Create archive record
        const archivedRecord = await hospitalData.archiveDischargedPatient({
          patientId: patient.id,
          fullName: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          diagnosis: patient.diagnosis,
          operation: patient.operation,
          surgeon: patient.surgeon,
          admissionDate: patient.admissionDate,
          dischargeReason,
          notes: notes || patient.notes,
          dischargedBy: req.session.surgeonInfo!.id,
        });

        // Update patient status
        await hospitalData.modifyPatientRecord(patientId, { status: 'archived' });

        // Free up bed
        if (patient.department) {
          await hospitalData.adjustBedOccupancy(patient.department, -1);
        }

        res.json(archivedRecord);
      } catch (error) {
        console.error('Discharge patient error:', error);
        res.status(500).json({ message: 'خطأ في إخراج المريض' });
      }
    }
  );

  // Follow-up notes endpoints
  app.post('/api/followups', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const { patientId, note } = req.body;
      
      // Check if patient is still active
      const patient = await hospitalData.fetchPatientRecord(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'المريض غير موجود' });
      }
      
      if (patient.status === 'archived') {
        return res.status(400).json({ message: 'لا يمكن إضافة ملاحظات لمريض مؤرشف' });
      }

      const followupNote = await hospitalData.recordFollowupNote({
        patientId,
        note,
        createdBy: req.session.surgeonInfo!.id,
        createdByName: req.session.surgeonInfo!.name,
      });

      res.status(201).json(followupNote);
    } catch (error) {
      console.error('Create followup error:', error);
      res.status(500).json({ message: 'خطأ في إضافة الملاحظة' });
    }
  });

  app.get('/api/followups/patient/:patientId', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const notes = await hospitalData.fetchPatientFollowupNotes(patientId);
      res.json(notes);
    } catch (error) {
      console.error('Fetch followups error:', error);
      res.status(500).json({ message: 'خطأ في جلب الملاحظات' });
    }
  });

  app.delete('/api/followups/:id',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['head_of_department']),
    async (req, res) => {
      try {
        const noteId = parseInt(req.params.id);
        await hospitalData.removeFollowupNote(noteId);
        res.status(204).send();
      } catch (error) {
        console.error('Delete followup error:', error);
        res.status(500).json({ message: 'خطأ في حذف الملاحظة' });
      }
    }
  );

  // Medical files endpoints
  app.post('/api/media',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['resident', 'head_of_department']),
    async (req, res) => {
      try {
        const fileData = {
          ...req.body,
          uploadedBy: req.session.surgeonInfo!.id,
        };
        
        const uploadedFile = await hospitalData.uploadMedicalFile(fileData);
        res.status(201).json(uploadedFile);
      } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({ message: 'خطأ في رفع الملف' });
      }
    }
  );

  app.get('/api/media/patient/:patientId', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const files = await hospitalData.fetchPatientMedicalFiles(patientId);
      res.json(files);
    } catch (error) {
      console.error('Fetch media error:', error);
      res.status(500).json({ message: 'خطأ في جلب الملفات' });
    }
  });

  app.delete('/api/media/:id',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['resident', 'head_of_department']),
    async (req, res) => {
      try {
        const fileId = parseInt(req.params.id);
        await hospitalData.removeMedicalFile(fileId);
        res.status(204).send();
      } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ message: 'خطأ في حذف الملف' });
      }
    }
  );

  // Archive endpoints
  app.get('/api/archive', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const archivedRecords = await hospitalData.fetchAllArchivedRecords();
      res.json(archivedRecords);
    } catch (error) {
      console.error('Fetch archive error:', error);
      res.status(500).json({ message: 'خطأ في جلب الأرشيف' });
    }
  });

  // Bed management endpoints
  app.get('/api/beds/:department', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const deptName = req.params.department;
      const bedInfo = await hospitalData.fetchDepartmentBedInfo(deptName);
      
      if (!bedInfo) {
        return res.json({ department: deptName, totalBeds: 0, occupiedBeds: 0 });
      }
      
      res.json(bedInfo);
    } catch (error) {
      console.error('Fetch beds error:', error);
      res.status(500).json({ message: 'خطأ في جلب بيانات الأسرة' });
    }
  });

  app.put('/api/beds/:department',
    permissionChecker.requireAuthenticated,
    permissionChecker.requireRole(['head_of_department']),
    async (req, res) => {
      try {
        const deptName = req.params.department;
        const updatedBeds = await hospitalData.modifyDepartmentBeds(deptName, req.body);
        res.json(updatedBeds);
      } catch (error) {
        console.error('Update beds error:', error);
        res.status(500).json({ message: 'خطأ في تحديث بيانات الأسرة' });
      }
    }
  );

  // News/announcements endpoints
  app.post('/api/news', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const announcementData = {
        ...req.body,
        authorId: req.session.surgeonInfo!.id,
        authorName: req.session.surgeonInfo!.name,
      };
      
      const published = await hospitalData.publishAnnouncement(announcementData);
      res.status(201).json(published);
    } catch (error) {
      console.error('Create news error:', error);
      res.status(500).json({ message: 'خطأ في نشر الخبر' });
    }
  });

  app.get('/api/news', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const announcements = await hospitalData.fetchAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('Fetch news error:', error);
      res.status(500).json({ message: 'خطأ في جلب الأخبار' });
    }
  });

  app.get('/api/news/:id', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id);
      const announcement = await hospitalData.fetchAnnouncementById(announcementId);
      
      if (!announcement) {
        return res.status(404).json({ message: 'الخبر غير موجود' });
      }
      
      res.json(announcement);
    } catch (error) {
      console.error('Fetch news error:', error);
      res.status(500).json({ message: 'خطأ في جلب الخبر' });
    }
  });

  app.put('/api/news/:id', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id);
      const announcement = await hospitalData.fetchAnnouncementById(announcementId);
      
      if (!announcement) {
        return res.status(404).json({ message: 'الخبر غير موجود' });
      }

      // Check permissions
      const currentSurgeon = req.session.surgeonInfo!;
      if (currentSurgeon.role !== 'head_of_department' && currentSurgeon.id !== announcement.authorId) {
        return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل هذا الخبر' });
      }

      const updated = await hospitalData.modifyAnnouncement(announcementId, req.body);
      res.json(updated);
    } catch (error) {
      console.error('Update news error:', error);
      res.status(500).json({ message: 'خطأ في تحديث الخبر' });
    }
  });

  app.delete('/api/news/:id', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id);
      const announcement = await hospitalData.fetchAnnouncementById(announcementId);
      
      if (!announcement) {
        return res.status(404).json({ message: 'الخبر غير موجود' });
      }

      // Check permissions
      const currentSurgeon = req.session.surgeonInfo!;
      if (currentSurgeon.role !== 'head_of_department' && currentSurgeon.id !== announcement.authorId) {
        return res.status(403).json({ message: 'ليس لديك صلاحية لحذف هذا الخبر' });
      }

      await hospitalData.removeAnnouncement(announcementId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete news error:', error);
      res.status(500).json({ message: 'خطأ في حذف الخبر' });
    }
  });

  // Comments endpoints
  app.post('/api/comments', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const discussionData = {
        ...req.body,
        authorId: req.session.surgeonInfo!.id,
        authorName: req.session.surgeonInfo!.name,
      };
      
      const posted = await hospitalData.postDiscussion(discussionData);
      res.status(201).json(posted);
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({ message: 'خطأ في إضافة التعليق' });
    }
  });

  app.get('/api/comments/news/:newsId', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const announcementId = parseInt(req.params.newsId);
      const discussion = await hospitalData.fetchAnnouncementDiscussion(announcementId);
      res.json(discussion);
    } catch (error) {
      console.error('Fetch comments error:', error);
      res.status(500).json({ message: 'خطأ في جلب التعليقات' });
    }
  });

  app.delete('/api/comments/:id', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      
      // Fetch the comment to check ownership
      const allComments = await hospitalData.retrieveDiscussions(0); // This will need to be improved
      const comment = allComments.find((c: any) => c.id === discussionId);
      
      if (!comment) {
        return res.status(404).json({ message: 'التعليق غير موجود' });
      }

      // Check permissions
      const currentSurgeon = req.session.surgeonInfo!;
      if (currentSurgeon.role !== 'head_of_department' && currentSurgeon.id !== comment.authorId) {
        return res.status(403).json({ message: 'ليس لديك صلاحية لحذف هذا التعليق' });
      }
      
      await hospitalData.removeDiscussion(discussionId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ message: 'خطأ في حذف التعليق' });
    }
  });

  // Statistics dashboard endpoint
  app.get('/api/statistics/dashboard', permissionChecker.requireAuthenticated, async (req, res) => {
    try {
      // Calculate various statistics
      const allPatients = await hospitalData.fetchAllPatientRecords();
      const activePatients = await hospitalData.fetchActivePatientRecords();
      const archivedRecords = await hospitalData.fetchAllArchivedRecords();

      // Group by department
      const deptGroups = new Map<string, number>();
      allPatients.forEach(p => {
        const count = deptGroups.get(p.department) || 0;
        deptGroups.set(p.department, count + 1);
      });

      // Group by diagnosis
      const diagnosisGroups = new Map<string, number>();
      allPatients.forEach(p => {
        if (p.diagnosis) {
          const count = diagnosisGroups.get(p.diagnosis) || 0;
          diagnosisGroups.set(p.diagnosis, count + 1);
        }
      });

      // Calculate discharge reasons
      const dischargeStats = {
        improved: 0,
        by_request: 0,
        escaped: 0,
        died: 0,
      };
      
      archivedRecords.forEach(record => {
        if (record.dischargeReason in dischargeStats) {
          dischargeStats[record.dischargeReason as keyof typeof dischargeStats]++;
        }
      });

      const statistics = {
        totalPatients: allPatients.length,
        activePatients: activePatients.length,
        archivedPatients: archivedRecords.length,
        patientsByDepartment: Array.from(deptGroups.entries()).map(([department, count]) => ({
          department,
          count,
        })),
        patientsByDiagnosis: Array.from(diagnosisGroups.entries()).map(([diagnosis, count]) => ({
          diagnosis,
          count,
        })),
        dischargeReasons: dischargeStats,
      };

      res.json(statistics);
    } catch (error) {
      console.error('Fetch statistics error:', error);
      res.status(500).json({ message: 'خطأ في جلب الإحصائيات' });
    }
  });

  return httpServer;
}
