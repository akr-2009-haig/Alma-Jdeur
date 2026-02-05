import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import type { User } from '@shared/schema';

// Custom password security manager
class PasswordSecurityManager {
  private readonly securityRounds = 12;

  async encryptPassword(plainPassword: string): Promise<string> {
    const secureHash = await bcrypt.hash(plainPassword, this.securityRounds);
    return secureHash;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);
    return isValidPassword;
  }
}

export const passwordManager = new PasswordSecurityManager();

// Session user type extension
declare module 'express-session' {
  interface SessionData {
    surgeonInfo?: User;
  }
}

// Permission checker middleware
export class PermissionChecker {
  requireAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.session?.surgeonInfo) {
      return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });
    }
    next();
  }

  requireRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const currentSurgeon = req.session?.surgeonInfo;
      
      if (!currentSurgeon) {
        return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });
      }

      if (!allowedRoles.includes(currentSurgeon.role)) {
        return res.status(403).json({ message: 'ليس لديك صلاحية للقيام بهذا الإجراء' });
      }

      next();
    };
  }

  canModifyResource(resourceAuthorId: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      const currentSurgeon = req.session?.surgeonInfo;
      
      if (!currentSurgeon) {
        return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });
      }

      // Head of department can modify anything
      if (currentSurgeon.role === 'head_of_department') {
        return next();
      }

      // Otherwise, user can only modify their own resources
      if (currentSurgeon.id !== resourceAuthorId) {
        return res.status(403).json({ message: 'يمكنك فقط تعديل أو حذف ما قمت بنشره' });
      }

      next();
    };
  }
}

export const permissionChecker = new PermissionChecker();
