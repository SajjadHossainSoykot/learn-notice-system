import Link from "next/link";
import {
  BellRing,
  CalendarDays,
  CloudUpload,
  Database,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import FeatureCard from "@/components/home/FeatureCard";
import HeroPreviewCard from "@/components/home/HeroPreviewCard";

const features = [
  {
    title: "MongoDB CRUD",
    description:
      "Create, read, update, and delete notices using a real MongoDB database connection.",
    icon: Database,
  },
  {
    title: "Admin Protection",
    description:
      "Protected admin dashboard with MongoDB-based admin users and route protection.",
    icon: ShieldCheck,
  },
  {
    title: "Custom Notice Date",
    description:
      "Publish notices with today’s date or manually select a backdated notice date.",
    icon: CalendarDays,
  },
  {
    title: "PDF/Image Upload",
    description:
      "Upload notice attachments with Cloudinary, including original PDF open/download support.",
    icon: CloudUpload,
  },
  {
    title: "PDF Page Preview",
    description:
      "Preview PDF pages as generated image previews while keeping the original PDF file.",
    icon: FileText,
  },
  {
    title: "Search & Filter",
    description:
      "Search notices by title, description, date, category, or attachment filename.",
    icon: Search,
  },
];

export default function HomeLanding() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50 px-4 py-10 text-gray-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-10 lg:p-14">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <BellRing size={17} />
                Learning MongoDB with Next.js
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Notice Management System
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                A full-stack learning project built with Next.js, MongoDB,
                Auth.js, and Cloudinary. It demonstrates a practical notice
                portal with admin management, file attachments, searchable
                notices, category filtering, pagination, and PDF page previews.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/notices"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-950 px-6 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  View Public Notices
                </Link>

                <Link
                  href="/admin/notices"
                  className="inline-flex h-12 items-center justify-center rounded-xl border bg-white px-6 text-sm font-bold text-gray-800 transition hover:bg-gray-100"
                >
                  Admin Dashboard
                </Link>

                <a
                  href="https://github.com/SajjadHossainSoykot/learn-notice-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-6 text-sm font-bold text-gray-800 transition hover:bg-gray-100"
                >
                  <FaGithub size={18} />
                  GitHub
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-2xl font-black text-gray-950">CRUD</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Notice add, edit, delete
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-2xl font-black text-gray-950">PDF</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Preview, open, download
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-2xl font-black text-gray-950">Admin</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Protected management
                  </p>
                </div>
              </div>
            </div>

            <HeroPreviewCard />
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                Project Purpose
              </p>

              <h2 className="text-2xl font-black text-gray-950">
                Built as a practical MongoDB learning project
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
                This project can be used as a prototype foundation for a future
                organization or NGO website admin portal where staff members can
                manage notices, documents, attachments, and public content.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/notices"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-950 px-6 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Open Notice Board
              </Link>

              <Link
                href="/admin/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-white px-6 text-sm font-bold text-gray-800 transition hover:bg-gray-100"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}