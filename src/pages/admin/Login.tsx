import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logo from '@/assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo Login Logic
      if (email === "admin@mansarafoods.com" && password === "admin123") {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Set a mock admin session 
        localStorage.setItem('mansara-admin-session', 'true');

        toast.success("Login successful! (Demo Mode)");
        window.location.href = "/admin/dashboard"; // Force reload/redirect to ensure state pick up if any
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required");
      }

      // Store auth data
      localStorage.setItem('mansara-token', data.token);
      localStorage.setItem('mansara-user', JSON.stringify(data));
      localStorage.setItem('mansara-admin-session', 'true'); // Keep legacy flag for compatibility

      toast.success("Login successful!");
      window.location.href = "/admin/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <img src={logo} alt="Mansara Foods" className="h-12 w-auto mx-auto mb-4" />
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
          <CardDescription>MANSARA Foods Management</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-sm mb-6">
            <p className="font-bold">Demo Login:</p>
            <p>Email: admin@mansarafoods.com</p>
            <p>Password: admin123</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="admin@mansarafoods.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div >
  );
};

export default AdminLogin;
