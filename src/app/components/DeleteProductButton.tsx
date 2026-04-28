"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/actions/products";
import { initialActionState } from "@/lib/types";

type Props = {
  id: string;
  name: string;
};

export function DeleteProductButton({ id, name }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) return;

    const formData = new FormData();
    formData.append("id", id);

    startTransition(async () => {
      const result = await deleteProduct(initialActionState, formData);
      if (!result.success) {
        alert(result.message);
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:underline disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </button>
  );
}