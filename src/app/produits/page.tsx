// src/app/produits/page.tsx
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { DeleteProductButton } from "../components/DeleteProductButton";

export default async function ProduitsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produits BixTix</h1>
        <Link
          href="/produits/nouveau"
          className="bg-[#6c47ff] text-white rounded-md px-4 py-2"
        >
          + Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">Aucun produit.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Nom</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Prix</th>
              <th className="text-left p-3">Actif</th>
              <th className="text-left p-3">Version</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-gray-600">{p.slug}</td>
                <td className="p-3">{p.price.toString()} $</td>
                <td className="p-3">{p.isActive ? "Oui" : "Non"}</td>
                <td className="p-3">{p.version}</td>
                <td className="p-3 text-right space-x-2">
                  <Link
                    href={`/produits/${p.id}/modifier`}
                    className="text-blue-600 hover:underline"
                  >
                    Modifier
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}