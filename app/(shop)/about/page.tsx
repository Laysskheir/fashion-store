import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Check, Heart, PackageOpen, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";

// export const metadata: Metadata = {
//   title: `About Us | ${siteConfig.name}`,
//   description:
//     "Discover our story and commitment to contemporary fashion and style.",
//   keywords: [
//     ...siteConfig.keywords,
//     "about us",
//     "our story",
//     "fashion mission",
//     "brand values",
//   ],
// };

const features = [
  {
    icon: PackageOpen,
    title: "Curated Collections",
    description:
      "Each piece is carefully selected to ensure the perfect blend of style and quality.",
  },
  {
    icon: Heart,
    title: "Style First",
    description:
      "We're dedicated to helping you express your unique personality through fashion.",
  },
  {
    icon: Truck,
    title: "Swift Delivery",
    description:
      "Get your favorite styles delivered quickly and reliably to your doorstep.",
  },
  {
    icon: Check,
    title: "Quality Guaranteed",
    description:
      "Every garment meets our high standards of craftsmanship and durability.",
  },
];

const stats = [
  { value: "1K+", label: "Styles" },
  { value: "20+", label: "Collections" },
  { value: "50K+", label: "Happy Customers" },
  { value: "98%", label: "Style Satisfaction" },
];

export default function AboutPage() {
  return (
    <Container>
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-primary via-background to-background px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-background" />
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Where Style Meets Expression
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Born from a passion for self-expression through fashion, VIبّES
            emerged as a canvas for the bold and the stylish. We believe clothes
            are more than fabric – they're your personal statement to the world.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 text-center bg-gradient-to-br from-background to-muted/50 hover:to-primary/5 transition-colors"
            >
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="group relative">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Values Section */}
      <div className="mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-muted/50 to-background p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
              Our Values
            </h2>
            <div className="mt-8 space-y-4">
              <p className="text-muted-foreground text-center">
                We believe in the power of fashion to transform and inspire. Our
                commitment to quality, sustainability, and customer satisfaction
                drives everything we do.
              </p>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                <Card className="p-6 bg-gradient-to-br from-background to-muted/50">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">
                      Exceptional product quality
                    </span>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-background to-muted/50">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">
                      Sustainable practices
                    </span>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-background to-muted/50">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">
                      Inclusive fashion standards
                    </span>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-background to-muted/50">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">
                      Customer-centric approach
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
