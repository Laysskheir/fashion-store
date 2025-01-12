"use client";

import * as React from "react";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader,
  DollarSign,
  Slash
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Product } from "@prisma/client";
import { ImportCsvFile } from "./import-csv-file";
import { formatPrice } from "@/lib/format";
import { deleteProduct } from "@/features/products/management/actions/admin/delete-product";
import { ProductWithRelations } from "@/types";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/pagination-controls";

interface Props {
  products: ProductWithRelations[];
}

export default function ProductsTable({ products }: Props) {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);

  const {
    currentPage,
    totalPages,
    rowsPerPage,
    paginatedData,
    totalItems,
    setRowsPerPage,
    goToPage
  } = usePagination({ data: products });

  const handleEdit = (productSlug: string) => {
    router.push(`/admin/products/${productSlug}`);
  };

  const handleDelete = async (product: Product) => {
    try {
      setLoading(true);
      const result = await deleteProduct(product.id);

      if (result.success) {
        toast.success("Product deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setLoading(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = paginatedData.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4  pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center gap-2">
          <ImportCsvFile />

          <Button asChild>
            <Link href="/admin/products/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(products.length * 0.1)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(products.filter((p) => p.isActive).length * 0.05)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                products.reduce((sum, p) => sum + Number(p.basePrice), 0) / products.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Products</CardTitle>
            <Slash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => !p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              -{Math.floor(products.filter((p) => !p.isActive).length * 0.05)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            Manage your product inventory and catalog in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === products.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts(products.map((product) => product.id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Inventory</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter((id) => id !== product.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>

                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "success" : "destructive"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.variants?.[0]?.sku}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(Number(product.basePrice))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge >
                        {product.variants?.[0]?.inventory}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(product.slug)}>
                            <Pencil className="h-4 w-4" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog open={productToDelete?.id === product.id}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setProductToDelete(product);
                                }}
                              >
                                <Trash2 className="h-4 w-4" /> Delete Product
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setProductToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={loading}
                                >

                                  {loading ?
                                    <>
                                      <Loader className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                                    </>
                                    :
                                    "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
            onPageChange={goToPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
