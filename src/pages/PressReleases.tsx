import React, { useEffect, useState } from 'react';
import { fetchPressReleases } from '@/lib/api';
import { Calendar, ExternalLink } from 'lucide-react';

interface PressRelease {
    _id: string;
    title: string;
    summary: string;
    externalLink: string;
    date: string;
    isPublished: boolean;
}

const PressReleases = () => {
    const [items, setItems] = useState<PressRelease[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await fetchPressReleases();
                setItems(data.filter((p: PressRelease) => p.isPublished));
            } catch (error) {
                console.error("Failed to load press releases");
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#131A4E] sm:text-5xl">
                        Press Releases
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Latest news and announcements about Mansara Foods.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading news...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-medium text-gray-900">No press releases yet</h3>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {items.map((item) => (
                            <div key={item._id} className="bg-white border-l-4 border-brand-orange p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <Calendar className="mr-1.5 h-4 w-4" />
                                    {new Date(item.date).toLocaleDateString()}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-brand-blue transition-colors">
                                    {item.externalLink ? (
                                        <a href={item.externalLink} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                            {item.title}
                                            <ExternalLink className="h-5 w-5 opacity-50" />
                                        </a>
                                    ) : (
                                        item.title
                                    )}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.summary}
                                </p>
                                {item.externalLink && (
                                    <div className="mt-4">
                                        <a href={item.externalLink} target="_blank" rel="noreferrer" className="text-brand-orange font-medium hover:underline inline-flex items-center">
                                            Read Full Article
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PressReleases;
