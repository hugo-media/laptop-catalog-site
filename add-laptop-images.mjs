import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Laptop image URLs - placeholder images for demonstration
const laptopImages = {
  1: 'https://images.unsplash.com/photo-1588872657840-790ff3bde4c0?w=500&h=400&fit=crop', // Alienware
  2: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop', // Dell Precision
  3: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=400&fit=crop', // Dell Pro 14 Plus
  4: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop', // HP ZBook
  5: 'https://images.unsplash.com/photo-1588872657840-790ff3bde4c0?w=500&h=400&fit=crop', // Dell Pro 14 Plus Ult
  6: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop', // Dell Pro 14 Premium
  7: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=400&fit=crop', // Dell Pro Max 18
  8: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop', // Extra
};

try {
  for (const [id, imageUrl] of Object.entries(laptopImages)) {
    await connection.execute(
      'UPDATE laptops SET imageUrl = ? WHERE id = ?',
      [imageUrl, parseInt(id)]
    );
    console.log(`Updated laptop ${id} with image`);
  }
  console.log('All laptop images updated successfully!');
} catch (error) {
  console.error('Error updating images:', error);
} finally {
  await connection.end();
}
