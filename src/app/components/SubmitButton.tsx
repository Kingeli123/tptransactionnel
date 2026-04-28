// src/app/components/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  pendingText?: string;
};

export function SubmitButton({ children, pendingText = "Envoi..." }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#6c47ff] text-white rounded-md px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {pending ? pendingText : children}
    </button>
  );
}