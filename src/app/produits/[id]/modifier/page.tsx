import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/app/components/ProductForm";
import { updateProduct } from "@/app/actions/products";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ModifierProduitPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  // Convertir Decimal en number pour le passer au composant client
  const productForForm = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>
      <ProductForm action={updateProduct} product={productForForm} />
    </div>
  );
}