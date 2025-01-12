"use client"

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { searchProducts } from "@/actions/search"

const trendingSearches = [
  "t-shirt",
  "dress",
  "jean",
  "skincare",
  "makeup",
  "perfume",
]

interface SearchDrawerProps {
  children: React.ReactNode
}

export function SearchDrawer({ children }: SearchDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [categories, setCategories] = React.useState<{name: string; count: number}[]>([])
  const [error, setError] = React.useState("")
  const searchDebounce = React.useRef<NodeJS.Timeout>()

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!search.trim()) {
      setSearchResults([])
      setSuggestions([])
      setCategories([])
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await searchProducts(search)
      setSearchResults(result.products)
      setSuggestions(result.suggestions)
      setCategories(result.categories)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to perform search. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search on input change
  React.useEffect(() => {
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current)
    }

    searchDebounce.current = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => {
      if (searchDebounce.current) {
        clearTimeout(searchDebounce.current)
      }
    }
  }, [search])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="top"
        className="w-full h-full border-t"
      >
        <SheetHeader className="max-w-3xl mx-auto">
          <SheetTitle className="text-2xl font-bold text-center">
            Search Our Site
          </SheetTitle>
        </SheetHeader>

        <div className="max-w-3xl mx-auto mt-8">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="I'm looking for..."
              className="w-full pl-12 h-12 text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button 
              type="submit"
              size="sm"
              disabled={isLoading}
              className="absolute right-2 top-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </form>

          {/* Search Results Section */}
          {(isLoading || searchResults.length > 0 || suggestions.length > 0 || error) && (
            <div className="mt-8 space-y-6">
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          setSearch(suggestion)
                          handleSearch()
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="text-sm text-muted-foreground"
                      >
                        {category.name} ({category.count})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div>
                <h3 className="font-medium mb-4">Search Results</h3>
                
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-md mb-2" />
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/4" />
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}

                {!isLoading && searchResults.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group rounded-lg border p-3 space-y-2",
                          "hover:bg-accent transition-colors",
                          product.matchType === 'exact' && "ring-2 ring-primary",
                          product.matchType === 'partial' && "ring-1 ring-primary/50"
                        )}
                      >
                        <div className="aspect-square relative bg-muted rounded-md">
                          <img
                            src={product.images[0]?.url || "/placeholder.png"}
                            alt={product.name}
                            className="object-cover rounded-md"
                          />
                          {product.matchType === 'exact' && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              Best Match
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-accent-foreground">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            ${product.price}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {product.matchedOn.map((field) => (
                              <span
                                key={field}
                                className="text-xs bg-muted px-1.5 py-0.5 rounded-full"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!isLoading && searchResults.length === 0 && search.trim() && (
                  <p className="text-muted-foreground text-sm">
                    No products found matching "{search}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Only show trending and popular when no search is active */}
          {!search.trim() && (
            <div>
              <div className="mt-8">
                <h3 className="font-medium mb-4">Trending Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => {
                        setSearch(term)
                        handleSearch()
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
