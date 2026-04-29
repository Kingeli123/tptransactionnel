import { NextResponse } from "next/server";
import { getProductStats } from "@/lib/queries/products";

/**
 * GET /api/products/stats
 * Retourne les statistiques agregees du catalogue
 */
export async function GET() {
  try {
    const stats = await getProductStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/products/stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}