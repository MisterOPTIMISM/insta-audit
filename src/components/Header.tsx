"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold" style={{ color: "#1a2b3f" }}>
              InstaAudit
            </span>
            <span className="text-xl font-bold" style={{ color: "#E8724A" }}>
              .
            </span>
            <span className="text-sm text-gray-500 ml-1 hidden sm:inline">
              by Hans Demeyer
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#1a2b3f" }}
            >
              Home
            </Link>
            <Link
              href="/audit"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#1a2b3f" }}
            >
              Start Audit
            </Link>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden md:inline">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-medium px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ borderColor: "#E8724A", color: "#E8724A" }}
                >
                  Uitloggen
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
                style={{ backgroundColor: "#E8724A" }}
              >
                Inloggen
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
