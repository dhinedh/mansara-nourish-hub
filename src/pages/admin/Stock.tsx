import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Plus,
    Minus,
    AlertTriangle,
    CheckCircle,
    Package,
    ArrowUpDown,
    RefreshCw
} from "lucide-react";
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/context/StoreContext';
import { useToast } from "@/hooks/use-toast";

const Stock = () => {
    const { products, updateProduct, isLoading, refetch } = useStore();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({
        key: 'stock',
        direction: 'asc'
    });

    // Stock Update Modal State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [stockAdjustment, setStockAdjustment] = useState<string>('');
    const [adjustmentType, setAdjustmentType] = useState<'add' | 'set'>('add');

    // Filter and Sort Products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by Search
        if (searchTerm) {
            const lowerParams = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lowerParams) ||
                p.category.toLowerCase().includes(lowerParams)
            );
        }

        // Filter by Category
        if (categoryFilter !== 'all') {
            result = result.filter(p => p.category === categoryFilter);
        }

        // Sort
        result.sort((a: any, b: any) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [products, searchTerm, categoryFilter, sortConfig]);

    // Categories for Filter
    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const openUpdateModal = (product: any) => {
        setSelectedProduct(product);
        setStockAdjustment('');
        setAdjustmentType('add');
        setIsUpdateModalOpen(true);
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct || !stockAdjustment) return;

        try {
            const adjustmentValue = parseInt(stockAdjustment);
            if (isNaN(adjustmentValue)) {
                toast({
                    title: "Invalid Input",
                    description: "Please enter a valid number for stock.",
                    variant: "destructive"
                });
                return;
            }

            let newStock = selectedProduct.stock;

            if (adjustmentType === 'add') {
                newStock += adjustmentValue;
            } else {
                newStock = adjustmentValue;
            }

            // Prevent negative stock
            if (newStock < 0) newStock = 0;

            await updateProduct(selectedProduct.id, { stock: newStock });

            toast({
                title: "Stock Updated",
                description: `Successfully updated stock for ${selectedProduct.name}. New Stock: ${newStock}`,
            });

            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Stock update failed:", error);
            toast({
                title: "Update Failed",
                description: "Could not update stock. Please try again.",
                variant: "destructive"
            });
        }
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return <Badge variant="destructive" className="bg-red-500">Out of Stock</Badge>;
        if (stock < 10) return <Badge variant="secondary" className="bg-orange-500 text-white">Low Stock</Badge>;
        return <Badge variant="default" className="bg-green-500">In Stock</Badge>;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
                        <p className="text-muted-foreground mt-2">
                            Monitor inventory levels and update product stock.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => refetch()} disabled={isLoading} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Inventory
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="capitalize">
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stock Table */}
                <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Product Name
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-slate-50 transition-colors text-right"
                                    onClick={() => handleSort('stock')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Stock Level
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Loading inventory...</TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No products found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <Package className="h-full w-full p-2 text-slate-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="capitalize">{product.category}</TableCell>
                                        <TableCell className="text-right font-mono text-lg font-semibold">
                                            {product.stock}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getStockStatus(product.stock)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openUpdateModal(product)}
                                                className="gap-2"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Update
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Stock Update Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Stock</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                            <div className="h-12 w-12 bg-white rounded border flex items-center justify-center">
                                <Package className="h-6 w-6 text-brand-blue" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{selectedProduct?.name}</h3>
                                <p className="text-sm text-muted-foreground">Current Stock: {selectedProduct?.stock}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${adjustmentType === 'add' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setAdjustmentType('add')}
                            >
                                Add Stock
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${adjustmentType === 'set' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setAdjustmentType('set')}
                            >
                                Set Total
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quantity</label>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="w-10 px-0"
                                    onClick={() => setStockAdjustment(prev => String(Math.max(0, (parseInt(prev) || 0) - 1)))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    placeholder={adjustmentType === 'add' ? "Amount to add" : "New total stock"}
                                    value={stockAdjustment}
                                    onChange={(e) => setStockAdjustment(e.target.value)}
                                    className="text-center text-lg"
                                />
                                <Button
                                    variant="outline"
                                    className="w-10 px-0"
                                    onClick={() => setStockAdjustment(prev => String((parseInt(prev) || 0) + 1))}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateStock}>Confirm Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default Stock;
