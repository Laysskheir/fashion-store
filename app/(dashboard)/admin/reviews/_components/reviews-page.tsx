"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    MoreHorizontal,
    Search,
    Star,
    CheckCircle2,
    Eye,
    MessageSquare,
    Trash2,
    ArrowUpDown,
    AlertCircle
} from "lucide-react";
import { Review } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/pagination-controls";

interface Props {
    reviews: Review[];
}

export default function ReviewsPage({ reviews }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Review;
        direction: 'asc' | 'desc';
    } | null>(null);

    // Filter reviews
    const filteredReviews = useMemo(() => {
        return reviews.filter((review) =>
            review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [reviews, searchQuery]);

    // Sorted reviews
    const sortedReviews = useMemo(() => {
        return [...filteredReviews].sort((a, b) => {
            if (!sortConfig) return 0;

            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredReviews, sortConfig]);

    // Pagination
    const {
        currentPage,
        totalPages,
        rowsPerPage,
        paginatedData,
        totalItems,
        setRowsPerPage,
        goToPage
    } = usePagination({ data: sortedReviews });

    // Render star rating
    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const handleSort = (key: keyof Review) => {
        setSortConfig({
            key,
            direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reviews Management</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Review Reports
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviews.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All time reviews
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {(reviews.length > 0
                                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                                : "0.0")}
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Overall product rating
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviews.filter(review => review.isVerified).length}</div>
                        <p className="text-xs text-muted-foreground">
                            Approved reviews
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviews.filter(review => !review.isVerified).length}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting verification
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Review Management</CardTitle>
                    <CardDescription>
                        View and manage product reviews from your customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('rating')}
                                        >
                                            Rating
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Review</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Date
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{review.title || 'Untitled Review'}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {review.comment || 'No comment provided'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={review.isVerified ? "default" : "destructive"}
                                                className={review.isVerified 
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"}
                                            >
                                                {review.isVerified ? "Verified" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(review.createdAt).toLocaleDateString()}
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
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Respond
                                                    </DropdownMenuItem>
                                                    {!review.isVerified && (
                                                        <DropdownMenuItem>
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            Verify Review
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Review
                                                    </DropdownMenuItem>
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