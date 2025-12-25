import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-brand-blue">TERMS & CONDITIONS</h1>
                <p className="mb-4 text-center text-gray-600">(For MansaraFoods Private Limited)</p>
                <div className="prose prose-slate max-w-none space-y-6">
                    <p>Welcome to MansaraFoods Private Limited (“MansaraFoods”, “we”, “our”, “us”). By accessing or using our website, purchasing our products, or using our services, you agree to the following Terms & Conditions.</p>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Company Information</h2>
                        <p>MansaraFoods Private Limited is an Indian food manufacturing and distribution company operating under applicable Indian laws, including the Companies Act, 2013 and FSSAI regulations.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Acceptance of Terms</h2>
                        <p>By using our website or placing an order, you confirm that:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>You are legally capable of entering into a binding contract</li>
                            <li>You agree to comply with these Terms & Conditions</li>
                            <li>You will use our products only as intended</li>
                        </ul>
                        <p className="mt-2">If you do not agree, please do not use our website or services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Product Information & Usage</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Our products are food products intended for general consumption</li>
                            <li>Products are ready-to-cook unless explicitly stated otherwise</li>
                            <li>Preparation and storage instructions must be followed carefully</li>
                        </ul>
                        <div className="bg-amber-50 p-4 border-l-4 border-amber-500 mt-4 rounded">
                            <h3 className="font-semibold text-amber-800">Health Disclaimer</h3>
                            <p className="mt-2">Our products:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-1">
                                <li>Are not medicines</li>
                                <li>Are not intended to diagnose, treat, cure, or prevent any disease</li>
                                <li>Do not replace medical advice</li>
                            </ul>
                            <p className="mt-2">Consumers with medical conditions, allergies, or special dietary needs should consult a healthcare professional before consumption.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Pricing & Availability</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All prices are listed in INR or local currency (for international orders)</li>
                            <li>Prices may change without prior notice</li>
                            <li>Product availability is subject to stock and operational capacity</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Order Acceptance</h2>
                        <p>We reserve the right to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Accept or reject any order</li>
                            <li>Cancel orders due to stock unavailability, pricing errors, or regulatory restrictions</li>
                        </ul>
                        <p className="mt-2 text-sm text-gray-500">In case of cancellation, refunds will be processed as per our Refund Policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                        <p>All content including Brand name, Logos, Product names, Images, Recipes, and Website content are the exclusive intellectual property of MansaraFoods Private Limited and may not be used without written permission.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>MansaraFoods shall not be liable for indirect or consequential damages</li>
                            <li>Liability shall be limited to the value of the product purchased</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Governing Law & Jurisdiction</h2>
                        <p>These Terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in Tamil Nadu, India.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsAndConditions;
