import { z } from 'zod';
import {
  insertUserSchema,
  insertPatientSchema,
  insertFollowupSchema,
  insertMediaSchema,
  insertArchiveSchema,
  insertBedSchema,
  insertNewsSchema,
  insertCommentSchema,
  users,
  patients,
  followups,
  media,
  archive,
  beds,
  news,
  comments,
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          token: z.string().optional(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    updateRole: {
      method: 'PUT' as const,
      path: '/api/users/:id/role',
      input: z.object({ role: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
  },
  patients: {
    create: {
      method: 'POST' as const,
      path: '/api/patients',
      input: insertPatientSchema,
      responses: {
        201: z.custom<typeof patients.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/patients',
      responses: {
        200: z.array(z.custom<typeof patients.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    active: {
      method: 'GET' as const,
      path: '/api/patients/active',
      responses: {
        200: z.array(z.custom<typeof patients.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/patients/:id',
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.internal,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/patients/:id',
      input: insertPatientSchema.partial(),
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.internal,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/patients/:id',
      responses: {
        204: z.object({}),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
    discharge: {
      method: 'POST' as const,
      path: '/api/patients/:id/discharge',
      input: z.object({
        dischargeReason: z.enum(['improved', 'by_request', 'escaped', 'died']),
        notes: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof archive.$inferSelect>(),
        404: errorSchemas.internal,
        401: errorSchemas.unauthorized,
      },
    },
  },
  followups: {
    create: {
      method: 'POST' as const,
      path: '/api/followups',
      input: insertFollowupSchema,
      responses: {
        201: z.custom<typeof followups.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    listByPatient: {
      method: 'GET' as const,
      path: '/api/followups/patient/:patientId',
      responses: {
        200: z.array(z.custom<typeof followups.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/followups/:id',
      responses: {
        204: z.object({}),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
  },
  media: {
    create: {
      method: 'POST' as const,
      path: '/api/media',
      input: insertMediaSchema,
      responses: {
        201: z.custom<typeof media.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    listByPatient: {
      method: 'GET' as const,
      path: '/api/media/patient/:patientId',
      responses: {
        200: z.array(z.custom<typeof media.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/media/:id',
      responses: {
        204: z.object({}),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
  },
  archive: {
    list: {
      method: 'GET' as const,
      path: '/api/archive',
      responses: {
        200: z.array(z.custom<typeof archive.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
  beds: {
    get: {
      method: 'GET' as const,
      path: '/api/beds/:department',
      responses: {
        200: z.custom<typeof beds.$inferSelect>(),
        404: errorSchemas.internal,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/beds/:department',
      input: insertBedSchema.partial(),
      responses: {
        200: z.custom<typeof beds.$inferSelect>(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
  },
  news: {
    create: {
      method: 'POST' as const,
      path: '/api/news',
      input: insertNewsSchema,
      responses: {
        201: z.custom<typeof news.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/news',
      responses: {
        200: z.array(z.custom<typeof news.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/news/:id',
      responses: {
        200: z.custom<typeof news.$inferSelect>(),
        404: errorSchemas.internal,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/news/:id',
      input: insertNewsSchema.partial(),
      responses: {
        200: z.custom<typeof news.$inferSelect>(),
        404: errorSchemas.internal,
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/news/:id',
      responses: {
        204: z.object({}),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
  },
  comments: {
    create: {
      method: 'POST' as const,
      path: '/api/comments',
      input: insertCommentSchema,
      responses: {
        201: z.custom<typeof comments.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    listByNews: {
      method: 'GET' as const,
      path: '/api/comments/news/:newsId',
      responses: {
        200: z.array(z.custom<typeof comments.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/comments/:id',
      responses: {
        204: z.object({}),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
  },
  statistics: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/statistics/dashboard',
      responses: {
        200: z.object({
          totalPatients: z.number(),
          activePatients: z.number(),
          archivedPatients: z.number(),
          patientsByDepartment: z.array(z.object({
            department: z.string(),
            count: z.number(),
          })),
          patientsByDiagnosis: z.array(z.object({
            diagnosis: z.string(),
            count: z.number(),
          })),
          dischargeReasons: z.object({
            improved: z.number(),
            by_request: z.number(),
            escaped: z.number(),
            died: z.number(),
          }),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
