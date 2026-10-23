"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Climate_Crisis } from "next/font/google";

const climate_crisis = Climate_Crisis({
  subsets: ["latin"],
  weight: ["400"],
})

const navItems = [
  { name: "Welcome", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Guestbook", href: "/guestbook" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-8 items-end border-b pb-4 mb-12">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              transition-all duration-300 ease-out
              ${isActive
                ? `${climate_crisis.className} text-6xl text-accent`
                : `${climate_crisis.className} text-lg hover:text-accent`}
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
