import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-full text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
           Notice Management System
          </h1>
          <p className="max-w-full text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This is a MongoDB CRUD Based Notice Management System.

          </p>
        </div>
        <div className="flex flex-col text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="/notices"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Notices
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://github.com/SajjadHossainSoykot/learn-notice-system"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github Repo
          </a>
        </div>
      </main>
    </div>
  );
}
