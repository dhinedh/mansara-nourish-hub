import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-brand-blue">PRIVACY POLICY</h1>

                <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100">
                    <h2 className="text-lg font-semibold mb-2">CONTACT INFORMATION</h2>
                    <p><strong>MansaraFoods Private Limited</strong></p>
                    <p>Email: mansarafoods@gmail.com</p>
                    <p>Phone: +91-883 888 7064</p>
                    <p>Tamil Nadu, India</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-6">
                    <p>MansaraFoods Private Limited values your privacy and is committed to protecting your personal data.</p>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p>We may collect:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Shipping address</li>
                            <li>Payment-related details (processed securely via third-party gateways)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Use of Information</h2>
                        <p>Your information is used to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Process orders</li>
                            <li>Deliver products</li>
                            <li>Communicate updates</li>
                            <li>Improve our services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Data Protection</h2>
                        <p>We implement reasonable security practices to protect your data. However, no system is completely secure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Third-Party Sharing</h2>
                        <p>We may share data with:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Payment gateways</li>
                            <li>Courier partners</li>
                            <li>Legal or regulatory authorities (if required)</li>
                        </ul>
                        <p className="italic mt-2">We do not sell personal data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. International Users</h2>
                        <p>For international customers, your data may be processed in India and governed by Indian data protection laws.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Consent</h2>
                        <p>By using our website, you consent to this Privacy Policy.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
