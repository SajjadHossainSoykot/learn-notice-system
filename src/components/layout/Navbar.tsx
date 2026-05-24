"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BellRing } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Notices", href: "/notices" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  const closeMenu = () => {
    setIsOpen(false);
  };

  async function handleLogout() {
    closeMenu();

    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-(--border) bg-(--background) px-4 py-3 shadow-sm transition-colors sm:px-5 sm:py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
          aria-label="Go to home page"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-(--primary) p-2 text-(--primary-foreground) shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
            <BellRing size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-extrabold leading-5 text-(--foreground) sm:text-sm">
              Notice System
            </p>
            <p className="truncate text-sm leading-5 text-(--muted-foreground) sm:text-xs">
              MongoDB CRUD Notice Management System
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              href="/admin/notices"
              className="rounded-lg px-3 py-2 text-sm font-medium text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com/SajjadHossainSoykot/learn-notice-system"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-(--border) bg-(--card) text-(--card-foreground) shadow-sm transition hover:bg-(--muted)"
            aria-label="GitHub Repository"
          >
            <FaGithub size={18} />
          </a>

          {status === "loading" ? (
            <div className="h-10 w-24 rounded-xl border border-(--border) bg-(--muted)" />
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-xl bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition hover:opacity-85"
            >
              Admin Login
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-(--border) bg-(--card) text-(--card-foreground) shadow-sm transition hover:bg-(--muted) sm:h-10 sm:w-10 sm:rounded-xl"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-2xl border border-(--border) bg-(--card) p-3 shadow-sm lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-bold text-(--card-foreground) transition hover:bg-(--muted) sm:text-sm"
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && (
              <Link
                href="/admin/notices"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-bold text-(--card-foreground) transition hover:bg-(--muted) sm:text-sm"
              >
                Admin Dashboard
              </Link>
            )}

            <a
              href="https://github.com/SajjadHossainSoykot/learn-notice-system"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-3 text-base font-bold text-(--card-foreground) transition hover:bg-(--muted) sm:text-sm"
            >
              <FaGithub size={17} />
              GitHub Repository
            </a>

            {status === "loading" ? (
              <div className="mt-2 rounded-xl bg-(--muted) px-4 py-3 text-center text-base font-bold text-(--muted-foreground) sm:text-sm">
                Checking session...
              </div>
            ) : isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-base font-bold text-red-600 transition hover:bg-red-50 sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/admin/login"
                onClick={closeMenu}
                className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-xl bg-(--primary) px-4 py-3 text-base font-bold text-(--primary-foreground) transition hover:opacity-85 sm:text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}