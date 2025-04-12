"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { Icons } from "@/components/Icons";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type AuthProvider = "email" | "google" | "facebook";
type AuthStep = "initial" | "email-verification" | "password-reset";

interface LoadingState {
  isLoading: boolean;
  provider: AuthProvider | null;
}

interface EmailValidation {
  isValid: boolean;
  message: string;
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [authStep, setAuthStep] = useState<AuthStep>("initial");
  const [emailValidation, setEmailValidation] = useState<EmailValidation>({
    isValid: false,
    message: "",
  });
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    provider: null,
  });

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    setEmailValidation({
      isValid,
      message: isValid 
        ? "Email looks good!" 
        : "Please enter a valid email address"
    });

    return isValid;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) validateEmail(email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email, validateEmail]);

  const handleAuth = async (provider: AuthProvider) => {
    try {
      setLoadingState({ isLoading: true, provider });

      switch (provider) {
        case "email":
          if (!validateEmail(email)) {
            toast({
              title: "Invalid Email",
              description: "Please enter a valid email address.",
              variant: "destructive"
            });
            return;
          }

          await signIn.magicLink({
            email,
            callbackURL: "/",
          });

          setAuthStep("email-verification");
          toast({
            title: "Check Your Email",
            description: "We've sent a magic link to your inbox.",
            variant: "default"
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
      toast({
        title: "Authentication Error",
        description: `${provider} authentication failed.`,
        variant: "destructive"
      });
      console.error(`${provider} authentication error:`, error);
    } finally {
      setLoadingState({ isLoading: false, provider: null });
    }
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address for password reset.",
        variant: "destructive"
      });
      return;
    }

    try {
      await signIn.resetPassword({ email });
      toast({
        title: "Password Reset",
        description: "Check your email for password reset instructions.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "Could not initiate password reset.",
        variant: "destructive"
      });
    }
  };

  const isProviderLoading = (provider: AuthProvider) => 
    loadingState.isLoading && loadingState.provider === provider;

  const renderAuthContent = () => {
    switch (authStep) {
      case "email-verification":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <p className="text-muted-foreground">
              We've sent a magic link to {email}. Click the link to sign in.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setAuthStep("initial")}
            >
              Try Another Email
            </Button>
          </motion.div>
        );

      case "password-reset":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "h-11",
                emailValidation.isValid ? "border-green-500" : "border-red-500"
              )}
            />
            {email && (
              <div className={cn(
                "text-sm flex items-center",
                emailValidation.isValid ? "text-green-500" : "text-red-500"
              )}>
                {emailValidation.isValid ? <CheckCircle2 className="mr-2" /> : <XCircle className="mr-2" />}
                {emailValidation.message}
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={handlePasswordReset}
              disabled={!emailValidation.isValid}
            >
              Send Reset Link
            </Button>
            <Button 
              variant="link" 
              className="w-full"
              onClick={() => setAuthStep("initial")}
            >
              Back to Sign In
            </Button>
          </motion.div>
        );

      default:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            {/* Social Sign In */}
            <div className="grid gap-3">
              {["google", "facebook"].map((provider) => (
                <Button
                  key={provider}
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleAuth(provider as AuthProvider)}
                  disabled={loadingState.isLoading}
                >
                  {isProviderLoading(provider as AuthProvider) ? (
                    <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    provider === "google" ? <Icons.google className="h-5 w-5" /> : <Icons.facebook className="h-5 w-5" />
                  )}
                  {isProviderLoading(provider as AuthProvider) 
                    ? `Signing in...` 
                    : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
                </Button>
              ))}
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
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={cn(
                    "h-11",
                    email && (emailValidation.isValid ? "border-green-500" : "border-red-500")
                  )}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {email && (
                  <div className={cn(
                    "text-sm flex items-center",
                    emailValidation.isValid ? "text-green-500" : "text-red-500"
                  )}>
                    {emailValidation.isValid ? <CheckCircle2 className="mr-2" /> : <XCircle className="mr-2" />}
                    {emailValidation.message}
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => handleAuth("email")}
                disabled={!emailValidation.isValid}
              >
                {isProviderLoading("email") && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
                {isProviderLoading("email") ? "Sending link..." : "Sign in with Email"}
              </Button>

              <Button 
                variant="link" 
                className="w-full text-sm"
                onClick={() => setAuthStep("password-reset")}
              >
                Forgot Password?
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="absolute top-4 left-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {authStep === "email-verification" 
              ? "Verify Your Email" 
              : authStep === "password-reset" 
                ? "Reset Password" 
                : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {authStep === "email-verification" 
              ? "One more step to access your account" 
              : authStep === "password-reset" 
                ? "Enter your email to reset your password" 
                : "Sign in to your Beauty Store account"}
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 pb-8 px-6">
            {renderAuthContent()}
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