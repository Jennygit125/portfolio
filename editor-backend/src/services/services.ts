import { prisma } from "../lib/prisma";
import { logger } from "../utils/logger"; // Import Pino logger

/**
 * Fetches all registered users from the database.
 * Passwords are automatically excluded for security.
 */
export const getAllUsers = async () => {
  try {
    // 1. Querying the database using Prisma
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      // Optional: Order users by name
      orderBy: {
        name: 'asc',
      },
    });

    // 2. Return the array of users to the controller
    return users;

  } catch (error) {
    // 3. Log the error internally with Pino
    logger.error({ err: error }, "Database error while fetching all users");
    
    // 4. Rethrow the error so the controller's catch can catch it and send a 500 status
    throw error;
  }
};

