import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
        <Icon size={22} />
      </div>

      <h3 className="text-lg font-bold text-gray-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </article>
  );
}