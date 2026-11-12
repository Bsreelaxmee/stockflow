import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type Product = {
  id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  lowStockThreshold: number | null;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // 1. Fetch all products for this organization
  const products = await prisma.product.findMany({
    where: { organizationId: session.user.organizationId },
  });

  // 2. Calculate Totals
  const totalProducts = products.length;
  //const totalItems = products.reduce((sum, p) => sum + p.quantityOnHand, 0);//
  const totalItems = products.reduce((sum: number, p: Product) => sum + p.quantityOnHand, 0);
  // 3. Find Low Stock Items (Quantity <= Threshold or default of 5)
  const lowStockItems = products.filter((p: Product) => {
    const threshold = p.lowStockThreshold ?? 5;
    return p.quantityOnHand <= threshold;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{totalProducts}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total Items in Stock</h2>
          <p className="text-3xl font-bold mt-2">{totalItems}</p>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Low Stock Items</h2>
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Quantity</th>
                <th className="p-4 font-medium">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((p: Product) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-red-50/50">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4 font-mono text-xs text-gray-600">{p.sku}</td>
                  <td className="p-4 font-bold text-red-600">{p.quantityOnHand}</td>
                  <td className="p-4 text-gray-500">{p.lowStockThreshold ?? 5}</td>
                </tr>
              ))}
              {lowStockItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No low stock items. Everything looks good!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}