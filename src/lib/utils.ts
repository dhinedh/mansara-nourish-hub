import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWeight(weight: string): string {
  if (!weight) return '';
  return weight.replace(/(\d+)\s*(g|grams?)/i, '$1g')
    .replace(/(\d+)\s*(kg|kilograms?)/i, '$1kg')
    .replace(/(\d+)\s*(ml|milliliters?)/i, '$1ml')
    .replace(/(\d+)\s*(l|liters?)/i, '$1L');
}

export function calculateUnitPrice(price: number, weightStr?: string): string | null {
  if (!weightStr) return null;

  const match = weightStr.match(/(\d+(\.\d+)?)\s*(g|kg|ml|l)/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[3].toLowerCase();

  let totalGrams = value;
  let baseUnit = '100g';

  if (unit === 'kg' || unit === 'l') {
    totalGrams = value * 1000;
  }

  if (unit === 'ml' || unit === 'l') {
    baseUnit = '100ml';
  }

  // Calculate price per 100g/ml
  const unitPrice = (price / totalGrams) * 100;

  if (isNaN(unitPrice) || !isFinite(unitPrice)) return null;

  return `₹${unitPrice.toFixed(2)} / ${baseUnit}`;
}

export function optimizeImage(url: string, width: number = 500): string {
  if (!url || !url.includes('cloudinary.com')) return url || "https://placehold.co/800x800/f5f5f5/999999?text=Product";

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + 8);
  let rest = url.substring(uploadIndex + 8);

  // Strip any existing transformation options before the version/public_id (e.g. w_400,q_auto/ or f_auto,q_auto/)
  rest = rest.replace(/^([a-z]{1,2}_[a-zA-Z0-9:-]+,?)+\//, '');

  return `${prefix}f_auto,q_auto,w_${width}/${rest}`;
}

export function getCloudinaryBlurUrl(url: string): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + 8);
  let rest = url.substring(uploadIndex + 8);

  // Strip any existing transformation options
  rest = rest.replace(/^([a-z]{1,2}_[a-zA-Z0-9:-]+,?)+\//, '');

  return `${prefix}f_auto,q_auto,w_30,e_blur:1000/${rest}`;
}

