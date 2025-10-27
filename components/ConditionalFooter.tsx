"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load Footer component
const Footer = dynamic(() => import("@/components/FooterPage").then((mod) => mod.default), {
  ssr: true,
  loading: () => <div>Loading...</div>,
});

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return !isAdminPage ? <Footer /> : null;
}