"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value
    // TODO: Implement newsletter signup
    toast.success("Thank you for subscribing!", {
      description: "You'll receive our latest updates and offers.",
    })
    e.currentTarget.reset()
  }

  return (
    <section className="container mx-auto px-4">
      <div className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px" 
          }} />
        </div>

        <div className="relative px-6 py-16 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10">
                <Mail className="h-6 w-6" />
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
             Stay in the Loop
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Subscribe to our newsletter for exclusive offers, style tips, and new
              arrivals straight to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 placeholder:text-primary-foreground/50"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="whitespace-nowrap"
                >
                  Sign Up Now
                </Button>
              </div>
              <p className="mt-4 text-sm opacity-75">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates from our company.
              </p>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              {
                title: "Early Access",
                description: "Be first to shop new collections",
              },
              {
                title: "Style Updates",
                description: "Latest fashion trends and tips",
              },
              {
                title: "Exclusive Deals",
                description: "Special offers just for subscribers",
              },
              {
                title: "Fashion Events",
                description: "VIP invites to fashion shows",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="text-center sm:text-left p-4 rounded-lg bg-primary-foreground/10"
              >
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-75">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="rounded-2xl bg-primary p-6 sm:p-12 lg:p-20">
        <div className="mx-auto max-w-2xl text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-6" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
          </div>
          <Skeleton className="h-4 w-72 mx-auto mt-4" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
