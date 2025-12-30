import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, User as UserIcon } from 'lucide-react';
import { getAllUsers } from '@/lib/api';
import { toast } from 'sonner';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate?: string;
  createdAt?: string;
  status: string;
  totalOrders: number;
  totalSpent: number;
}

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('mansara-token');
        if (!token) return;
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
        toast.error('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer base and view their activity history.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">Loading customers...</td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {user._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span>{user.email}</span>
                          <span className="text-xs text-muted-foreground">{user.phone || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt || user.joinDate || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {user.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₹{(user.totalSpent || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/customers/${user._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          History
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <UserIcon className="h-8 w-8 opacity-20" />
                        <p>No customers found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t bg-gray-50 text-xs text-muted-foreground text-center">
            Showing {filteredUsers.length} of {users.length} customers
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
