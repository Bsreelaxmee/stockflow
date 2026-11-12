import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/new" className="rounded bg-black px-4 py-2 text-sm text-white font-medium">
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Quantity</th>
              <th className="p-4 font-medium">Selling Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: { id: string; name: string; sku: string; quantityOnHand: number; sellingPrice: number | null }) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">{p.name}</td>
                <td className="p-4 font-mono text-xs text-gray-600">{p.sku}</td>
                <td className="p-4">{p.quantityOnHand}</td>
                <td className="p-4">
                  {p.sellingPrice ? `$${Number(p.sellingPrice).toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
            
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No products yet. Click &quot;Add Product&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
