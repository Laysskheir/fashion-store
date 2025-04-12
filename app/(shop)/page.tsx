import PopularPicks from "@/components/sections/popular-picks";
import { getAllSliders } from "@/features/silders/actions/get-all-sliders";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import FeaturedBrands from "@/components/sections/featured-brands";
import InstagramFeed from "@/components/sections/instagram-feed";
import Newsletter from "@/components/sections/newsletter";
import { getTrendingProducts } from "@/features/products/actions/get-trending-products";
import { getFeaturedBrands } from "@/features/brands/actions/get-featured-brands";
import { getPopularPicksProducts } from "@/features/products/actions/get-popular-picks-products";
import TopCollections from "@/components/sections/top-collections";
import { getCategories } from "@/features/categories/actions/categories";
import HeroCarousel from "@/components/sections/HeroCarousel";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
}

export default async function Home() {
  const [sliders, categories, trendingProducts, featuredBrands, popularPicksProducts] = await Promise.all([
    getAllSliders(),
    getCategories(),
    getTrendingProducts(),
    getFeaturedBrands(),
    getPopularPicksProducts(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Carousel - Showcase latest collections */}
      <HeroCarousel sliders={sliders} />

      {/* Trending Now - Popular items */}
      {/* <TrendingNow products={trendingProducts} /> */}

      {/* Top Collections - Curated categories */}
      <TopCollections categories={categories} />

      {/* Featured Brands */}
      <FeaturedBrands brands={featuredBrands} />

      {/* Popular Picks - Best sellers */}
      <PopularPicks products={popularPicksProducts} />

      {/* Instagram Feed - Social proof */}
      <InstagramFeed />

      {/* Newsletter Signup */}
      <Newsletter />
    </div>
  );
}
