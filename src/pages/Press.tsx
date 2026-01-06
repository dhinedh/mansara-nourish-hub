import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import { fetchPressReleases } from '@/lib/api';
import { Calendar, ArrowRight, Loader2, FileText, Download } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

interface PressRelease {
    _id: string;
    title: string;
    excerpt: string;
    image: string;
    slug?: string;
    createdAt: string;
    publishDate: string;
    mediaKitUrl?: string;
}

const Press = () => {
    const { getContent } = useContent();
    const [releases, setReleases] = useState<PressRelease[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadReleases = async () => {
            try {
                const data = await fetchPressReleases();
                setReleases(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load press releases:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadReleases();
    }, []);

    return (
        <Layout>
            <PageHero pageKey="press">
                <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/30">
                    {getContent('press', 'tagline', 'Newsroom & Updates')}
                </span>
            </PageHero>

            <section className="py-20 bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : releases.length > 0 ? (
                        <div className="grid lg:grid-cols-2 gap-12">
                            {releases.map((release, index) => (
                                <article
                                    key={release._id}
                                    className="flex flex-col sm:flex-row gap-6 group animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Image */}
                                    <div className="w-full sm:w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                                        {release.image ? (
                                            <img
                                                src={release.image}
                                                alt={release.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                                                <FileText className="w-8 h-8 opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex items-center text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {new Date(release.publishDate || release.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>

                                        <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                                            <Link to={`/press/${release.slug || release._id}`}>
                                                {release.title}
                                            </Link>
                                        </h2>

                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                                            {release.excerpt}
                                        </p>

                                        <div className="flex items-center gap-4 mt-auto">
                                            <Link
                                                to={`/press/${release.slug || release._id}`}
                                                className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center group/link"
                                            >
                                                Read Release
                                                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
                            <h3 className="text-xl font-medium text-muted-foreground">No press releases found.</h3>
                        </div>
                    )}
                </div>
            </section>

            {/* Media Kit CTA (Static for now) */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold font-heading mb-4">Media Enquiries</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        For press enquiries, media assets, or interview requests, please contact our media relations team.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="mailto:press@mansarafoods.com" className="inline-flex items-center justify-center rounded-full bg-background border border-border px-8 py-3 text-sm font-medium hover:bg-secondary transition-colors">
                            Contact Press Team
                        </a>
                        {/* Optional Media Kit Download */}
                        {/* <button className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                      <Download className="w-4 h-4 mr-2" />
                      Download Media Kit
                  </button> */}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Press;
