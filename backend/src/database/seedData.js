const mongoose = require('mongoose');
const { Product, ProductCategory } = require('../models/Product');
const WeatherData = require('../models/WeatherData');
const MarketPrice = require('../models/MarketPrice');
const Equipment = require('../models/Equipment');

// Sample product categories
const sampleCategories = [
  {
    name: "Lab Grown Plants",
    description: "High-yield, disease-resistant plants grown using advanced lab techniques",
    icon: "Sprout",
    image: "https://plus.unsplash.com/premium_photo-1679436184527-74af0573db60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhYiUyMGdyb3duJTIwcGxhbnRzJTIwcGxhbnRpbmclMjBpbiUyMGZlaWxkc3xlbnwwfHwwfHx8MA%3D%3D",
    sortOrder: 1
  },
  {
    name: "Seeds",
    description: "Premium quality seeds with high germination rates for various crops",
    icon: "Leaf",
    image: "https://media.istockphoto.com/id/1190855168/photo/young-woman-sowing-seeds-in-soil.webp?a=1&b=1&s=612x612&w=0&k=20&c=t_wtHjJmkLfuFa6NPdkbxUD6Rf-lfbYpniHGAORITO0=",
    sortOrder: 2
  },
  {
    name: "Fertilizers",
    description: "Organic and chemical fertilizers for enhanced crop growth",
    icon: "FlaskConical",
    image: "https://media.istockphoto.com/id/522391502/photo/farmer-spreading-fertilizer-in-the-field-wheat.webp?a=1&b=1&s=612x612&w=0&k=20&c=uAfPuR4JPwdlx-KADzSAVbEYeuPR8SkHXsCiXuyizAo=",
    sortOrder: 3
  },
  {
    name: "Pesticides",
    description: "Effective pest control solutions for healthier crops",
    icon: "Flower",
    image: "https://media.istockphoto.com/id/652966504/photo/watering-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=e_d5LE1bDvairIeXHvviiWc_2__Ptn2eRS03GqEm8ueM=",
    sortOrder: 4
  },
  {
    name: "Farming Tools",
    description: "Essential hand tools and equipment for efficient farming operations",
    icon: "Shovel",
    image: "https://media.istockphoto.com/id/1271469823/photo/gardening-tools-on-a-green-background-top-view-farming.jpg?s=612x612&w=0&k=20&c=UBrbD-SqT3O-jOnSd-wRiU0SdCgKC23ji8HyBb6GVME=",
    sortOrder: 5
  },
  {
    name: "Irrigation",
    description: "Advanced irrigation systems for optimal water usage",
    icon: "Leaf",
    image: "https://media.istockphoto.com/id/1146633438/photo/irrigation-system-watering-agricultural-field-with-young-plants-and-sprinkler-system.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ig2HJvkkAJ8ijC0N06wwKKdFTQRORFcDZoBcpahyw84=",
    sortOrder: 6
  }
];

// Sample weather data for major Indian cities
const sampleWeatherData = [
  {
    location: {
      name: "Delhi",
      coordinates: { latitude: 28.6139, longitude: 77.2090 },
      city: "Delhi",
      state: "Delhi",
      country: "India"
    },
    current: {
      temperature: 28,
      feelsLike: 32,
      humidity: 65,
      pressure: 1013,
      windSpeed: 8,
      windDirection: "NW",
      precipitation: 0,
      visibility: 10,
      uvIndex: 6,
      condition: "sunny",
      cloudCover: 20
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      temperature: { min: 20 + Math.random() * 5, max: 30 + Math.random() * 10 },
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      precipitation: Math.random() * 5,
      humidity: 60 + Math.random() * 30,
      windSpeed: 5 + Math.random() * 10
    })),
    dataSource: "openweather",
    quality: { accuracy: 90, reliability: "high" }
  },
  {
    location: {
      name: "Mumbai",
      coordinates: { latitude: 19.0760, longitude: 72.8777 },
      city: "Mumbai",
      state: "Maharashtra",
      country: "India"
    },
    current: {
      temperature: 32,
      feelsLike: 36,
      humidity: 78,
      pressure: 1010,
      windSpeed: 12,
      windDirection: "SW",
      precipitation: 2,
      visibility: 8,
      uvIndex: 8,
      condition: "cloudy",
      cloudCover: 60
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      temperature: { min: 25 + Math.random() * 3, max: 32 + Math.random() * 5 },
      condition: ['cloudy', 'rainy'][Math.floor(Math.random() * 2)],
      precipitation: Math.random() * 10,
      humidity: 70 + Math.random() * 20,
      windSpeed: 8 + Math.random() * 8
    })),
    dataSource: "weatherapi",
    quality: { accuracy: 85, reliability: "high" }
  }
];

// Sample market prices for common crops
const sampleMarketPrices = [
  {
    crop: "Wheat",
    market: {
      name: "Delhi Mandi",
      location: { city: "Delhi", state: "Delhi", country: "India" },
      type: "wholesale"
    },
    price: { current: 2500, previous: 2450, unit: "per_quintal", currency: "INR" },
    volume: { traded: 1500, available: 5000, unit: "quintal" },
    quality: { grade: "A", description: "Premium quality wheat" },
    season: "rabi",
    dataSource: "government",
    reliability: "high"
  },
  {
    crop: "Rice",
    market: {
      name: "Mumbai APMC",
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      type: "wholesale"
    },
    price: { current: 3200, previous: 3150, unit: "per_quintal", currency: "INR" },
    volume: { traded: 2000, available: 8000, unit: "quintal" },
    quality: { grade: "A", description: "Basmati rice" },
    season: "kharif",
    dataSource: "market_committee",
    reliability: "high"
  },
  {
    crop: "Tomato",
    market: {
      name: "Bangalore Market",
      location: { city: "Bangalore", state: "Karnataka", country: "India" },
      type: "retail"
    },
    price: { current: 25, previous: 22, unit: "per_kg", currency: "INR" },
    volume: { traded: 500, available: 1200, unit: "kg" },
    quality: { grade: "Premium", description: "Fresh tomatoes" },
    season: "year_round",
    dataSource: "trader",
    reliability: "medium"
  },
  {
    crop: "Onion",
    market: {
      name: "Pune Mandi",
      location: { city: "Pune", state: "Maharashtra", country: "India" },
      type: "wholesale"
    },
    price: { current: 20, previous: 18, unit: "per_kg", currency: "INR" },
    volume: { traded: 3000, available: 10000, unit: "kg" },
    quality: { grade: "Standard", description: "Red onions" },
    season: "rabi",
    dataSource: "government",
    reliability: "high"
  }
];

// Sample equipment data
const sampleEquipment = [
  {
    name: "Milking Machine Pro",
    category: "Milking Machines",
    brand: "DeLaval",
    condition: "New",
    capacity: "500L/hr",
    location: "Hyderabad",
    price: 120000,
    description: "High-efficiency milking machine for medium to large dairy farms.",
    images: ["/uploads/sample-milking-machine.jpg"],
    seller: "AgroTech Solutions",
    contactInfo: "info@agrotech.com",
    conditionReport: ""
  },
  {
    name: "Feed Grinder X2",
    category: "Feed Grinders",
    brand: "GEA",
    condition: "Used",
    capacity: "200kg/hr",
    location: "Bangalore",
    price: 45000,
    description: "Durable feed grinder, lightly used, well maintained.",
    images: ["/uploads/sample-feed-grinder.jpg"],
    seller: "FarmEquip Dealer",
    contactInfo: "dealer@farmequip.com",
    conditionReport: "Minor scratches, fully functional."
  },
  {
    name: "Bulk Milk Chiller 1000L",
    category: "Bulk Milk Chillers",
    brand: "Keventer",
    condition: "New",
    capacity: "1000L",
    location: "Vijayawada",
    price: 250000,
    description: "Brand new milk chiller with rapid cooling technology.",
    images: ["/uploads/sample-milk-chiller.jpg"],
    seller: "DairyMart",
    contactInfo: "sales@dairymart.com",
    conditionReport: ""
  },
  // Additional diverse equipment entries
  {
    name: "TMR Wagon 3000",
    category: "TMR Wagons",
    brand: "Vijay",
    condition: "Used",
    capacity: "3 tons",
    location: "Nagpur",
    price: 180000,
    description: "Used TMR wagon, perfect for mixing and distributing feed.",
    images: ["/uploads/sample-tmr-wagon.jpg"],
    seller: "FeedMix Solutions",
    contactInfo: "contact@feedmix.com",
    conditionReport: "Serviced last month, minor dents."
  },
  {
    name: "Pasteurizer Compact",
    category: "Pasteurizers",
    brand: "Local Brand",
    condition: "New",
    capacity: "200L/batch",
    location: "Chennai",
    price: 95000,
    description: "Compact pasteurizer for small-scale dairy operations.",
    images: ["/uploads/sample-pasteurizer.jpg"],
    seller: "Dairy Essentials",
    contactInfo: "essentials@dairy.com",
    conditionReport: ""
  },
  {
    name: "Chaff Cutter Supreme",
    category: "Chaff Cutters",
    brand: "Keventer",
    condition: "Used",
    capacity: "1 ton/hr",
    location: "Patna",
    price: 30000,
    description: "Heavy-duty chaff cutter, ideal for large herds.",
    images: ["/uploads/sample-chaff-cutter.jpg"],
    seller: "GreenFarms",
    contactInfo: "info@greenfarms.in",
    conditionReport: "Blades replaced recently."
  },
  {
    name: "Multi-Utility Farm Equipment",
    category: "Other",
    brand: "Local Brand",
    condition: "New",
    capacity: "N/A",
    location: "Lucknow",
    price: 40000,
    description: "Versatile equipment for various farm tasks.",
    images: ["/uploads/sample-multi-utility.jpg"],
    seller: "Farmers Hub",
    contactInfo: "hub@farmers.com",
    conditionReport: ""
  },
  {
    name: "Bulk Milk Chiller 500L",
    category: "Bulk Milk Chillers",
    brand: "DeLaval",
    condition: "Used",
    capacity: "500L",
    location: "Indore",
    price: 120000,
    description: "Reliable used milk chiller, energy efficient.",
    images: ["/uploads/sample-milk-chiller2.jpg"],
    seller: "Dairy Solutions",
    contactInfo: "solutions@dairy.com",
    conditionReport: "Compressor serviced, minor rust spots."
  },
  {
    name: "Automatic Milking System",
    category: "Milking Machines",
    brand: "GEA",
    condition: "New",
    capacity: "700L/hr",
    location: "Pune",
    price: 200000,
    description: "State-of-the-art automatic milking system for large farms.",
    images: ["/uploads/sample-milking-machine2.jpg"],
    seller: "Agri Innovations",
    contactInfo: "innovations@agri.com",
    conditionReport: ""
  }
];

// Seed database function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await ProductCategory.deleteMany({});
    await Product.deleteMany({});
    await WeatherData.deleteMany({});
    await MarketPrice.deleteMany({});
    await Equipment.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Seed categories
    const categories = await ProductCategory.insertMany(sampleCategories);
    console.log(`✅ Seeded ${categories.length} product categories`);

    // Seed sample products for each category
    const sampleProducts = [];
    for (const category of categories) {
      // Add 3-5 products per category
      const productCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < productCount; i++) {
        sampleProducts.push({
          name: `${category.name} Product ${i + 1}`,
          description: `High-quality ${category.name.toLowerCase()} product for agricultural use. Designed for optimal performance and reliability.`,
          categoryId: category._id,
          price: 100 + Math.random() * 500,
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0,
          images: [category.image],
          rating: 3.5 + Math.random() * 1.5,
          reviewCount: Math.floor(Math.random() * 100),
          stock: 50 + Math.floor(Math.random() * 200),
          isFeatured: Math.random() > 0.8,
          tags: [category.name.toLowerCase(), 'agriculture', 'farming'],
          specifications: new Map([
            ['Brand', 'AgriLift'],
            ['Origin', 'India'],
            ['Warranty', '1 Year']
          ]),
          benefits: [
            'High quality and reliability',
            'Suitable for all farming conditions',
            'Cost-effective solution'
          ]
        });
      }
    }

    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${products.length} products`);

    // Seed weather data
    const weatherData = await WeatherData.insertMany(sampleWeatherData);
    console.log(`✅ Seeded ${weatherData.length} weather records`);

    // Seed market prices
    const marketPrices = await MarketPrice.insertMany(sampleMarketPrices);
    console.log(`✅ Seeded ${marketPrices.length} market price records`);

    // Seed equipment
    const equipment = await Equipment.insertMany(sampleEquipment);
    console.log(`✅ Seeded ${equipment.length} equipment items`);

    console.log('🎉 Database seeding completed successfully!');

    return {
      categories: categories.length,
      products: products.length,
      weatherData: weatherData.length,
      marketPrices: marketPrices.length,
      equipment: equipment.length
    };

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

// Function to check if seeding is needed
const checkSeedingNeeded = async () => {
  try {
    const categoryCount = await ProductCategory.countDocuments();
    const productCount = await Product.countDocuments();

    return categoryCount === 0 || productCount === 0;
  } catch (error) {
    console.error('Error checking seeding status:', error);
    return true; // Assume seeding is needed if check fails
  }
};

module.exports = {
  seedDatabase,
  checkSeedingNeeded
};
