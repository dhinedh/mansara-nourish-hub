import { User } from './mockData';

export interface Order {
    id: string;
    userId: string;
    date: string;
    total: number;
    status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

export interface AdminUser extends User {
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
    status: 'Active' | 'Inactive' | 'Blocked';
}

export const mockOrders: Order[] = [
    {
        id: 'ORD-1001',
        userId: 'u1',
        date: '2024-03-15',
        total: 1250,
        status: 'Delivered',
        items: [
            { name: 'Traditional Millet Health Mix', quantity: 2, price: 450 },
            { name: 'Pure Cow Ghee', quantity: 1, price: 350 }
        ]
    },
    {
        id: 'ORD-1002',
        userId: 'u1',
        date: '2024-04-02',
        total: 850,
        status: 'Processing',
        items: [
            { name: 'Red Rice Poha', quantity: 2, price: 150 },
            { name: 'Palm Jaggery', quantity: 1, price: 250 },
            { name: 'Cold Pressed Sesame Oil', quantity: 1, price: 300 }
        ]
    },
    {
        id: 'ORD-1003',
        userId: 'u2',
        date: '2024-03-28',
        total: 2100,
        status: 'Delivered',
        items: [
            { name: 'Complete Wellness Combo', quantity: 1, price: 2100 }
        ]
    },
    {
        id: 'ORD-1004',
        userId: 'u3',
        date: '2024-01-10',
        total: 450,
        status: 'Cancelled',
        items: [
            { name: 'Herbal Hair Oil', quantity: 1, price: 450 }
        ]
    }
];

export const mockUsersList: AdminUser[] = [
    {
        id: 'u1',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43210',
        address: '15, Gandhi Nagar, Adyar, Chennai',
        joinDate: '2023-11-15',
        totalOrders: 12,
        totalSpent: 15450,
        status: 'Active'
    },
    {
        id: 'u2',
        name: 'Rahul Verma',
        email: 'rahul.v@example.com',
        phone: '+91 99887 76655',
        address: 'Flat 4B, Apex Towers, Bangalore',
        joinDate: '2024-01-20',
        totalOrders: 3,
        totalSpent: 4200,
        status: 'Active'
    },
    {
        id: 'u3',
        name: 'Anitha Raj',
        email: 'anitha123@example.com',
        phone: '+91 91234 56789',
        address: 'No 7, Temple Street, Madurai',
        joinDate: '2023-12-05',
        totalOrders: 1,
        totalSpent: 450,
        status: 'Inactive'
    },
    {
        id: 'u4',
        name: 'Karthik Krish',
        email: 'karthik.k@example.com',
        phone: '+91 88990 01122',
        address: 'Coimbatore, Tamil Nadu',
        joinDate: '2024-02-14',
        totalOrders: 0,
        totalSpent: 0,
        status: 'Active'
    },
    {
        id: 'u5',
        name: 'Suresh Kumar',
        email: 'suresh.k@example.com',
        phone: '+91 77665 54433',
        address: 'Salem, Tamil Nadu',
        joinDate: '2024-03-01',
        totalOrders: 5,
        totalSpent: 6700,
        status: 'Blocked'
    }
];
