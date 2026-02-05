"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
                ? "text-4xl font-bold"
                : "text-lg text-gray-500 hover:text-black"}
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
