import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useContent, Banner } from "@/context/ContentContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminBanners = () => {
  const { banners, addBanner, deleteBanner } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBanner, setNewBanner] = useState<Omit<Banner, 'id'>>({
    page: 'home',
    title: '',
    subtitle: '',
    image: '',
    link: '',
    active: true
  });

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.image) {
      toast.error("Title and Image URL are required");
      return;
    }
    addBanner(newBanner);
    toast.success("Banner added successfully");
    setIsDialogOpen(false);
    setNewBanner({ page: 'home', title: '', subtitle: '', image: '', link: '', active: true });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id);
      toast.success("Banner deleted");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Banners</h1>
            <p className="text-slate-600 mt-1">Manage promotional banners across pages</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} /> Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogDescription>
                  Create a new promotional banner for a specific page.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="page" className="text-right">Page</Label>
                  <select
                    id="page"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newBanner.page}
                    onChange={(e) => setNewBanner({ ...newBanner, page: e.target.value })}
                  >
                    <option value="home">Home</option>
                    <option value="products">Products</option>
                    <option value="offers">Offers</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                    id="title"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subtitle" className="text-right">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">Image URL</Label>
                  <Input
                    id="image"
                    value={newBanner.image}
                    onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBanner}>Save Banner</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.length === 0 ? (
            <Card className="col-span-full border-dashed bg-slate-50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No banners created yet</p>
                <p className="text-sm">Click "Add Banner" to get started</p>
              </CardContent>
            </Card>
          ) : (
            banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden group">
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image')}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground px-2 py-0.5 rounded mb-2 inline-block">
                      {banner.page}
                    </span>
                    <h3 className="font-bold line-clamp-1">{banner.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{banner.subtitle}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
