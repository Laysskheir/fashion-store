"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { Icons } from "@/components/Icons";
import { ArrowLeft } from "lucide-react";

type AuthProvider = "email" | "google" | "facebook";

interface LoadingState {
  isLoading: boolean;
  provider: AuthProvider | null;
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    provider: null,
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async (provider: AuthProvider) => {
    try {
      setLoadingState({ isLoading: true, provider });

      switch (provider) {
        case "email":
          if (!isValidEmail(email)) return;
          await signIn.magicLink({
            email,
            callbackURL: "/",
          });
          break;

        case "google":
          await signIn.social({
            provider: "google",
            callbackURL: "/"
          });
          break;

        case "facebook":
          await signIn.social({
            provider: "facebook",
            callbackURL: "/"
          });
          break;
      }
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
    } finally {
      setLoadingState({ isLoading: false, provider: null });
    }
  };

  const isProviderLoading = (provider: AuthProvider) => 
    loadingState.isLoading && loadingState.provider === provider;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <Button
        variant={"outline"}
        onClick={() => {
          window.history.back();
        }}
        className="absolute top-4 left-4 "
      >
        <ArrowLeft className=" h-4 w-4" />
        Back
      </Button>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Beauty Store account</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 pb-8 px-6">
            <div className="grid gap-6">
              {/* Social Sign In */}
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleAuth("google")}
                  disabled={loadingState.isLoading}
                >
                  {isProviderLoading("google") ? (
                    <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Icons.google className="h-5 w-5" />
                  )}
                  {isProviderLoading("google") ? "Signing in..." : "Continue with Google"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleAuth("facebook")}
                  disabled={loadingState.isLoading}
                >
                  {isProviderLoading("facebook") ? (
                    <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Icons.facebook className="h-5 w-5" />
                  )}
                  {isProviderLoading("facebook") ? "Signing in..." : "Continue with Facebook"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Sign In */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={loadingState.isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleAuth("email")}
                  disabled={loadingState.isLoading || !email || !isValidEmail(email)}
                >
                  {isProviderLoading("email") && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
                  {isProviderLoading("email") ? "Sending link..." : "Sign in with Email"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
