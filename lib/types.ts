// Types partages pour les Server Actions

/**
 * Etat retourne par toutes les Server Actions.
 * Utilise par useActionState cote client pour afficher
 * messages de succes/erreur et erreurs par champ.
 */
export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>; // Erreurs par champ (ex: { name: ["Trop court"] })
};

// Etat initial vide (a passer a useActionState)
export const initialActionState: ActionState = {
  success: false,
  message: "",
};