"use client"

import { CsvImporter } from "@/features/products/csv/components/csv-importer"
import { importProducts } from "@/features/products/csv/actions/import-products"
import { toast } from "sonner"

const productFields = [
  { label: "Name", value: "name", required: true },
  { label: "Slug", value: "slug", required: true },
  { label: "Description", value: "description", required: true },
  { label: "Base Price", value: "basePrice", required: true },
  { label: "Brand", value: "brand", required: true },
  { label: "Category ID", value: "categoryId", required: true },
  { label: "Weight", value: "weight" },
  { label: "Dimensions", value: "dimensions" },
  { label: "Material", value: "material" },
  { label: "Care Instructions", value: "careInstructions" },
  { label: "Is Active", value: "isActive" }
]

export function ImportCsvFile() {
  return (
    <CsvImporter
      fields={productFields}
      onImport={async (data) => {
        try {
          // Transform the flat CSV data into the product structure
          const products = data.map(row => ({
            name: row.name as string,
            slug: row.slug as string,
            description: row.description as string,
            basePrice: parseFloat(row.basePrice as string),
            brand: row.brand as string,
            categoryId: row.categoryId as string,
            weight: row.weight as string,
            dimensions: row.dimensions as string,
            material: row.material as string,
            careInstructions: row.careInstructions as string,
            isActive: row.isActive === 'true',
          }))

          // Import the transformed products
          const result = await importProducts(products)
          
          if (result.success) {
            toast.success(`Successfully imported ${result.successCount} products`)
          } else {
            toast.error(
              result.errors.length > 0
                ? `Import failed: ${result.errors[0].message}`
                : 'Import failed'
            )
          }

          if (result.errors.length > 0) {
            console.error('Import errors:', result.errors)
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to process CSV data')
          console.error('CSV processing error:', error)
        }
      }}
      className="self-end"
    >
      Import Products
    </CsvImporter>
  )
}
