import { prisma } from "../lib/prisma"; // Your central Prisma client
export const logActivity = async ({ action, userId, ipAddress, metadata = {} }) => {
    try {
        await prisma.activityLog.create({
            data: {
                action,
                userId, // Prisma handles the association
                ipAddress,
                metadata, // Prisma automatically maps this to JSON
            },
        });
    }
    catch (e) {
        console.error("Activity log failed:", e.message);
    }
};
//# sourceMappingURL=activtyLogger.js.map