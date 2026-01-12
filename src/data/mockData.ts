
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  avatar?: string;
  role?: 'admin' | 'user';
  isVerified?: boolean;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  line1?: string;
  line2?: string;
  landmark?: string;
  street: string; // Keeping for backward compatibility
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  paymentStatus: 'Paid' | 'Failed' | 'Pending';
  orderStatus: 'Ordered' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress: Address;
  paymentMethod: string;
  trackingSteps: {
    status: 'Ordered' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
    date: string;
    completed: boolean;
  }[];
}

export const mockUser: User = {
  id: 'usr_12345',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const mockAddresses: Address[] = [
  {
    id: 'addr_1',
    type: 'Home',
    street: '123, Green Park Residency, Main Load',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560001',
    isDefault: true,
  },
  {
    id: 'addr_2',
    type: 'Work',
    street: 'Tech Hub, Floor 4, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560038',
    isDefault: false,
  },
];

export const mockOrders: Order[] = [
  {
    id: '#ORD12345',
    date: '2025-12-15',
    total: 1250,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    paymentMethod: 'UPI',
    deliveryAddress: mockAddresses[0],
    items: [
      { name: 'Multigrain Moth', quantity: 1, price: 450 },
      { name: 'Ragi Flakes', quantity: 2, price: 400 },
    ],
    trackingSteps: [
      { status: 'Ordered', date: 'Dec 15, 10:30 AM', completed: true },
      { status: 'Processing', date: 'Dec 15, 02:00 PM', completed: true },
      { status: 'Shipped', date: '', completed: false },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: '#ORD12344',
    date: '2025-12-10',
    total: 890,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    paymentMethod: 'Credit Card',
    deliveryAddress: mockAddresses[0],
    items: [
      { name: 'Healthy Combo Pack', quantity: 1, price: 890 },
    ],
    trackingSteps: [
      { status: 'Ordered', date: 'Dec 10, 09:00 AM', completed: true },
      { status: 'Processing', date: 'Dec 10, 11:30 AM', completed: true },
      { status: 'Shipped', date: 'Dec 11, 05:00 PM', completed: true },
      { status: 'Out for Delivery', date: 'Dec 12, 08:30 AM', completed: true },
      { status: 'Delivered', date: 'Dec 12, 01:15 PM', completed: true },
    ],
  },
  {
    id: '#ORD12300',
    date: '2025-11-28',
    total: 450,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    paymentMethod: 'UPI',
    deliveryAddress: mockAddresses[0],
    items: [
      { name: 'Millet Cookies', quantity: 2, price: 225 },
    ],

    trackingSteps: [
      { status: 'Ordered', date: 'Nov 28, 08:30 PM', completed: true },
      { status: 'Processing', date: '', completed: false },
      { status: 'Shipped', date: '', completed: false },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ]
  }
];
