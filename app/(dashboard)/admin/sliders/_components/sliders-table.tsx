"use client";

import * as React from "react";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { HeroSlider } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Props {
  sliders: HeroSlider[];
}

export default function SlidersTable({ sliders }: Props) {
  const router = useRouter();
  const [selectedSliders, setSelectedSliders] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  const handleEdit = (sliderId: string) => {
    router.push(`/admin/sliders/${sliderId}`);
  };

  const handleDelete = (sliderId: string) => {
    console.log("Delete slider:", sliderId);
  };

  return (
    <div className="flex-1 space-y-4  pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sliders</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/sliders/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Slider
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sliders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sliders.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sliders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sliders.filter((s) => s.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(sliders.reduce((sum, s) => sum + s.priority, 0) / sliders.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Balanced distribution
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Sliders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sliders.filter((s) => !s.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              -1 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Slider Management</CardTitle>
          <CardDescription>
            Manage your website sliders and their display order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sliders..."
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
                      checked={selectedSliders.length === sliders.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSliders(sliders.map((slider) => slider.id));
                        } else {
                          setSelectedSliders([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliders.map((slider) => (
                  <TableRow key={slider.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSliders.includes(slider.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSliders([...selectedSliders, slider.id]);
                          } else {
                            setSelectedSliders(
                              selectedSliders.filter((id) => id !== slider.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        src={slider.imageUrl || "/placeholder.svg"}
                        alt="Slider image"
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>{slider.title}</TableCell>
                    <TableCell>{slider.subtitle || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={slider.isActive ? "success" : "destructive"}
                      >
                        {slider.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {slider.priority}
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEdit(slider.id)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(slider.id)}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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
