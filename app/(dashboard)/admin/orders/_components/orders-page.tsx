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
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    PackageSearch,
    Eye,
    Download,
    Trash2,
    ArrowUpDown,
    Clock,
    CheckCircle2,
    XCircle,
    TruckIcon,
    RefreshCcw,
    Filter
} from "lucide-react";
import { Order, OrderStatus } from "@prisma/client";
import { formatDate, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { cancelOrder, downloadInvoice } from "../actions";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/pagination-controls";

interface Props {
    orders: Order[];
}

const statusIcons = {
    PENDING: <Clock className="h-4 w-4" />,
    PROCESSING: <RefreshCcw className="h-4 w-4" />,
    SHIPPED: <TruckIcon className="h-4 w-4" />,
    DELIVERED: <CheckCircle2 className="h-4 w-4" />,
    CANCELLED: <XCircle className="h-4 w-4" />,
    REFUNDED: <RefreshCcw className="h-4 w-4" />
};

const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800"
};

export default function OrdersPage({ orders }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Order;
        direction: 'asc' | 'desc';
    } | null>({
        key: 'createdAt',
        direction: 'desc'
    });
    const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);

    const {
        currentPage,
        totalPages,
        rowsPerPage,
        paginatedData,
        totalItems,
        setRowsPerPage,
        goToPage
    } = usePagination({ data: orders });

    // Memoized filtering and sorting
    const processedOrders = useMemo(() => {
        let result = paginatedData;

        // Search filter
        if (searchQuery) {
            result = result.filter((order) =>
                order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "ALL") {
            result = result.filter(order => order.status === statusFilter);
        }

        // Sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [paginatedData, searchQuery, statusFilter, sortConfig]);

    // Order statistics
    const orderStats = useMemo(() => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const statusCounts = Object.values(OrderStatus).reduce((acc, status) => {
            acc[status] = orders.filter(order => order.status === status).length;
            return acc;
        }, {} as Record<OrderStatus, number>);

        return {
            totalOrders,
            totalRevenue,
            averageOrderValue,
            statusCounts
        };
    }, [orders]);

    // Action handlers
    const handleCancelOrder = async (orderId: string) => {
        setProcessingOrderId(orderId);
        try {
            const result = await cancelOrder(orderId);
            
            if (result.success) {
                toast.success("Order cancelled successfully");
            } else {
                toast.error(result.error || "Failed to cancel order");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleDownloadInvoice = async (orderId: string) => {
        setProcessingOrderId(orderId);
        try {
            const result = await downloadInvoice(orderId);
            
            if (result.success) {
                // Create a blob and trigger download
                const blob = new Blob([result.data.pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = result.data.filename;
                link.click();
                
                toast.success("Invoice downloaded successfully");
            } else {
                toast.error(result.error || "Failed to download invoice");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleSort = (key: keyof Order) => {
        setSortConfig({
            key,
            direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <PackageSearch className="mr-2 h-4 w-4" />
                        Track Order
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            All time orders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPrice(orderStats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime revenue
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPrice(orderStats.averageOrderValue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per order
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.statusCounts.PENDING}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>
                        View and manage all orders in one place.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders by number or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Select 
                                value={statusFilter} 
                                onValueChange={(value) => setStatusFilter(value as OrderStatus | "ALL")}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    {Object.values(OrderStatus).map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('orderNumber')}
                                        >
                                            Order Number
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('total')}
                                        >
                                            Total
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
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
                                {processedOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            #{order.orderNumber}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}>
                                                {statusIcons[order.status]}
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatPrice(Number(order.total))}</TableCell>
                                        <TableCell>
                                            {formatDate(order.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-8 w-8 p-0"
                                                        disabled={processingOrderId === order.id}
                                                    >
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        onSelect={() => {/* View order details */}}
                                                        disabled={processingOrderId === order.id}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onSelect={() => handleDownloadInvoice(order.id)}
                                                        disabled={processingOrderId === order.id}
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download Invoice
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-red-600" 
                                                        onSelect={() => handleCancelOrder(order.id)}
                                                        disabled={
                                                            order.status !== 'PENDING' || 
                                                            processingOrderId === order.id
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Cancel Order
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {processedOrders.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No orders found
                            </div>
                        )}
                    </div>

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