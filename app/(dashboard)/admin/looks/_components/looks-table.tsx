"use client";

import * as React from "react";
import { PlusCircle, Search } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Look } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deleteLook } from "../actions/look-actions";

interface Props {
  looks: Look[];
}

export default function LooksTable({ looks }: Props) {
  const router = useRouter();
  const [selectedLooks, setSelectedLooks] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  const filteredLooks = looks.filter((look) =>
    look.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (lookId: string) => {
    router.push(`/admin/looks/${lookId}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Looks</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/looks/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Look
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Looks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{looks.length}</div>
            <p className="text-xs text-muted-foreground">
              All created looks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Looks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {looks.filter((l) => l.isFeatured).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Featured on homepage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Looks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {looks.filter((l) => !l.isArchived).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived Looks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {looks.filter((l) => l.isArchived).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Hidden from store
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Look Management</CardTitle>
          <CardDescription>
            Manage your beauty looks and their products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search looks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLooks.length === looks.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLooks(looks.map((look) => look.id));
                        } else {
                          setSelectedLooks([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLooks.map((look) => (
                  <TableRow key={look.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLooks.includes(look.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLooks([...selectedLooks, look.id]);
                          } else {
                            setSelectedLooks(
                              selectedLooks.filter((id) => id !== look.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        src={look.image || "/placeholder.svg"}
                        alt={look.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>{look.name}</TableCell>
                    <TableCell>{look.productsCount || 0} products</TableCell>

                    <TableCell>
                      <Badge variant={look.isActive ? "default" : "destructive"}>
                        {look.isActive ? "Active" : "Archived"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(look.id)}>
                            <Pencil className=" h-4 w-4" /> Edit Look
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className=" h-4 w-4" /> Delete Look
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the look
                                  and remove it from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async () => {
                                    try {
                                      await deleteLook(look.id);
                                      toast.success("Look deleted successfully");
                                      router.refresh();
                                    } catch (error) {
                                      toast.error("Something went wrong");
                                    }
                                  }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
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
        </CardContent>
      </Card>
    </div>
  );
}
