import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '@/lib/api';
import { Calendar, User } from 'lucide-react';

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    isPublished: boolean;
    createdAt: string;
    slug: string;
}

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchBlogPosts();
                // Filter for published posts only
                setPosts(data.filter((p: BlogPost) => p.isPublished));
            } catch (error) {
                console.error("Failed to load blog posts");
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#131A4E] sm:text-5xl">
                        Our Blog
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Insights, nutrition tips, and stories from Mansara Foods.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading articles...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-medium text-gray-900">No articles yet</h3>
                        <p className="mt-2 text-gray-500">Check back soon for updates!</p>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
                        {posts.map((post) => (
                            <article key={post._id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-48 w-full object-cover"
                                        src={post.image || "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80"}
                                        alt={post.title}
                                    />
                                </div>
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <div className="block mt-2">
                                            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                                            <p className="mt-3 text-base text-gray-500 line-clamp-3">{post.excerpt}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center text-sm text-gray-500 gap-4">
                                        <div className="flex items-center">
                                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-brand-orange" />
                                            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {/* Optional: Add Author if available */}
                                        <div className="flex items-center">
                                            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-brand-orange" />
                                            <p>Admin</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
