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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-3 text-gray-900 shadow-sm backdrop-blur transition-colors dark:border-zinc-800 dark:bg-black/90 dark:text-zinc-50 sm:px-5 sm:py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
          aria-label="Go to home page"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-950 p-2 text-white shadow-sm dark:bg-white dark:text-gray-950 sm:h-10 sm:w-10 sm:rounded-xl">
            <BellRing size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-extrabold leading-5 text-gray-950 dark:text-zinc-50 sm:text-sm">
              Notice System
            </p>
            <p className="truncate text-sm leading-5 text-gray-500 dark:text-zinc-400 sm:text-xs">
              MongoDB CRUD Notice Management System
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              href="/admin/notices"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
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
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            aria-label="GitHub Repository"
          >
            <FaGithub size={18} />
          </a>

          {status === "loading" ? (
            <div className="h-10 w-24 rounded-xl border border-gray-200 bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900" />
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/40"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-zinc-200"
            >
              Admin Login
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:h-10 sm:w-10 sm:rounded-xl"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-bold text-gray-900 transition hover:bg-gray-100 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:text-sm"
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && (
              <Link
                href="/admin/notices"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-bold text-gray-900 transition hover:bg-gray-100 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:text-sm"
              >
                Admin Dashboard
              </Link>
            )}

            <a
              href="https://github.com/SajjadHossainSoykot/learn-notice-system"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-base font-bold text-gray-900 transition hover:bg-gray-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:text-sm"
            >
              <FaGithub size={17} />
              GitHub Repository
            </a>

            {status === "loading" ? (
              <div className="mt-2 rounded-xl bg-gray-100 px-4 py-3 text-center text-base font-bold text-gray-500 dark:bg-zinc-900 dark:text-zinc-400 sm:text-sm">
                Checking session...
              </div>
            ) : isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-base font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/40 sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/admin/login"
                onClick={closeMenu}
                className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-xl bg-gray-950 px-4 py-3 text-base font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-zinc-200 sm:text-sm"
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