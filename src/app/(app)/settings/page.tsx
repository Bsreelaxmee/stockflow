"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load the current setting when the page opens
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.defaultLowStockThreshold !== undefined) {
          setThreshold(data.defaultLowStockThreshold);
        }
        setLoading(false);
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLowStockThreshold: threshold }),
    });
    
    setSaving(false);
    if (res.ok) {
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(null), 3000); // Hide message after 3 seconds
    } else {
      setMessage("Failed to save settings.");
    }
  }

  if (loading) return <div className="p-4">Loading settings...</div>;

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        {message && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{message}</p>}
        
        <div>
          <label className="text-sm font-medium">Default Low Stock Threshold</label>
          <p className="text-xs text-gray-500 mb-2">Used when a product does not have its own threshold.</p>
          <input
            type="number"
            min={0}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full rounded border p-2"
            required
          />
        </div>
        
        <button disabled={saving} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
