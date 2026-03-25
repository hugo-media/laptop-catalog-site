import mysql from 'mysql2/promise';

const laptops = [
  {
    name: "Alienware 18 Area-51 (2025)",
    processor: "Intel Core Ultra 9 275HX",
    graphicsCard: "NVIDIA GeForce RTX 5070",
    ram: "32 GB RAM",
    storage: "1 TB SSD",
    display: "18\" large gaming",
    operatingSystem: "Windows 11 Pro",
    condition: "New",
    warranty: "2 years",
    price: 11500
  },
  {
    name: "Dell Precision 7680 (2025)",
    processor: "Intel Core i9 vPro (up to 24 cores)",
    graphicsCard: "Professional graphics card 6 GB",
    ram: "64 GB DDR5 RAM",
    storage: "1 TB fast NVMe SSD",
    display: "16\" high-resolution touchscreen",
    operatingSystem: "Windows 11 Pro",
    condition: "New, in box",
    warranty: "Official from manufacturer",
    price: 7900
  },
  {
    name: "Lenovo ThinkPad T14 Gen 6 (2025)",
    processor: "Intel Core Ultra",
    graphicsCard: "Intel Graphics",
    ram: "32 GB DDR5 RAM (5600 MHz)",
    storage: "512 GB SSD NVMe",
    display: "14\" IPS 1920×1200",
    operatingSystem: "Windows 11 Pro",
    condition: "New, in box",
    warranty: "Official from manufacturer",
    price: 4100
  },
  {
    name: "Dell Pro 14 Plus (Transformer)",
    processor: "Intel Core Ultra 5 Vpro",
    graphicsCard: "-",
    ram: "32 GB RAM",
    storage: "512 GB SSD NVMe",
    display: "14\" 1920×1200 touchscreen",
    operatingSystem: "Windows 11",
    condition: "New",
    warranty: "Official",
    price: 3900
  },
  {
    name: "HP ZBook Power 16 G11 (2025)",
    processor: "Intel Core Ultra 7 265H",
    graphicsCard: "NVIDIA RTX 1000 8 GB",
    ram: "32 GB RAM",
    storage: "1 TB SSD",
    display: "16\"",
    operatingSystem: "-",
    condition: "NEW (2025)",
    warranty: "3 years official",
    price: 8499
  },
  {
    name: "Dell Pro 14 Plus (Ultrabook)",
    processor: "Intel Core Ultra 5 238V",
    graphicsCard: "-",
    ram: "32 GB RAM",
    storage: "512 GB SSD",
    display: "14\" IPS, high clarity",
    operatingSystem: "-",
    condition: "NEW (2025)",
    warranty: "3 years official",
    price: 4199
  },
  {
    name: "Dell Pro 14 Premium (2025)",
    processor: "Intel Core Ultra 5 236V (AI-ready, vPro)",
    graphicsCard: "Intel Arc",
    ram: "16 GB",
    storage: "512 GB SSD",
    display: "14\" IPS FHD+ (1920×1200), anti-glare",
    operatingSystem: "-",
    condition: "NEW (2025)",
    warranty: "3 years official",
    price: 4299
  },
  {
    name: "Dell Pro Max 18 Plus MB18250",
    processor: "Intel Core Ultra 9 285HX",
    graphicsCard: "24 GB (Multiple GPUs)",
    ram: "32 GB RAM",
    storage: "477 GB SSD",
    display: "18\" (non-touch)",
    operatingSystem: "Windows 11 Pro",
    condition: "New",
    warranty: "Official from manufacturer",
    price: 17999
  }
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'manus_db'
  });

  try {
    for (const laptop of laptops) {
      await connection.execute(
        'INSERT INTO laptops (name, processor, graphicsCard, ram, storage, display, operatingSystem, condition, warranty, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [laptop.name, laptop.processor, laptop.graphicsCard, laptop.ram, laptop.storage, laptop.display, laptop.operatingSystem, laptop.condition, laptop.warranty, laptop.price]
      );
      console.log(`Added: ${laptop.name}`);
    }
    console.log('All laptops added successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seed();
