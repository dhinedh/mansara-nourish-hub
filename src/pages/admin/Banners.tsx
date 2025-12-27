import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useHeroContent, HeroSlide } from "@/hooks/useHeroContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Image as ImageIcon, Settings, Clock, LayoutTemplate, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useContent, Banner } from "@/context/ContentContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ImageUpload Component with Drag & Drop


const AdminHeroSection = () => {
  const { heroConfig, addHomeSlide, deleteHomeSlide, updateHomeSettings, updateHomeSlideById } = useHeroContent();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rotationTime, setRotationTime] = useState(heroConfig.homeSettings?.interval ? heroConfig.homeSettings.interval / 1000 : 5);
  const [newSlide, setNewSlide] = useState<HeroSlide>({
    id: '',
    image: '',
    title: '',
    subtitle: '',
    alignment: 'center',
    ctaText: '',
    ctaLink: ''
  });

  const handleSaveSlide = () => {
    if (!newSlide.image || !newSlide.title) {
      toast.error("Image and Title are required");
      return;
    }

    if (editingId) {
      updateHomeSlideById(editingId, {
        ...newSlide,
        id: editingId,
        alignment: newSlide.alignment || 'center'
      });
      toast.success("Slide updated successfully");
    } else {
      addHomeSlide({
        ...newSlide,
        id: crypto.randomUUID(),
        alignment: newSlide.alignment || 'center'
      });
      toast.success("Slide added successfully");
    }

    setIsAddOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewSlide({
      id: '',
      image: '',
      title: '',
      subtitle: '',
      alignment: 'center',
      ctaText: '',
      ctaLink: ''
    });
  };

  const handleEditClick = (slide: HeroSlide) => {
    setNewSlide({
      ...slide,
      alignment: slide.alignment || 'center',
      ctaText: slide.ctaText || '',
      ctaLink: slide.ctaLink || ''
    });
    setEditingId(slide.id);
    setIsAddOpen(true);
  };

  // Reset form when dialog closes if it wasn't a save
  const handleOpenChange = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) resetForm();
  };

  const handleUpdateSettings = () => {
    updateHomeSettings({ interval: rotationTime * 1000 });
    toast.success("Settings updated");
  };

  return (
    <div className="space-y-6 mb-12 border-b pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6" />
            Home Page Hero Slider
          </h2>
          <p className="text-slate-600 mt-1">Manage the main hero slider on the home page</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white p-1.5 px-3 rounded-md border">
            <Clock size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Rotation (sec):</span>
            <Input
              type="number"
              min="1"
              max="60"
              className="w-16 h-8"
              value={rotationTime}
              onChange={(e) => setRotationTime(Number(e.target.value))}
            />
            <Button size="sm" variant="ghost" onClick={handleUpdateSettings}>Save</Button>
          </div>

          <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}>
                <Plus size={20} /> Add Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Hero Slide' : 'Add New Hero Slide'}</DialogTitle>
                <DialogDescription>{editingId ? 'Update the details of this slide.' : 'Add a new slide to the home page hero slider.'}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <ImageUpload
                    value={newSlide.image}
                    onChange={(url) => setNewSlide({ ...newSlide, image: url })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newSlide.title}
                      onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                      placeholder="e.g. Pure Tradition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Alignment</Label>
                    <Select
                      value={newSlide.alignment || 'center'}
                      onValueChange={(val: any) => setNewSlide({ ...newSlide, alignment: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left Aligned</SelectItem>
                        <SelectItem value="center">Center Aligned</SelectItem>
                        <SelectItem value="right">Right Aligned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={newSlide.subtitle || ''}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    placeholder="e.g. Experience the authentic taste..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CTA Text (Optional)</Label>
                    <Input
                      value={newSlide.ctaText || ''}
                      onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Link (Optional)</Label>
                    <Input
                      value={newSlide.ctaLink || ''}
                      onChange={(e) => setNewSlide({ ...newSlide, ctaLink: e.target.value })}
                      placeholder="e.g. /products"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                <Button onClick={handleSaveSlide}>{editingId ? 'Update Slide' : 'Add Slide'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heroConfig.home.map((slide, index) => (
          <Card key={slide.id} className="overflow-hidden group">
            <div className="relative aspect-video">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={() => handleEditClick(slide)}
                >
                  <Pencil size={14} className="text-slate-700" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    if (confirm('Delete this slide?')) deleteHomeSlide(slide.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className={`absolute inset-0 flex flex-col p-6 text-white bg-black/30 ${slide.alignment === 'left' ? 'items-start text-left' : slide.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'} justify-center`}>
                <h3 className="font-bold text-lg leading-tight mb-1">{slide.title}</h3>
                <p className="text-xs opacity-90 line-clamp-2">{slide.subtitle}</p>
                {slide.ctaText && <span className="mt-2 text-[10px] bg-primary px-2 py-1 rounded">{slide.ctaText}</span>}
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                Slide {index + 1}
              </div>
            </div>
          </Card>
        ))}
        {heroConfig.home.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No slides active</p>
          </div>
        )}
      </div>
    </div>
  );
};

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
      toast.error("Title and Image are required");
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
        <AdminHeroSection />

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
            <DialogContent className="sm:max-w-[500px]">
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
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                    placeholder="Enter banner title"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subtitle" className="text-right">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter banner subtitle"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Image</Label>
                  <div className="col-span-3">
                    <ImageUpload
                      value={newBanner.image}
                      onChange={(url) => setNewBanner({ ...newBanner, image: url })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBanner}>Save Banner</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.length === 0 ? (
            <Card className="col-span-full border-dashed bg-white">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No banners created yet</p>
                <p className="text-sm">Click "Add Banner" to get started</p>
              </CardContent>
            </Card>
          ) : (
            banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden group bg-white">
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
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