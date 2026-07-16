import { prisma } from "../lib/prisma"; // Your central Prisma client

interface LogActivityProps {
  action: string;
  userId?: number | null; 
  ipAddress?: string | null;
  metadata?: Record<string, any>; // Proper type for JSON metadata
}

export const logActivity = async ({ action, userId, ipAddress, metadata = {} }: LogActivityProps) => {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        userId,     // Prisma handles the association
        ipAddress,
        metadata,   // Prisma automatically maps this to JSON
      },
    });
  } catch (e: any) {
    console.error("Activity log failed:", e.message);
  }
};