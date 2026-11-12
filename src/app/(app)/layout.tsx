import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./_components/LogoutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  // If the user is not logged in, kick them back to the login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-lg">StockFlow</Link>
            <nav className="flex gap-4 text-sm font-medium text-gray-600">
              <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
              <Link href="/products" className="hover:text-black">Products</Link>
              <Link href="/settings" className="hover:text-black">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">{session.user.email}</span>
            <LogoutButton />
            {/* We will add a logout button later */}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
