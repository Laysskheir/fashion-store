"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Facebook, Instagram, Twitter, CreditCard } from "lucide-react"
import { PaymentCards } from "../payments-cards"

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
}

export default function Footer() {
  return (
    <footer className="border-t ">
      {/* Main Footer Links */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold">{siteConfig.footer.company.title}</h3>
              <ul className="mt-4 space-y-3">
                {siteConfig.footer.company.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Links */}
            <div>
              <h3 className="text-sm font-semibold">{siteConfig.footer.help.title}</h3>
              <ul className="mt-4 space-y-3">
                {siteConfig.footer.help.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold">{siteConfig.footer.legal.title}</h3>
              <ul className="mt-4 space-y-3">
                {siteConfig.footer.legal.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold">{siteConfig.footer.social.title}</h3>
              <ul className="mt-4 space-y-3">
                {siteConfig.footer.social.links.map((link) => {
                  const Icon = socialIcons[link.icon as keyof typeof socialIcons]
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <PaymentCards />
          </div>
        </div>
      </div>
    </footer>
  )
}
