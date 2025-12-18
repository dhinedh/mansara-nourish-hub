import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminBanners = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Banners</h1>
            <p className="text-slate-600 mt-1">Manage website banners</p>
          </div>
          <Button className="gap-2">
            <Plus size={20} /> Add Banner
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banner Management</CardTitle>
            <CardDescription>Upload and manage promotional banners</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No banners created yet</p>
            <Button>Create Your First Banner</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
