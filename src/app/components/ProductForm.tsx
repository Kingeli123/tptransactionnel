"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/types";
import type { ActionState } from "@/lib/types";
import { SubmitButton } from "./SubmitButton";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  version: number;
};

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product; // undefined = creation, defini = edition
};

export function ProductForm({ action, product }: Props) {
  const [state, formAction] = useActionState(action, initialActionState);
  const isEdit = !!product;

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      {/* Champs caches pour l'edition (id + version) */}
      {isEdit && (
        <>
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="version" value={product.version} />
        </>
      )}

      {/* Message global */}
      {state.message && (
        <div
          className={`p-3 rounded ${
            state.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={product?.name}
          className="w-full border rounded px-3 py-2"
        />
        {state.errors?.name && (
          <p className="text-red-600 text-sm mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={product?.slug}
          placeholder="bixtix-pro"
          className="w-full border rounded px-3 py-2"
        />
        {state.errors?.slug && (
          <p className="text-red-600 text-sm mt-1">{state.errors.slug[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="w-full border rounded px-3 py-2"
        />
        {state.errors?.description && (
          <p className="text-red-600 text-sm mt-1">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Prix */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Prix ($)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          className="w-full border rounded px-3 py-2"
        />
        {state.errors?.price && (
          <p className="text-red-600 text-sm mt-1">{state.errors.price[0]}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
          URL de l&apos;image (optionnel)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={product?.imageUrl ?? ""}
          className="w-full border rounded px-3 py-2"
        />
        {state.errors?.imageUrl && (
          <p className="text-red-600 text-sm mt-1">
            {state.errors.imageUrl[0]}
          </p>
        )}
      </div>

      {/* Actif */}
      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={product?.isActive ?? true}
        />
        <label htmlFor="isActive">Produit actif</label>
      </div>

      <SubmitButton pendingText={isEdit ? "Modification..." : "Creation..."}>
        {isEdit ? "Modifier" : "Creer"}
      </SubmitButton>
    </form>
  );
}