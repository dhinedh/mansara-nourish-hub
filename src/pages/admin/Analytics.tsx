import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Loader2, TrendingUp, Users, ShoppingBag, IndianRupee, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/lib/api';

const Analytics: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30'); // days
    const [salesData, setSalesData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [topCustomers, setTopCustomers] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalCustomers: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('mansara-token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch Sales Data
            const salesRes = await axios.get(`${API_URL}/stats/sales?days=${timeRange}`, config);
            setSalesData(salesRes.data.sales || []);

            // Calculate totals from sales data
            const totalRev = salesRes.data.sales.reduce((acc: number, curr: any) => acc + curr.totalSales, 0);
            const totalOrd = salesRes.data.sales.reduce((acc: number, curr: any) => acc + curr.totalOrders, 0);

            setStats(prev => ({
                ...prev,
                totalRevenue: totalRev,
                totalOrders: totalOrd,
                averageOrderValue: totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0
            }));

            // Fetch Top Products
            const productsRes = await axios.get(`${API_URL}/stats/products?limit=5`, config);
            setTopProducts(productsRes.data.products || []);

            // Fetch Top Customers
            const customersRes = await axios.get(`${API_URL}/stats/customers?limit=5`, config);
            setTopCustomers(customersRes.data.customers || []);
            setStats(prev => ({ ...prev, totalCustomers: customersRes.data.totalCustomers || 0 }));

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-500">Overview of your store's performance</p>
                        </div>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 Days</SelectItem>
                                <SelectItem value="30">Last 30 Days</SelectItem>
                                <SelectItem value="90">Last 3 Months</SelectItem>
                                <SelectItem value="365">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Key Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                    <IndianRupee className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                                    <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                                    <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Avg. Order Value</p>
                                    <h3 className="text-2xl font-bold">₹{stats.averageOrderValue.toLocaleString()}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                                    <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Sales Trend */}
                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Sales Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={salesData}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1F2A7C" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#1F2A7C" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="_id"
                                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value: number) => [`₹${value}`, 'Sales']}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            />
                                            <Area type="monotone" dataKey="totalSales" stroke="#1F2A7C" fillOpacity={1} fill="url(#colorSales)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Products */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border font-bold text-gray-500">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.totalQuantity} units sold</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-sm">₹{product.totalRevenue.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Customers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Customers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topCustomers.map((customer, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                    {customer.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{customer.name}</p>
                                                    <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-sm">₹{customer.totalSpent.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Helper for AreaChart since I used it above but didn't import it
import { AreaChart, Area } from 'recharts';

export default Analytics;
