const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'mansara backend', '.env') });

const MONGO_URI = process.env.MONGODB_URI;

async function checkCombo() {
    try {
        await mongoose.connect(MONGO_URI);
        const { Combo } = require('../mansara backend/models/Product');
        const combo = await Combo.findOne({ slug: 'ultimate-wellness-combo-5-mixes' });
        console.log('Combo Data in DB:');
        console.log(JSON.stringify(combo, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkCombo();
