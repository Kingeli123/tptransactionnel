// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed en cours...");

  // On vide les tables avant pour repartir propre
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.license.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Creer les 3 editions de BixTix
  await prisma.product.createMany({
    data: [
      {
        name: "BixTix Starter",
        slug: "bixtix-starter",
        description:
          "Idéal pour les petites équipes TI jusqu'à 5 utilisateurs. Gestion de base des tickets de support.",
        price: 49.99,
        imageUrl: "https://placehold.co/400x300?text=BixTix+Starter",
      },
      {
        name: "BixTix Pro",
        slug: "bixtix-pro",
        description:
          "Pour les équipes TI moyennes jusqu'à 25 utilisateurs. Inclut les rapports avancés et les automatisations.",
        price: 149.99,
        imageUrl: "https://placehold.co/400x300?text=BixTix+Pro",
      },
      {
        name: "BixTix Enterprise",
        slug: "bixtix-enterprise",
        description:
          "Pour les grandes organisations. Utilisateurs illimités, SLA prioritaire, intégrations sur mesure.",
        price: 499.99,
        imageUrl: "https://placehold.co/400x300?text=BixTix+Enterprise",
      },
    ],
  });

  console.log("Seed termine !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });