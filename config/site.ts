export type SiteConfig = typeof siteConfig;

const links = {
  social: {
    tiktok: "https://tiktok.com/@luxury.fashion",
    instagram: "https://instagram.com/luxury.fashion",
    facebook: "https://facebook.com/luxury.fashion",
  },
  navigation: {
    home: "/",
    shop: "/shop",
    collections: "/collections",
    newArrivals: "/new-arrivals",
    sale: "/sale",
    contact: "/contact",
  },
  legal: {
    privacy: "/privacy",
    terms: "/terms",
    shipping: "/shipping",
    returns: "/returns",
  }
};
// LUXوّRY VIBرّES
export const siteConfig = {
  name: "LUXوّRY",
  shortName: "LUXوّRY Fashion",
  description: "Discover trendsetting fashion that defines your unique style. From contemporary streetwear to elegant essentials, express yourself with LUXوّRY premium clothing collection.",
  
  // Meta
  url: "https://luxury-fashion.com",
  ogImage: "/images/og-image.jpg",
  themeColor: "#171717",
  keywords: [
    "fashion store",
    "trendy clothes",
    "streetwear",
    "modern fashion",
    "designer clothing",
    "contemporary style",
    "LUXوّRY fashion",
  ],

  // Contact
  email: "contact@luxury-fashion.com",
  phone: "+1 (555) 123-4567",
  address: "123 Fashion Avenue, Fashion District, NY 10001",

  // Features
  features: {
    freeShippingThreshold: 100,
    currencyCode: "USD",
    newsletterDiscount: 15,
    categories: [
      "Men",
      "Women",
      "Unisex",
      "Accessories",
      "Footwear",
    ],
    collections: [
      "Street Essential",
      "Urban Luxe",
      "Modern Classic",
      "Sport Fusion",
    ]
  },

  // Links
  links,

  // Social Media
  social: {
    ...links.social,
    followers: {
      instagram: "50K+",
      tiktok: "100K+",
      facebook: "25K+",
    }
  },

  footer: {
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Store Locations", href: "/stores" },
        { label: "Our Blog", href: "/blog" }
      ]
    },
    help: {
      title: "Customer Service",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Shipping & Returns", href: "/shipping-returns" },
        { label: "FAQ", href: "/faq" },
        { label: "Size Guide", href: "/size-guide" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" }
      ]
    },
    social: {
      title: "Social",
      links: [
        { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
        { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
        { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
      ]
    },
    newsletter: {
      title: "Stay Updated",
      description: "Subscribe to our newsletter for exclusive offers and updates"
    },
    payment: {
      title: "Payment Methods",
      methods: ["visa", "mastercard", "amex", "paypal"]
    }
  }
}
