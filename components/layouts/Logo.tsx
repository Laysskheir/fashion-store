import Link from "next/link";
import React from "react";
import { cinzelDecorative } from "@/styles/fonts";
import { siteConfig } from "@/config/site";

export default function Logo() {
  return (
    <Link
      href="/"
      className={`
        ${cinzelDecorative.className} 
        text-2xl 
        font-semibold 
        tracking-wider 
        hover:opacity-75 
        transition-opacity 
        duration-200
      `}
    >
      {siteConfig.name}
    </Link>
  );
}
