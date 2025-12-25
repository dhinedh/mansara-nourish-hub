import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const RefundReturnPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-brand-blue">REFUND & RETURN POLICY</h1>
                <p className="text-center mb-8 text-gray-600">Due to the nature of food products, returns are limited.</p>

                <div className="prose prose-slate max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Returns Eligibility</h2>
                        <p>Returns or replacements are accepted only if:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Product is damaged during transit</li>
                            <li>Incorrect product is delivered</li>
                        </ul>
                        <p className="mt-2 text-brand-red font-medium">Requests must be raised within 48 hours of delivery with clear images.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Non-Returnable Items</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Opened food packets</li>
                            <li>Used products</li>
                            <li>Products damaged due to improper storage or handling</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Refund Processing</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Approved refunds will be processed within 7–10 business days</li>
                            <li>Refunds will be made to the original payment method</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. International Orders</h2>
                        <p>Refunds for international orders are subject to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Shipping costs being non-refundable</li>
                            <li>Currency conversion charges (if applicable)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Order Cancellations</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Orders can be cancelled only before dispatch</li>
                            <li>Once shipped, cancellation is not possible</li>
                        </ul>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RefundReturnPolicy;
