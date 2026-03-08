import axios from 'axios';
import { products } from '../data/products';
import { combos } from '../data/products';

// Configuration
const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@mansarafoods.com'; // User needs to provide this or password
const ADMIN_PASSWORD = 'password'; // User needs to provide this

async function syncPrices() {
    try {
        console.log('--- Starting Price Sync ---');

        // 1. Login to get token
        console.log('Authenticating...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        const token = loginRes.data.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        console.log('Successfully authenticated.');

        // 2. Sync Products
        console.log('\nSyncing Products...');
        for (const product of products) {
            const id = product.id || product._id;
            if (!id) continue;

            console.log(`Updating product: ${product.name} (${id})`);

            const updateData = {
                price: product.price,
                offerPrice: product.offerPrice,
                variants: product.variants
            };

            try {
                await axios.put(`${API_URL}/products/${id}`, updateData, config);
                console.log(`  ✓ Updated ${product.name}`);
            } catch (err: any) {
                console.error(`  ✗ Failed to update ${product.name}: ${err.message}`);
            }
        }

        // 3. Sync Combos
        console.log('\nSyncing Combos...');
        for (const combo of combos) {
            const id = combo.id || (combo as any)._id;
            if (!id) continue;

            console.log(`Updating combo: ${combo.name} (${id})`);

            const updateData = {
                originalPrice: combo.originalPrice,
                comboPrice: combo.comboPrice
            };

            try {
                await axios.put(`${API_URL}/combos/${id}`, updateData, config);
                console.log(`  ✓ Updated ${combo.name}`);
            } catch (err: any) {
                console.error(`  ✗ Failed to update ${combo.name}: ${err.message}`);
            }
        }

        console.log('\n--- Price Sync Completed ---');
    } catch (err: any) {
        console.error('Fatal Error:', err.message);
        if (err.response) {
            console.error('Response Data:', err.response.data);
        }
    }
}

// Note: This script is intended to be run in a Node.js environment
// or adapted for a temporary browser console execution if necessary.
// syncPrices();
