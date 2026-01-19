import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
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
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [paymentData, setPaymentData] = useState<any[]>([]);
    const [stockData, setStockData] = useState<any>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('mansara-token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch Dashboard Stats (for totals)
            const statsRes = await axios.get(`${API_URL}/stats`, config);
            const dashboardStats = statsRes.data;

            setStats({
                totalRevenue: dashboardStats.totalRevenue || 0,
                totalOrders: dashboardStats.totalOrders || 0,
                averageOrderValue: dashboardStats.totalOrders > 0 ? Math.round(dashboardStats.totalRevenue / dashboardStats.totalOrders) : 0,
                totalCustomers: dashboardStats.totalCustomers || 0
            });

            // Fetch Sales Data
            // Backend expects 'period' query param like '30days'
            const salesRes = await axios.get(`${API_URL}/stats/sales?period=${timeRange}days`, config);
            setSalesData(salesRes.data || []);

            // Fetch Top Products
            const productsRes = await axios.get(`${API_URL}/stats/products?limit=5`, config);
            setTopProducts(productsRes.data || []);

            // Fetch Top Customers
            const customersRes = await axios.get(`${API_URL}/stats/customers?limit=5`, config);
            setTopCustomers(customersRes.data || []);

            // Fetch Category Sales
            const categoryRes = await axios.get(`${API_URL}/stats/categories`, config);
            setCategoryData(categoryRes.data || []);

            // Fetch Payment Methods
            const paymentRes = await axios.get(`${API_URL}/stats/payment-methods`, config);
            setPaymentData(paymentRes.data || []);

            // Fetch Stock Health
            const stockRes = await axios.get(`${API_URL}/stats/stock-health`, config);
            setStockData(stockRes.data || { inStock: 0, lowStock: 0, outOfStock: 0 });

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

                    {/* Advanced Analytics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category Sales */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="revenue"
                                                nameKey="_id"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={paymentData}
                                                dataKey="count"
                                                nameKey="_id"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {paymentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => [value, 'Orders']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stock Health */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock Health</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[
                                                { name: 'In Stock', value: stockData?.inStock || 0, fill: '#22c55e' },
                                                { name: 'Low Stock', value: stockData?.lowStock || 0, fill: '#eab308' },
                                                { name: 'Out of Stock', value: stockData?.outOfStock || 0, fill: '#ef4444' }
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {
                                                    [
                                                        { name: 'In Stock', value: stockData?.inStock || 0, fill: '#22c55e' },
                                                        { name: 'Low Stock', value: stockData?.lowStock || 0, fill: '#eab308' },
                                                        { name: 'Out of Stock', value: stockData?.outOfStock || 0, fill: '#ef4444' }
                                                    ].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};



export default Analytics;
