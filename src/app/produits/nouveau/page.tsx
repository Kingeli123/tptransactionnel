import { ProductForm } from "@/app/components/ProductForm";
import { createProduct } from "@/app/actions/products";

export default function NouveauProduitPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nouveau produit</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}