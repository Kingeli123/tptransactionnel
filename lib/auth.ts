// Helper pour synchroniser l'utilisateur Clerk avec la BD Prisma
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Recupere l'utilisateur Prisma correspondant au user Clerk connecte.
 * Si l'utilisateur n'existe pas encore en BD, on le cree (premier login).
 * Retourne null si personne n'est connecte.
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  // On cherche en BD
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // Premier login : on cree l'utilisateur Prisma
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    user = await prisma.user.create({
      data: {
        clerkId,
        email,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
          : null,
      },
    });
  }

  return user;
}

/**
 * Version qui throw si pas connecte (a utiliser dans les Server Actions
 * ou les pages protegees).
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Vous devez etre connecte");
  }
  return user;
}