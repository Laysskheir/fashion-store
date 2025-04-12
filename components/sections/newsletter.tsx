"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback, useMemo } from "react";
import { z } from "zod";

// Email validation schema
const EmailSchema = z.string().email("Please enter a valid email address");

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized benefits with more descriptive content
  const newsletterBenefits = useMemo(() => [
    {
      title: "Exclusive First Look",
      description: "Preview cutting-edge collections before anyone else",
      icon: CheckCircle2,
    },
    {
      title: "Personalized Style Insights",
      description: "Curated trends tailored to your fashion preferences",
      icon: Mail,
    },
    {
      title: "Members-Only Offers",
      description: "Unlock special discounts and limited-time promotions",
      icon: AlertCircle,
    },
    {
      title: "VIP Fashion Events",
      description: "Exclusive invitations to runway shows and designer meetups",
      icon: CheckCircle2,
    },
  ], []);

  // Optimized submit handler with validation
  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate email
      const validatedEmail = EmailSchema.parse(email);

      // Simulate API call (replace with actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success handling
      toast.success("Thank you for subscribing!", {
        description: "You'll receive our latest updates and offers.",
        icon: <Mail className="h-4 w-4" />
      });

      // Reset form
      setEmail("");
    } catch (err) {
      // Handle validation errors
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        toast.error("Invalid Email", {
          description: err.errors[0].message
        });
      } else {
        // Handle other errors
        toast.error("Subscription Failed", {
          description: "Please try again later."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative overflow-hidden bg-foreground text-primary-foreground  shadow-2xl">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
              mixBlendMode: 'overlay'
            }} 
          />
        </div>

        <div className="relative px-6 py-16 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground via-primary-foreground to-primary-foreground/70 animate-gradient-x">
              Stay Fashion Forward
            </h2>
            <p className="mt-6 text-xl opacity-90 font-light leading-relaxed">
              Your gateway to the latest fashion trends, exclusive collections, 
              and personalized style recommendations.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-10 group">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address for newsletter subscription"
                    className={`
                      w-full 
                      bg-primary-foreground/10 
                      border-primary-foreground/20 
                      placeholder:text-primary-foreground/50 
                      focus:ring-2 
                      focus:ring-primary-foreground/50
                      transition-all
                      duration-300
                      ${error ? 'border-red-500 animate-shake' : ''}
                    `}
                    required
                  />
                  {error && (
                    <p 
                      role="alert" 
                      className="text-red-400 text-sm mt-2 animate-fade-in"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={isSubmitting}
                  className="
                    whitespace-nowrap 
                    group-hover:scale-105 
                    transition-transform 
                    duration-300 
                    ease-out
                    shadow-lg
                    hover:shadow-xl
                  "
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg 
                        className="animate-spin h-5 w-5 mr-2" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    "Join the Fashion Community"
                  )}
                </Button>
              </div>
              <p className="mt-4 text-xs opacity-75 italic">
                By subscribing, you agree to our Privacy Policy and consent to 
                receive personalized updates from our fashion team.
              </p>
            </form>
          </div>

          {/* Enhanced Benefits Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {newsletterBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`
                    text-center 
                    sm:text-left 
                    p-6 
                    bg-primary-foreground/10 
                    hover:bg-primary-foreground/20 
                    transition-all 
                    duration-300 
                    transform 
                    hover:-translate-y-2 
                    hover:shadow-lg
                    flex 
                    flex-col 
                    items-center 
                    sm:items-start
                    group
                  `}
                >
                  <Icon 
                    className={`
                      h-8 
                      w-8 
                      mb-4 
                      group-hover:scale-110 
                      transition-transform
                    `} 
                  />
                  <h3 className="font-bold mb-2 text-lg">{benefit.title}</h3>
                  <p className="text-sm opacity-75 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
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
