import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import { fetchBlogPosts } from '@/lib/api';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    image: string;
    slug?: string;
    createdAt: string;
    author: string;
}

const Blog = () => {
    const { getContent } = useContent();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchBlogPosts();
                // Check if data is array (backend might return list directly)
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load blog posts:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, []);

    return (
        <Layout>
            <PageHero pageKey="blog">
                <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/30">
                    {getContent('blog', 'tagline', 'Insights & Stories')}
                </span>
            </PageHero>

            <section className="py-20 bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <article
                                    key={post._id}
                                    className="group bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Link to={`/blog/${post.slug || post._id}`} className="block relative overflow-hidden aspect-[16/10]">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                <span className="text-muted-foreground font-medium">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>

                                    <div className="p-8 flex flex-col flex-grow relative">
                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4 text-primary" />
                                                {post.author || 'Mansara Team'}
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold font-heading mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                            <Link to={`/blog/${post.slug || post._id}`}>
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <Link
                                            to={`/blog/${post.slug || post._id}`}
                                            className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider group/link"
                                        >
                                            Read Article
                                            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
                            <h3 className="text-xl font-medium text-muted-foreground">No updates available at the moment.</h3>
                            <p className="text-sm text-muted-foreground/70 mt-2">Check back soon for our latest stories!</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default Blog;
