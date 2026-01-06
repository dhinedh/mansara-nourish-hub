import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { fetchCareerById } from '@/lib/api';
import { ArrowLeft, Loader2, MapPin, Clock, Briefcase, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    isActive: boolean;
    createdAt: string;
}

const CareerDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJob = async () => {
            if (!id) return;
            try {
                const data = await fetchCareerById(id);
                setJob(data);
            } catch (error) {
                console.error('Failed to load job details:', error);
                toast.error("Could not load job details");
                navigate('/careers');
            } finally {
                setIsLoading(false);
            }
        };
        loadJob();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!job) return null;

    const handleApply = () => {
        const subject = encodeURIComponent(`Application for ${job.title} - ${job.department}`);
        const body = encodeURIComponent(`Dear Hiring Team,\n\nI am writing to express my interest in the ${job.title} position at Mansara Foods...\n\n[Please attach your Resume/CV here]`);
        window.location.href = `mailto:careers@mansarafoods.com?subject=${subject}&body=${body}`;
    };

    return (
        <Layout>
            <div className="pt-32 pb-16 bg-gradient-to-br from-secondary/30 to-background border-b border-border">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link
                        to="/careers"
                        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Careers
                    </Link>

                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                        {job.department}
                    </span>

                    <h1 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-6 leading-tight">
                        {job.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-border/50">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-border/50">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-border/50">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span>On-site / Hybrid</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-[1fr_300px] gap-12">

                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        <h3 className="text-foreground font-heading">About the Role</h3>
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {job.description}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card shadow-sm">
                            <h4 className="font-bold text-lg mb-4 text-foreground">Ready to Apply?</h4>
                            <p className="text-sm text-muted-foreground mb-6">
                                Send us your resume and tell us why you'd be a great fit for this role.
                            </p>
                            <Button onClick={handleApply} className="w-full rounded-full gap-2 py-6 text-base">
                                <Mail className="w-5 h-5" />
                                Apply Now
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                or email us at <a href="mailto:careers@mansarafoods.com" className="text-primary hover:underline">careers@mansarafoods.com</a>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default CareerDetail;
