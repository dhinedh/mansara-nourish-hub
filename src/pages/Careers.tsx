import React, { useEffect, useState } from 'react';
import { fetchCareers } from '@/lib/api';
import { MapPin, Briefcase, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    isActive: boolean;
}

const Careers = () => {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await fetchCareers();
                setJobs(data.filter((j: Career) => j.isActive));
            } catch (error) {
                console.error("Failed to load careers");
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#131A4E] sm:text-5xl">
                        Join Our Team
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Build the future of healthy food with Mansara Foods.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading openings...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-medium text-gray-900">No open positions</h3>
                        <p className="mt-2 text-gray-500">We don't have any openings right now. Check back later!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.department}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Button className="bg-[#131A4E] hover:bg-[#131A4E]/90 gap-2" asChild>
                                            <a href={`mailto:careers@mansarafoods.com?subject=Application for ${job.title}`}>
                                                Apply Now <Send className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t">
                                    <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Careers;
