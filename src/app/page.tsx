// src/app/page.tsx
import { getCurrentUser } from "../../lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Accueil BixTix</h1>

      {user ? (
        <div className="border p-4 rounded">
          <p>Connecte et synchronise avec la BD</p>
          <p>ID Prisma : {user.id}</p>
          <p>Email : {user.email}</p>
          <p>Nom : {user.name ?? "(non renseigne)"}</p>
          <p>Role : {user.role}</p>
          <p>Clerk ID : {user.clerkId}</p>
        </div>
      ) : (
        <p>Pas connecte. Cliquez sur Inscription / Se connecter en haut.</p>
      )}
    </div>
  );
}