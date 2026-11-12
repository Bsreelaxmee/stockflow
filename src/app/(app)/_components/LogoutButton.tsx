"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
    >
      Log out
    </button>
  );
}