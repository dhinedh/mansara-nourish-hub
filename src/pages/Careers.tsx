import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import { fetchCareers } from '@/lib/api';
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';

interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    isActive: boolean;
}

const Careers = () => {
    const { getContent } = useContent();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await fetchCareers();
                // Filter only active jobs for the public page
                const activeJobs = (Array.isArray(data) ? data : []).filter((job: Job) => job.isActive);
                setJobs(activeJobs);
            } catch (error) {
                console.error('Failed to load careers:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    return (
        <Layout>
            <PageHero pageKey="careers">
                <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/30">
                    {getContent('careers', 'tagline', 'Join Our Mission')}
                </span>
            </PageHero>

            {/* Values Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-6xl text-center mb-16">
                    <h2 className="text-3xl font-bold font-heading mb-6">Why Work With Us?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        At Mansara Foods, we are more than just a food company. We are a family dedicated to preserving tradition, promoting health, and delivering joy. Join us in our journey to bring wholesome, authentic food to the world.
                    </p>
                </div>

                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1200px] mx-auto">
                    <h3 className="text-2xl font-bold font-heading mb-8">Open Positions</h3>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid gap-6">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="group bg-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-border shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                                                {job.department}
                                            </span>
                                            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                                                {job.type}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Link to={`/careers/${job._id}`}>
                                            <Button className="w-full md:w-auto rounded-full gap-2 group/btn">
                                                View Details
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium text-muted-foreground">No open positions right now.</h3>
                            <p className="text-sm text-muted-foreground/70 mt-2">But we're always looking for talent! Send your resume to careers@mansarafoods.com</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default Careers;
