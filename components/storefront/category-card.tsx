import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function CategoryCard({
  href,
  label,
  caption,
  icon,
  tone,
}: {
  href: string;
  label: string;
  caption: string;
  icon: ReactNode;
  tone: "coral" | "teal" | "ink";
}) {
  return (
    <Link href={href} className={`category-card category-${tone}`}>
      <div className="category-icon">{icon}</div>
      <div>
        <span>{caption}</span>
        <h3>{label}</h3>
      </div>
      <ArrowRight />
    </Link>
  );
}
