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
  { name: "Countries", href: "/countries" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 items-end border-b pb-4 mb-12">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              transition-all duration-300 ease-out
              ${isActive
                ? `${climate_crisis.className} text-3xl md:text-4xl text-accent`
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
