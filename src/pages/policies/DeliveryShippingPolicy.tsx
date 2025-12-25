import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const DeliveryShippingPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-brand-blue">DELIVERY & SHIPPING POLICY</h1>
                <p className="text-center mb-8 text-gray-600">(India + International)</p>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Domestic Shipping (India)</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Orders are shipped within 3–7 business days</li>
                            <li>Delivery timelines may vary based on location</li>
                            <li>Courier delays are beyond our direct control</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. International Shipping</h2>
                        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
                            <h3 className="font-semibold text-amber-800 mb-2">EXPORT & INTERNATIONAL COMPLIANCE CLAUSE</h3>
                            <p className="text-sm mb-3"><strong>(Very Important – Legal Protection)</strong></p>
                            <p>International customers acknowledge that:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                <li>Food import regulations differ by country</li>
                                <li>MansaraFoods complies with Indian export regulations</li>
                                <li>Final responsibility for customs clearance lies with the customer</li>
                            </ul>
                            <p className="mt-4 text-sm font-semibold">We do not guarantee acceptance by foreign authorities.</p>
                        </div>

                        <p className="font-medium mb-2">We currently plan to serve:</p>
                        <ul className="list-disc pl-5 space-y-1 mb-4">
                            <li>Canada</li>
                            <li>Sri Lanka</li>
                            <li>Malaysia</li>
                            <li>Singapore</li>
                            <li>Maldives</li>
                        </ul>

                        <h3 className="font-semibold mb-2">International Shipping Terms</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Shipping timelines vary by destination</li>
                            <li>Customers are responsible for:
                                <ul className="list-circle pl-5 mt-1">
                                    <li>Customs duties</li>
                                    <li>Import taxes</li>
                                    <li>Local regulatory clearances</li>
                                </ul>
                            </li>
                        </ul>
                        <p className="mt-3 text-red-600 font-medium">MansaraFoods is not responsible for customs delays or rejections.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Address Accuracy</h2>
                        <p>Customers must ensure correct shipping details. MansaraFoods is not liable for failed deliveries due to incorrect information.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Shipment Tracking</h2>
                        <p>Tracking details will be shared once the order is dispatched (where available).</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DeliveryShippingPolicy;
