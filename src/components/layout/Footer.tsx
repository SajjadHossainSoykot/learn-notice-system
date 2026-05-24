import { BellRing } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-6 text-gray-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-white shadow-sm dark:bg-white dark:text-gray-950">
            <BellRing size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-950 dark:text-zinc-50">
              Notice Management System
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-zinc-400">
              Built with Next.js, MongoDB, Auth.js, and Cloudinary.
            </p>
          </div>
        </div>

        <a
          href="https://github.com/SajjadHossainSoykot"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          <FaGithub size={16} />
          Developed by Sajjad Hossain Soykot
        </a>
      </div>
    </footer>
  );
}