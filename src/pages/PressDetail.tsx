import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { fetchPressReleases } from '@/lib/api'; // Using generic fetch for now, assuming slug filtering on client if API doesn't support generic slug fetch
import { Calendar, ArrowLeft, Loader2, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Ideally we should have a fetchPressReleaseBySlug or use the crudFactory's ID/Slug support
import { API_URL } from '@/lib/api';

interface PressRelease {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    images: string[];
    video: string;
    slug?: string;
    publishDate: string;
    createdAt: string;
    mediaKitUrl?: string; // Hypothetical field
}

// Temporary fetch helper until api.ts has dedicated slug fetcher if needed
// But we updated crudFactory so `/press/:id` works with slug
const fetchRelease = async (idOrSlug: string) => {
    const response = await fetch(`${API_URL}/press/${idOrSlug}`);
    if (!response.ok) throw new Error('Failed to fetch press release');
    return response.json();
};

const PressDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [release, setRelease] = useState<PressRelease | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRelease = async () => {
            if (!slug) return;
            try {
                // Use the generic CRUD endpoint which now supports slugs
                const data = await fetchRelease(slug);
                setRelease(data);
            } catch (error) {
                console.error('Failed to load press release:', error);
                toast.error("Could not load the press release");
                navigate('/press');
            } finally {
                setIsLoading(false);
            }
        };
        loadRelease();
    }, [slug, navigate]);

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!release) return null;

    return (
        <Layout>
            <div className="pt-24 pb-12 bg-secondary/20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link
                        to="/press"
                        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Newsroom
                    </Link>

                    <span className="block text-primary font-bold tracking-widest text-xs uppercase mb-4">
                        Press Release
                    </span>

                    <h1 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-6 leading-tight">
                        {release.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(release.publishDate || release.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'long'
                                })}
                            </span>
                        </div>
                        <span className="hidden sm:inline text-border">|</span>
                        <span className="font-medium text-foreground">Mansara Foods Corporate</span>
                    </div>
                </div>
            </div>

            <article className="py-12 bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1000px] mx-auto">

                    {release.image && (
                        <div className="rounded-3xl overflow-hidden shadow-lg mb-12 aspect-[21/9]">
                            <img src={release.image} alt={release.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {release.excerpt && (
                        <p className="text-xl font-serif leading-relaxed text-foreground/80 mb-10">
                            <strong>{release.excerpt}</strong>
                        </p>
                    )}

                    <div
                        className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-slate-600 prose-img:rounded-xl prose-a:text-primary hover:prose-a:text-primary/80"
                        dangerouslySetInnerHTML={{ __html: release.content }}
                    />

                    {/* Media Gallery */}
                    {release.images && release.images.length > 0 && (
                        <div className="mt-12 pt-12 border-t border-border">
                            <h3 className="text-lg font-bold font-heading mb-6">Media Assets</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {release.images.map((img, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <img src={img} alt={`Asset ${idx + 1}`} className="w-full h-32 object-cover" />
                                        <a href={img} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About Boilerplate */}
                    <div className="mt-16 p-8 bg-secondary/30 rounded-2xl border border-border">
                        <h3 className="text-lg font-bold font-heading mb-4">About Mansara Foods</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Mansara Foods is dedicated to bringing authentic, verifying, and premium quality food products to your table. Founded with a vision of purity and taste, we source the finest ingredients to create culinary experiences that nourish and delight.
                        </p>

                        <div className="mt-6 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-4 text-sm">
                            <div>
                                <span className="block font-bold text-foreground">Media Contact:</span>
                                <a href="mailto:press@mansarafoods.com" className="text-primary hover:underline">press@mansarafoods.com</a>
                            </div>
                            <div>
                                <span className="block font-bold text-foreground">Website:</span>
                                <a href="https://mansarafoods.com" className="text-primary hover:underline">www.mansarafoods.com</a>
                            </div>
                        </div>
                    </div>

                </div>
            </article>
        </Layout>
    );
};

export default PressDetail;
