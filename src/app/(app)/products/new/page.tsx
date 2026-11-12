"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    quantityOnHand: 0,
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    setSaving(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Save failed");
    
    // Send user back to the products list after saving
    router.push("/products");
    router.refresh();
  }

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Add product</h1>
      
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        
        <div>
          <label className="text-sm font-medium">Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">SKU *</label>
          <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full rounded border p-2 mt-1 font-mono" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Quantity *</label>
            <input required type="number" min={0} value={form.quantityOnHand} onChange={(e) => setForm({ ...form, quantityOnHand: Number(e.target.value) })} className="w-full rounded border p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Low stock threshold</label>
            <input type="number" min={0} value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} className="w-full rounded border p-2 mt-1" placeholder="Default: 5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Cost Price</label>
            <input type="number" step="0.01" min={0} value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className="w-full rounded border p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Selling Price</label>
            <input type="number" step="0.01" min={0} value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="w-full rounded border p-2 mt-1" />
          </div>
        </div>
        
        <button disabled={saving} className="w-full rounded bg-black py-2 text-white disabled:opacity-50 font-medium">
          {saving ? "Saving..." : "Create product"}
        </button>
      </form>
    </div>
  );
}
