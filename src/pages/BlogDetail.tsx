import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { fetchBlogPostById } from '@/lib/api';
import { Calendar, User, ArrowLeft, Loader2, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

import { blogPosts as fallbackBlogPosts } from '@/data/blogPosts';

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string;
    featuredImage?: string;
    images?: string[];
    video?: string;
    slug?: string;
    createdAt: string;
    author: string;
    relatedProducts?: { name: string; slug: string; image: string; price: number }[];
}

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    
    const fallbackMatch = fallbackBlogPosts.find(p => p.slug === slug);
    const [post, setPost] = useState<BlogPost | null>(fallbackMatch as any || null);
    const [isLoading, setIsLoading] = useState(!fallbackMatch);

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) return;
            try {
                const data = await fetchBlogPostById(slug);
                if (data && data.title) {
                    setPost(data);
                }
            } catch (error) {
                console.log('[Blog] API load notice - relying on static article fallback');
                if (!fallbackMatch) {
                    toast.error("Could not load the article");
                    navigate('/blog');
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadPost();
    }, [slug, navigate]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post?.title,
                    text: post?.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                // Share cancelled or failed
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!post) return null;

    return (
        <Layout>
            <SEO 
                title={`${post.title} | Mansara Foods Blog`}
                description={post.excerpt || (post.content ? post.content.replace(/<[^>]*>?/gm, '').slice(0, 160) : `Read ${post.title} on Mansara Foods Blog`)}
                image={post.image}
                url={`https://www.mansarafoods.com/blog/${post.slug || post._id}`}
                type="article"
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "description": post.excerpt,
                        "image": post.image ? (post.image.startsWith('http') ? post.image : `https://www.mansarafoods.com${post.image}`) : undefined,
                        "datePublished": post.createdAt,
                        "author": {
                            "@type": "Person",
                            "name": post.author || "Mansara Team"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Mansara Foods",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.mansarafoods.com/logo.png"
                            }
                        }
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://www.mansarafoods.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Blog",
                                "item": "https://www.mansarafoods.com/blog"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": post.title,
                                "item": `https://www.mansarafoods.com/blog/${post.slug || post._id}`
                            }
                        ]
                    }
                ]}
            />
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute inset-0 flex items-end">
                    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto pb-16 sm:pb-24">
                        <Link
                            to="/blog"
                            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight max-w-4xl animate-fade-in-up">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{post.author || 'Mansara Team'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{Math.max(1, Math.ceil(post.content.length / 1000))} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="py-16 sm:py-24 bg-background relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1000px] mx-auto">

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl md:text-2xl font-serif leading-relaxed text-muted-foreground mb-12 border-l-4 border-primary pl-6 italic">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Social Share */}
                    <div className="flex justify-end mb-8">
                        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 rounded-full">
                            <Share2 className="w-4 h-4" /> Share Article
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div
                        className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-slate-600 prose-img:rounded-3xl prose-img:shadow-lg prose-a:text-primary hover:prose-a:text-primary/80"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Related Recommended Products */}
                    {post.relatedProducts && post.relatedProducts.length > 0 && (
                        <div className="mt-12 p-6 bg-brand-cream/40 rounded-2xl border border-brand-orange/20">
                            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">Recommended Products Featured in This Article</h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {post.relatedProducts.map((rel, idx) => (
                                    <Link key={idx} to={`/product/${rel.slug}`} className="bg-white p-4 rounded-xl border hover:shadow-md transition-all flex flex-col items-center text-center group">
                                        <img src={rel.image} alt={rel.name} className="w-20 h-20 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                                        <h4 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary">{rel.name}</h4>
                                        <span className="text-xs font-bold text-brand-orange">₹{rel.price}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    {post.images && post.images.length > 0 && (
                        <div className="mt-16 pt-16 border-t border-border">
                            <h3 className="text-2xl font-bold font-heading mb-8">Gallery</h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {post.images.map((img, idx) => (
                                    <div key={idx} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video */}
                    {(post.video || post.image) && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold font-heading mb-6">Video</h3>
                            {post.image && (
                                <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-md">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {post.video && (
                                <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-md bg-black">
                                    <video
                                        src={post.video}
                                        controls
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </article>

            {/* Footer CTA */}
            <section className="py-20 bg-secondary/30 border-t border-border">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold font-heading mb-6">Enjoyed this article?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Stay tuned for more insights, recipes, and stories from the heart of Mansara.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/blog">
                            <Button variant="outline" size="lg" className="rounded-full px-8">Read More Stories</Button>
                        </Link>
                        <Link to="/shop">
                            <Button size="lg" className="rounded-full px-8 btn-shine">Start Shopping</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default BlogDetail;
