// Schemas de validation Zod pour le produit
import { z } from "zod";

// Schema pour la creation d'un produit
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Le nom doit contenir au moins 3 caracteres")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),

  slug: z
    .string()
    .trim()
    .min(3, "Le slug doit contenir au moins 3 caracteres")
    .max(100, "Le slug ne peut pas depasser 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    ),

  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caracteres")
    .max(2000, "La description ne peut pas depasser 2000 caracteres"),

  price: z.coerce
    .number({ message: "Le prix doit etre un nombre" })
    .positive("Le prix doit etre superieur a 0")
    .max(99999.99, "Le prix ne peut pas depasser 99999.99"),

  imageUrl: z
    .string()
    .trim()
    .url("L'URL de l'image n'est pas valide")
    .max(500, "L'URL ne peut pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")), // Accepte une chaine vide (champ optionnel)

  isActive: z.coerce.boolean().default(true),
});

// Schema pour la mise a jour : tous les champs sont optionnels
// On ajoute id et version pour le verrou optimiste
export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1, "L'identifiant est requis"),
  version: z.coerce.number().int().nonnegative(),
});

// Types TypeScript inferes des schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;