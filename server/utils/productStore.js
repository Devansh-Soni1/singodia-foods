import fs from 'fs';
import path from 'path';
import { sampleProducts } from './seedData.js';

const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const getLocalProducts = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const initial = sampleProducts.map((p, idx) => ({
        _id: p._id ? p._id.toString() : `prod-sample-${idx + 1}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      fs.writeFileSync(dataFilePath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : sampleProducts;
  } catch (err) {
    console.error('Error in getLocalProducts:', err.message);
    return sampleProducts;
  }
};

export const saveLocalProducts = (products) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving local products:', err.message);
    return false;
  }
};

