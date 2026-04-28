// src/app/actions/products.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/product";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/lib/types";
import { requireUser } from "@/lib/auth";

/**
 * CREATE : cree un nouveau produit BixTix
 */
export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Verifier que l'utilisateur est connecte (et idealement admin)
  try {
    await requireUser();
  } catch {
    return {
      success: false,
      message: "Vous devez etre connecte pour creer un produit",
    };
  }

  // 2. Extraire les donnees du FormData
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive") === "on", // checkbox
  };

  // 3. Valider avec Zod
  const validation = createProductSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Erreur de validation",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 4. Creer en BD
  try {
    await prisma.product.create({
      data: {
        name: validation.data.name,
        slug: validation.data.slug,
        description: validation.data.description,
        price: validation.data.price,
        imageUrl: validation.data.imageUrl || null,
        isActive: validation.data.isActive ?? true,
      },
    });
  } catch (error) {
    // Erreur courante : slug deja existant (contrainte unique)
    console.error("Erreur creation produit:", error);
    return {
      success: false,
      message: "Erreur lors de la creation. Le slug est peut-etre deja utilise.",
    };
  }

  // 5. Rafraichir la liste et rediriger
  revalidatePath("/produits");
  redirect("/produits");
}

/**
 * UPDATE : modifie un produit avec verrou optimiste sur le champ `version`
 */
export async function updateProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireUser();
  } catch {
    return {
      success: false,
      message: "Vous devez etre connecte pour modifier un produit",
    };
  }

  // Extraire les donnees (id et version sont dans des champs caches)
  const rawData = {
    id: formData.get("id"),
    version: formData.get("version"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive") === "on",
  };

  const validation = updateProductSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Erreur de validation",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { id, version, ...dataToUpdate } = validation.data;

  // VERROU OPTIMISTE :
  // updateMany met a jour SEULEMENT si la version envoyee correspond a celle en BD.
  // Si quelqu'un d'autre a modifie le produit entre temps, version aura change
  // et updated.count sera 0 -> conflit detecte.
  try {
    const updated = await prisma.product.updateMany({
      where: { id, version },
      data: {
        ...dataToUpdate,
        imageUrl: dataToUpdate.imageUrl || null,
        version: { increment: 1 }, // On incremente la version a chaque modif
      },
    });

    if (updated.count === 0) {
      return {
        success: false,
        message:
          "Ce produit a ete modifie par quelqu'un d'autre. Rechargez la page.",
      };
    }
  } catch (error) {
    console.error("Erreur modification produit:", error);
    return {
      success: false,
      message: "Erreur lors de la modification.",
    };
  }

  revalidatePath("/produits");
  revalidatePath(`/produits/${id}`);
  redirect("/produits");
}

/**
 * DELETE : supprime un produit (verifie qu'il existe avant)
 */
export async function deleteProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireUser();
  } catch {
    return {
      success: false,
      message: "Vous devez etre connecte pour supprimer un produit",
    };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { success: false, message: "Identifiant invalide" };
  }

  // Verifier que le produit existe
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Produit introuvable" };
  }

  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression.",
    };
  }

  revalidatePath("/produits");
  return { success: true, message: "Produit supprime avec succes" };
}