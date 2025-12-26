import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useHeroContent, HeroConfig } from '@/hooks/useHeroContent';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HeroManagement: React.FC = () => {
    const { heroConfig, updateHomeSlide, updatePageHero } = useHeroContent();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('home');

    const handleHomeUpdate = (index: number, field: string, value: string) => {
        const slide = { ...heroConfig.home[index], [field]: value };
        updateHomeSlide(index, slide);
    };

    const handlePageUpdate = (pageKey: keyof HeroConfig, field: string, value: string) => {
        if (pageKey === 'home') return;
        const current = heroConfig[pageKey];
        updatePageHero(pageKey, { ...current, [field]: value });
    };

    const showSuccess = () => {
        toast({
            title: "Changes Saved",
            description: "Hero section updated successfully.",
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hero Management</h1>
                    <p className="text-muted-foreground">
                        Manage the hero images and text for your website pages.
                    </p>
                </div>

                <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="home">Home Slider</TabsTrigger>
                        <TabsTrigger value="pages">Other Pages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="home" className="space-y-8 mt-6">
                        <div className="grid gap-6">
                            {heroConfig.home.map((slide, index) => (
                                <Card key={slide.id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            Slide {index + 1}
                                            {index === 0 && <span className="text-xs font-normal text-muted-foreground ml-2">(Primary)</span>}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={slide.title}
                                                        onChange={(e) => handleHomeUpdate(index, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Subtitle</Label>
                                                    <Textarea
                                                        value={slide.subtitle}
                                                        onChange={(e) => handleHomeUpdate(index, 'subtitle', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>CTA Text</Label>
                                                        <Input
                                                            value={slide.ctaText || ''}
                                                            onChange={(e) => handleHomeUpdate(index, 'ctaText', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>CTA Link</Label>
                                                        <Input
                                                            value={slide.ctaLink || ''}
                                                            onChange={(e) => handleHomeUpdate(index, 'ctaLink', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Image URL</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={slide.image}
                                                            onChange={(e) => handleHomeUpdate(index, 'image', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Text Alignment</Label>
                                                    <select
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={slide.alignment || 'center'}
                                                        onChange={(e) => handleHomeUpdate(index, 'alignment', e.target.value)}
                                                    >
                                                        <option value="left">Left</option>
                                                        <option value="center">Center</option>
                                                        <option value="right">Right</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Preview */}
                                            <div className="space-y-2">
                                                <Label>Preview</Label>
                                                <div className="relative rounded-lg overflow-hidden aspect-video group bg-muted border">
                                                    <img
                                                        src={slide.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image')}
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                                                        <div className="text-center text-white">
                                                            <p className="font-bold text-lg line-clamp-2">{slide.title}</p>
                                                            <p className="text-sm line-clamp-2 opacity-90">{slide.subtitle}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="pages" className="space-y-8 mt-6">
                        <div className="grid gap-6">
                            {(['newArrivals', 'offers', 'combos', 'products', 'about', 'contact', 'cart'] as const).map((pageKey) => {
                                const page = heroConfig[pageKey];
                                return (
                                    <Card key={pageKey}>
                                        <CardHeader>
                                            <CardTitle className="capitalize">{pageKey.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={page.title}
                                                            onChange={(e) => handlePageUpdate(pageKey, 'title', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Subtitle</Label>
                                                        <Textarea
                                                            value={page.subtitle}
                                                            onChange={(e) => handlePageUpdate(pageKey, 'subtitle', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Image URL</Label>
                                                        <Input
                                                            value={page.image}
                                                            onChange={(e) => handlePageUpdate(pageKey, 'image', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Text Alignment</Label>
                                                        <select
                                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            value={page.alignment || 'center'}
                                                            onChange={(e) => handlePageUpdate(pageKey, 'alignment', e.target.value)}
                                                        >
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Preview</Label>
                                                    <div className="relative rounded-lg overflow-hidden aspect-video bg-muted border">
                                                        <img
                                                            src={page.image}
                                                            alt={page.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image')}
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                                                            <div className="text-center text-white">
                                                                <p className="font-bold text-lg">{page.title}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default HeroManagement;
