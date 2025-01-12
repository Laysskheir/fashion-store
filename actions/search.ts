'use server'

import { db } from "@/lib/db"
import { Product } from "@prisma/client"

// Define search result types
type SearchResultItem = Product & {
  relevanceScore: number
  matchType: 'exact' | 'partial' | 'fuzzy'
  matchedOn: string[]
}

type SearchResponse = {
  products: SearchResultItem[]
  suggestions: string[]
  categories: { name: string; count: number }[]
  message: string
}

// Utility functions for search
function calculateRelevanceScore(product: Product, query: string): number {
  const queryLower = query.toLowerCase()
  const nameLower = product.name.toLowerCase()
  const descLower = product.description?.toLowerCase() || ''
  
  let score = 0
  
  // Exact matches in name (highest weight)
  if (nameLower === queryLower) score += 100
  else if (nameLower.includes(queryLower)) score += 50
  
  // Word matches in name
  const queryWords = queryLower.split(' ')
  const nameWords = nameLower.split(' ')
  queryWords.forEach(qWord => {
    nameWords.forEach(nWord => {
      if (nWord === qWord) score += 30
      else if (nWord.includes(qWord)) score += 15
    })
  })
  
  // Description matches (lower weight)
  if (descLower.includes(queryLower)) score += 10
  
  // Fuzzy matching for typos
  const levenshteinDistance = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null))
    for (let i = 0; i <= str1.length; i += 1) track[0][i] = i
    for (let j = 0; j <= str2.length; j += 1) track[j][0] = j
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        )
      }
    }
    return track[str2.length][str1.length]
  }
  
  // Add fuzzy match score
  const distance = levenshteinDistance(nameLower, queryLower)
  if (distance <= 2) score += (30 - distance * 10) // Higher score for closer matches
  
  return score
}

function getMatchType(score: number): 'exact' | 'partial' | 'fuzzy' {
  if (score >= 100) return 'exact'
  if (score >= 30) return 'partial'
  return 'fuzzy'
}

function getMatchedFields(product: Product, query: string): string[] {
  const matches: string[] = []
  const queryLower = query.toLowerCase()
  
  if (product.name.toLowerCase().includes(queryLower)) matches.push('name')
  if (product.description?.toLowerCase().includes(queryLower)) matches.push('description')
  if (product.category?.name.toLowerCase().includes(queryLower)) matches.push('category')
  
  return matches
}

export async function searchProducts(query: string): Promise<SearchResponse> {
  try {
    if (!query?.trim()) {
      return {
        products: [],
        suggestions: [],
        categories: [],
        message: "No search query provided"
      }
    }

    const queryLower = query.toLowerCase()

    // Fetch products with related data
    const products = await db.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: queryLower,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: queryLower,
              mode: 'insensitive',
            },
          },
          {
            category: {
              name: {
                contains: queryLower,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        images: true,
        category: true,
      },
      take: 12, // Increased limit for better filtering
    })

    // Process and enhance search results
    const enhancedProducts: SearchResultItem[] = products.map(product => {
      const relevanceScore = calculateRelevanceScore(product, query)
      return {
        ...product,
        relevanceScore,
        matchType: getMatchType(relevanceScore),
        matchedOn: getMatchedFields(product, query)
      }
    })

    // Sort by relevance score
    const sortedProducts = enhancedProducts
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6) // Take top 6 most relevant results

    // Generate category aggregations
    const categories = Array.from(
      products.reduce((acc, product) => {
        const category = product.category?.name || 'Uncategorized'
        acc.set(category, (acc.get(category) || 0) + 1)
        return acc
      }, new Map<string, number>())
    ).map(([name, count]) => ({ name, count }))

    // Generate search suggestions
    const suggestions = Array.from(
      new Set(
        products
          .map(p => p.name.split(' '))
          .flat()
          .filter(word => 
            word.toLowerCase().includes(queryLower) && 
            word.toLowerCase() !== queryLower
          )
      )
    ).slice(0, 5)

    return {
      products: sortedProducts,
      suggestions,
      categories,
      message: sortedProducts.length > 0 
        ? `Found ${sortedProducts.length} results` 
        : "No products found"
    }

  } catch (error) {
    console.error("Search error:", error)
    throw new Error("Error performing search")
  }
}
