
import { ReactNode } from "react";
import { 
  Leaf, 
  Sprout, 
  FlaskConical, 
  Flower,
  Shovel
} from "lucide-react";

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  image: string;
};

export type FeaturedProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  discount?: number;
  images?: string[];
  specifications?: Record<string, string>;
  benefits?: string[];
};

export const categories: ProductCategory[] = [
  {
    id: "lab-grown-plants",
    name: "Lab Grown Plants",
    description: "High-yield, disease-resistant plants grown using advanced lab techniques",
    icon: <Sprout className="h-6 w-6" />,
    image: "https://plus.unsplash.com/premium_photo-1679436184527-74af0573db60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhYiUyMGdyb3duJTIwcGxhbnRzJTIwcGxhbnRpbmclMjBpbiUyMGZlaWxkc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "seeds",
    name: "Seeds",
    description: "Premium quality seeds with high germination rates for various crops",
    icon: <Leaf className="h-6 w-6" />,
    image: "https://media.istockphoto.com/id/1190855168/photo/young-woman-sowing-seeds-in-soil.webp?a=1&b=1&s=612x612&w=0&k=20&c=t_wtHjJmkLfuFa6NPdkbxUD6Rf-lfbYpniHGAORITO0="
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    description: "Organic and chemical fertilizers for enhanced crop growth",
    icon: <FlaskConical className="h-6 w-6" />,
    image: "https://media.istockphoto.com/id/522391502/photo/farmer-spreading-fertilizer-in-the-field-wheat.webp?a=1&b=1&s=612x612&w=0&k=20&c=uAfPuR4JPwdlx-KADzSAVbEYeuPR8SkHXsCiXuyizAo="
  },
  {
    id: "pesticides",
    name: "Pesticides",
    description: "Effective pest control solutions for healthier crops",
    icon: <Flower className="h-6 w-6" />,
    image: "https://media.istockphoto.com/id/652966504/photo/watering-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=e_d5LE1bDvairIeXHvviiWc_2__Ptn2eRS03GqEm8ueM="
  },
  {
    id: "farming-tools",
    name: "Farming Tools",
    description: "Essential hand tools and equipment for efficient farming operations",
    icon: <Shovel className="h-6 w-6" />,
    image: "https://media.istockphoto.com/id/1271469823/photo/gardening-tools-on-a-green-background-top-view-farming.jpg?s=612x612&w=0&k=20&c=UBrbD-SqT3O-jOnSd-wRiU0SdCgKC23ji8HyBb6GVME="
  },
  {
    id: "irrigation",
    name: "Irrigation",
    description: "Advanced irrigation systems for optimal water usage",
    icon: <Leaf className="h-6 w-6" />,
    image: "https://media.istockphoto.com/id/1146633438/photo/irrigation-system-watering-agricultural-field-with-young-plants-and-sprinkler-system.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ig2HJvkkAJ8ijC0N06wwKKdFTQRORFcDZoBcpahyw84="
  }
];

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "featured-1",
    categoryId: "lab-grown-plants",
    name: "High-Yield Rice Seedling",
    description: "Lab-grown rice seedlings with 30% higher yield potential",
    price: 199,
    image: "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
    rating: 4.7,
    discount: 15
  },
  {
    id: "featured-2",
    categoryId: "seeds",
    name: "Organic Tomato Seeds",
    description: "High-quality organic tomato seeds for your garden",
    price: 99,
    image: "https://plus.unsplash.com/premium_photo-1723568420145-4b3f90ef6c02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMFRvbWF0byUyMFNlZWRzfGVufDB8fDB8fHww",
    rating: 4.6,
    discount: 10
  },
  {
    id: "featured-3",
    categoryId: "fertilizers",
    name: "Premium Organic Compost",
    description: "Nutrient-rich organic compost for all your farming needs",
    price: 149,
    image: "https://media.istockphoto.com/id/1198255281/photo/professional-gardener-adds-compost-to-the-soil-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=1KLUuAP1w_kEzQ7aCKSz6WRtC3AW8eSXIHi_5xpHtKc=",
    rating: 4.9
  },
  {
    id: "featured-4",
    categoryId: "farming-tools",
    name: "Premium Garden Tool Set",
    description: "Complete set of essential farming tools for everyday use",
    price: 129,
    image: "https://media.istockphoto.com/id/621356882/photo/gardening-tools-and-flowers-in-pots.jpg?s=612x612&w=0&k=20&c=CR-w4NJNLsQSJoK00tRWCzwfXQ_VPOaSTQecYSs_tCE=",
    rating: 4.8,
    discount: 20
  }
];

// Export product data
export const productsByCategory: Record<string, Product[]> = {
  "lab-grown-plants": [
    {
      id: "lg-plant-1",
      name: "High-Yield Rice Seedling",
      description: "Lab-grown rice seedlings with 30% higher yield potential. These genetically optimized seedlings are designed to maximize output while maintaining resistance to common diseases that affect rice crops.",
      price: 199,
      image: "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
      rating: 4.7,
      stock: 120,
      discount: 15,
      images: [
        "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
        "https://media.istockphoto.com/id/1282569924/photo/rice-field-at-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=JjsJe_lYF-3qC_Z9MFy0FbYaWGJxhHRpH1F8-4F2GGU=",
        "https://media.istockphoto.com/id/1056248814/photo/farmer-planting-rice-seedlings-in-rice-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=oDzDICxikxUgnO6moFpcTaXHwOVR2iBSzqj3hH6-MiE="
      ],
      specifications: {
        "Growth Rate": "30% faster than traditional varieties",
        "Disease Resistance": "High resistance to blast and bacterial blight",
        "Water Requirements": "20% less than traditional varieties",
        "Expected Yield": "8-10 tons per hectare"
      },
      benefits: [
        "Higher yield potential compared to traditional varieties",
        "Reduced need for pesticides due to enhanced disease resistance",
        "Greater tolerance to environmental stress factors",
        "More efficient water usage"
      ]
    },
    {
      id: "lg-plant-2",
      name: "Disease-Resistant Wheat",
      description: "Wheat seedlings engineered to resist common fungal diseases",
      price: 249,
      image: "https://media.istockphoto.com/id/983287672/photo/close-up-on-ripe-wheat-ears-on-reaping-time-in-middle-june.webp?a=1&b=1&s=612x612&w=0&k=20&c=ie2OOz5kDNy75bXzurOf1nu9WlXhHmfD8MQCe2jJ-wk=",
      rating: 4.5,
      stock: 85,
      discount: 10
    },
    {
      id: "lg-plant-3",
      name: "Drought-Tolerant Corn",
      description: "Corn plants designed to thrive in low-water conditions",
      price: 279,
      image: "https://media.istockphoto.com/id/1218144150/photo/plants.webp?a=1&b=1&s=612x612&w=0&k=20&c=e1jdZY90le1ls-4DDdF8jnJ1hiF7p14QIJnE0f6i7xA=",
      rating: 4.8,
      stock: 63
    },
    {
      id: "lg-plant-4",
      name: "Fast-Growing Vegetable Set",
      description: "Collection of tomato, cucumber, and bell pepper lab-grown seedlings",
      price: 349,
      image: "https://plus.unsplash.com/premium_photo-1677756430981-31e8977f572f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFzdCUyMEdyb3dpbmclMjBWZWdldGFibGUlMjBTZXQlMjBsYWIlMjBncm93bnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.6,
      stock: 42
    },
    {
      id: "lg-plant-5",
      name: "Cold-Resistant Spinach",
      description: "Spinach seedlings that thrive in colder climates",
      price: 199,
      image: "https://media.istockphoto.com/id/1419939833/photo/arugula-seedlings-sprouted-from-the-seeds-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=bcSKbNQv382GhyNqF2KuqC6d8Wb6TIRgMtDuwhAtoyk=",
      rating: 4.7,
      stock: 100
    },
    {
      id: "lg-plant-6",
      name: "Salt-Tolerant Rice",
      description: "Rice seedlings engineered to grow in saline soils",
      price: 229,
      image: "https://media.istockphoto.com/id/1036579474/photo/rice-and-sake-cup.webp?a=1&b=1&s=612x612&w=0&k=20&c=qnugmk7hFyjeAMZGw7IMeH5WUdBrBQPQP_BkEA_xg8U=",
      rating: 4.6,
      stock: 75
    },
    {
      id: "lg-plant-7",
      name: "High-Protein Soybean",
      description: "Soybean plants with enhanced protein content for better nutrition",
      price: 259,
      image: "https://media.istockphoto.com/id/1324336237/photo/soy-milk-and-soy-on-the-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=iaUvgAdkoa0cDbMCAz5m3MW0u2-1jW3YBjSnJQkYznk=",
      rating: 4.8,
      stock: 90
    },
    {
      id: "lg-plant-8",
      name: "Pest-Resistant Eggplant",
      description: "Eggplant seedlings designed to resist common pests",
      price: 189,
      image: "https://api.deepai.org/job-view-file/ba82a04e-a346-4086-ad61-efd28c62f4d9/outputs/output.jpg",
      rating: 4.5,
      stock: 110
    },
    {
      id: "lg-plant-9",
      name: "High-Yield Cassava Seedling",
      description: "Lab-grown cassava with 45% higher starch content",
      price: 219,
      image: "https://media.istockphoto.com/id/1325117993/photo/tapioca-tuber-thai-cassava-crop.jpg?s=612x612&w=0&k=20&c=YdzreFUIPHPHVHo0cMLN56NStGiW-SQ7qGT3_tYGCp4=",
      rating: 4.9,
      stock: 65
    },
    {
      id: "lg-plant-10",
      name: "Climate-Adaptive Potato",
      description: "Potato seedlings engineered to adapt to climate fluctuations",
      price: 169,
      image: "https://media.istockphoto.com/id/1318666271/photo/a-pile-of-young-potatoes-close-up-freshly-dug-potatoes-cultivation-of-potatoes.jpg?s=612x612&w=0&k=20&c=8U83vL00_J7OpH2uBN2DGmNAewbpyDtKHxkJz_RL74o=",
      rating: 4.6,
      stock: 88
    }
  ],
  "seeds": [
    {
      id: "seed-1",
      name: "Organic Tomato Seeds",
      description: "High-quality organic tomato seeds for your garden",
      price: 99,
      image: "https://plus.unsplash.com/premium_photo-1723568420145-4b3f90ef6c02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMFRvbWF0byUyMFNlZWRzfGVufDB8fDB8fHww",
      rating: 4.6,
      stock: 200,
      discount: 5
    },
    {
      id: "seed-2",
      name: "Hybrid Corn Seeds",
      description: "Hybrid corn seeds for higher yield and disease resistance",
      price: 149,
      image: "https://media.istockphoto.com/id/1385753483/photo/corn-seeds-on-a-white-background-and-in-hand.webp?a=1&b=1&s=612x612&w=0&k=20&c=STB-c6g5BYmw9wv41Tg1UaT9Gz5ERrgD7JNJA0iCQ0o=",
      rating: 4.7,
      stock: 150
    },
    {
      id: "seed-3",
      name: "Organic Bottleguard Seeds",
      description: "High-quality organic gourd seeds for healthy farming",
      price: 99,
      image: "https://media.istockphoto.com/id/502490988/photo/bottle-gourd-plant-with-young-fruit.webp?a=1&b=1&s=612x612&w=0&k=20&c=MxnSAJYrNkoeKQyieI-dp9UDQDX_oWwZNeT2R-ncpl8=",
      rating: 4.5,
      stock: 200
    },
    {
      id: "seed-4",
      name: "Wheat Seeds - Premium Quality",
      description: "Clean, certified wheat seeds for optimal production",
      price: 129,
      image: "https://media.istockphoto.com/id/1345650890/photo/wheat-and-grain-in-hand-wheat-grain-kernel.jpg?s=612x612&w=0&k=20&c=KpOkbRUbFC5vD2e_X0DZ1KXBmnJzzIPDHnfCAhDB1x0=",
      rating: 4.8,
      stock: 180
    },
    {
      id: "seed-5",
      name: "Premium Carrot Seeds",
      description: "High-germination carrot seeds for abundant harvests",
      price: 79,
      image: "https://media.istockphoto.com/id/1431027073/photo/carrot-seeds-in-hand.webp?a=1&b=1&s=612x612&w=0&k=20&c=YXJ-pnLj-ulMR9KVpCq6eQoAw_GyWQb6pWUrKCbPzVU=",
      rating: 4.7,
      stock: 220
    },
    {
      id: "seed-6",
      name: "Organic Lettuce Seed Mix",
      description: "A blend of premium organic lettuce varieties",
      price: 89,
      image: "https://media.istockphoto.com/id/172875087/photo/lettuce-seedlings.webp?a=1&b=1&s=612x612&w=0&k=20&c=VDoD6YkTLVZzjbwYqd9XoTdhJU8ElgleFPKPd0MUMtk=",
      rating: 4.6,
      stock: 150
    },
    {
      id: "seed-7",
      name: "Organic Cucumber Seeds",
      description: "Fresh organic cucumber seeds with high germination rate",
      price: 85,
      image: "https://media.istockphoto.com/id/537823237/photo/cucumbers-with-leaves.jpg?s=612x612&w=0&k=20&c=Dq8LE9Oj7XPxWBDyuBisNNdWRwgSqa5LffxiQyHZDhM=",
      rating: 4.8,
      stock: 175
    },
    {
      id: "seed-8",
      name: "Premium Rice Seeds",
      description: "High-yield rice seed varieties for optimal production",
      price: 110,
      image: "https://media.istockphoto.com/id/1093307216/photo/pile-of-rice-on-background-of-a-bag-of-rice.jpg?s=612x612&w=0&k=20&c=GPHkB9TQf6JQ0UygCTQDIZWvsZ_nnTaHaN6zzdg_Tmk=",
      rating: 4.9,
      stock: 200,
      discount: 8
    },
    {
      id: "seed-9",
      name: "Organic Pumpkin Seeds",
      description: "Large, disease-resistant pumpkin seeds for commercial farming",
      price: 95,
      image: "https://media.istockphoto.com/id/140348799/photo/pumpkin-seeds.jpg?s=612x612&w=0&k=20&c=RLWqi3klBiexuAM6A4tYdUFoeJbZqFWJXGFUtP8NIx8=",
      rating: 4.6,
      stock: 130
    }
  ],
  "fertilizers": [
    {
      id: "fert-1",
      name: "Premium Organic Compost",
      description: "Nutrient-rich organic compost for all your farming needs",
      price: 149,
      image: "https://media.istockphoto.com/id/1198255281/photo/professional-gardener-adds-compost-to-the-soil-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=1KLUuAP1w_kEzQ7aCKSz6WRtC3AW8eSXIHi_5xpHtKc=",
      rating: 4.9,
      stock: 300
    },
    {
      id: "fert-2",
      name: "NPK Fertilizer Blend",
      description: "Balanced nitrogen, phosphorus, and potassium for optimal growth",
      price: 199,
      image: "https://media.istockphoto.com/id/927499422/photo/organic-fertilizer-in-a-wooden-bowl-on-dark-background-alternative-resource-of-fertilizer-for.webp?a=1&b=1&s=612x612&w=0&k=20&c=XViyaUlbE_AFT1JuhfDo4yWzXuMnYr1et9mZqV97DCA=",
      rating: 4.7,
      stock: 250,
      discount: 10
    },
    {
      id: "fert-3",
      name: "Organic Bone Meal",
      description: "Slow-release fertilizer perfect for root development",
      price: 129,
      image: "https://media.istockphoto.com/id/1414162899/photo/bone-meal-organic-fertilizer-in-packaging-on-wooden-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=LQF4dxjpCjpnM-1EUIv8X-5EHc8C5NGjM8Vl_78R28s=",
      rating: 4.6,
      stock: 175
    },
    {
      id: "fert-4",
      name: "Liquid Seaweed Fertilizer",
      description: "Nutrient-rich seaweed extract for boosting plant health",
      price: 109,
      image: "https://media.istockphoto.com/id/1314115085/photo/organic-liquid-fertilizers.webp?a=1&b=1&s=612x612&w=0&k=20&c=R4rPu9TbJQ8FO05Re3zI0wkyPMeZFTwWCxN7poLkCrQ=",
      rating: 4.8,
      stock: 200
    },
    {
      id: "fert-5",
      name: "Micronutrient Mix",
      description: "Essential micronutrients to prevent deficiencies in crops",
      price: 159,
      image: "https://media.istockphoto.com/id/500927704/photo/chemical-fertilizers-blue-capsules.jpg?s=612x612&w=0&k=20&c=559ah2I1KJNzAlb8L-UOkTMiwwPXO1nWeX_DldJv70Y=",
      rating: 4.7,
      stock: 120
    },
    {
      id: "fert-6",
      name: "Vermicompost Premium",
      description: "Worm-processed organic matter rich in beneficial microbes",
      price: 179,
      image: "https://media.istockphoto.com/id/1334490239/photo/vermicompost-after-processing-in-coconut-shell-selective-focus-stock-photograph.jpg?s=612x612&w=0&k=20&c=L4F5KBjEhMrPxQJMerKGw4h_nZFOZtE9QP73l3TGo5k=",
      rating: 4.9,
      stock: 150,
      discount: 12
    },
    {
      id: "fert-7",
      name: "Calcium Nitrate Fertilizer",
      description: "Fast-acting calcium and nitrogen source for vegetable crops",
      price: 139,
      image: "https://media.istockphoto.com/id/1191225336/photo/calcium-nitrate-ca-no3-2-is-inorganic-compound-it-is-deliquescent-salt-that-consists-of-ionic.jpg?s=612x612&w=0&k=20&c=dwYd5Wj7N1WdOEEFJB2YEvIQRcj6340k4Fvn5bKoXOM=",
      rating: 4.6,
      stock: 180
    }
  ],
  "pesticides": [
    {
      id: "pest-1",
      name: "Organic Pest Control Spray",
      description: "Natural formula to control common plant pests",
      price: 89,
      image: "https://media.istockphoto.com/id/1217779052/photo/farmer-spraying-vegetables-with-chemicals-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=r7Mfptx_suxSOkL5PhVcqBGdCTax1_Qvkr7aHWCeVFc=",
      rating: 4.5,
      stock: 150
    },
    {
      id: "pest-2",
      name: "Neem Oil Concentrate",
      description: "Organic solution for pest and fungal control",
      price: 69,
      image: "https://media.istockphoto.com/id/1398630956/photo/neem-oil-extract-in-bottle-on-wooden-surface-selective-focus-ayurvedic-medicine.webp?a=1&b=1&s=612x612&w=0&k=20&c=4i6gVZdHeWSPwdkcpzLzjsGSp9NByPFflgRSPtJJ4o8=",
      rating: 4.7,
      stock: 200,
      discount: 15
    },
    {
      id: "pest-3",
      name: "Insect Barrier Mesh",
      description: "Physical protection against flying pests",
      price: 129,
      image: "https://media.istockphoto.com/id/1371333320/photo/pigeons-and-other-birds-control-net-installed-in-balcony-celling.webp?a=1&b=1&s=612x612&w=0&k=20&c=yISvzG7xjVeyZEiQuE8H0iWv1Y8PWDbvRF7VotW-z2c=",
      rating: 4.6,
      stock: 80
    },
    {
      id: "pest-4",
      name: "Beneficial Insects Kit",
      description: "Live ladybugs and predatory mites for natural pest control",
      price: 99,
      image: "https://media.istockphoto.com/id/179870973/photo/a-ladybug-ladybird-on-a-green-leaf.jpg?s=612x612&w=0&k=20&c=v5_Fc_5PgA3zbCrBMFQectZQ5HizBnjFuF1Dggk1Yjk=",
      rating: 4.8,
      stock: 50
    },
    {
      id: "pest-5",
      name: "Fungal Disease Treatment",
      description: "Eco-friendly spray for controlling powdery mildew and rusts",
      price: 79,
      image: "https://media.istockphoto.com/id/1356242240/photo/homemade-natural-spray-bottle-and-garden-herbs-on-wooden-table-outdoors-copy-space.jpg?s=612x612&w=0&k=20&c=FvASKTCDLCsQzrGPZzJ1y6N3DYE28a7mLbz_kXmzcGw=",
      rating: 4.5,
      stock: 120,
      discount: 8
    },
    {
      id: "pest-6",
      name: "Soil Pest Control Granules",
      description: "Long-lasting granular formula for controlling soil-dwelling pests",
      price: 119,
      image: "https://media.istockphoto.com/id/510252595/photo/compost-for-the-garden.jpg?s=612x612&w=0&k=20&c=zgpnMB_bk6ZcjZBO8VsqLRAlB6HlLmgaP_aKJw4Idsg=",
      rating: 4.6,
      stock: 90
    }
  ],
  "farming-tools": [
    {
      id: "tool-1",
      name: "Premium Garden Tool Set",
      description: "Complete set of essential farming tools for everyday use",
      price: 129,
      image: "https://media.istockphoto.com/id/621356882/photo/gardening-tools-and-flowers-in-pots.jpg?s=612x612&w=0&k=20&c=CR-w4NJNLsQSJoK00tRWCzwfXQ_VPOaSTQecYSs_tCE=",
      rating: 4.8,
      stock: 75,
      discount: 20
    },
    {
      id: "tool-2",
      name: "Ergonomic Hand Trowel",
      description: "Comfortable grip hand trowel for planting and soil work",
      price: 29,
      image: "https://media.istockphoto.com/id/534204536/photo/gardening-tools.jpg?s=612x612&w=0&k=20&c=JYAv6h2eXMCc5JchZu1qE2e_dCLjeDQ8Db73G7zeWcs=",
      rating: 4.7,
      stock: 150
    },
    {
      id: "tool-3",
      name: "Professional Pruning Shears",
      description: "Sharp, durable pruning shears for precise plant maintenance",
      price: 45,
      image: "https://media.istockphoto.com/id/1193094396/photo/pruning-shears-with-both-handles-open-in-hand.jpg?s=612x612&w=0&k=20&c=0o3qKrhBKLpa82ozk1BSZVx_DbuOjXElTFmQShlH1Ts=",
      rating: 4.9,
      stock: 100
    },
    {
      id: "tool-4",
      name: "Heavy-Duty Garden Hoe",
      description: "Sturdy hoe for weeding and soil preparation",
      price: 39,
      image: "https://media.istockphoto.com/id/1251390223/photo/agriculture-tools-on-wooden-background.jpg?s=612x612&w=0&k=20&c=f27muVZWED4Xoq-_iKYnG8jTJvLUqLL9owB4pwNUuLs=",
      rating: 4.6,
      stock: 90
    },
    {
      id: "tool-5",
      name: "Soil Moisture Meter",
      description: "Accurate tool for measuring soil moisture, pH, and light levels",
      price: 25,
      image: "https://media.istockphoto.com/id/1185099339/photo/soil-testing-kit-with-tubes-and-charts.jpg?s=612x612&w=0&k=20&c=AS5WVTdAdWAAWw4VjMNUhYPUNfpyH58Ulq-4QXJwZuw=",
      rating: 4.5,
      stock: 120
    },
    {
      id: "tool-6",
      name: "Seedling Transplanter",
      description: "Specialized tool for safely transplanting seedlings",
      price: 19,
      image: "https://media.istockphoto.com/id/1133113789/photo/seedling-growing-in-ground-on-bokeh-background-new-life-or-beginning-concept.jpg?s=612x612&w=0&k=20&c=E6k9AIFARbheo3fIC2_G2_hj8Ai2IlYbqBJCjg1XZ7E=",
      rating: 4.4,
      stock: 80
    },
    {
      id: "tool-7",
      name: "Harvest Basket Set",
      description: "Durable woven baskets for harvesting and carrying produce",
      price: 59,
      image: "https://media.istockphoto.com/id/598171350/photo/basket-with-vegetables.jpg?s=612x612&w=0&k=20&c=OmQORcZaFvDb_SKj2QOhNuM00gVYnUFMfFQJ3UnHfZg=",
      rating: 4.7,
      stock: 60,
      discount: 15
    },
    {
      id: "tool-8",
      name: "Garden Kneeling Pad",
      description: "Thick foam pad to protect knees during planting and weeding",
      price: 22,
      image: "https://media.istockphoto.com/id/517965884/photo/gardener-with-hat-is-planting-flowers-in-her-garden.jpg?s=612x612&w=0&k=20&c=HQC_qs10eXp5nA5-mT3PaVkTYtCM9AFFXFvyyC8eSLU=",
      rating: 4.8,
      stock: 100
    }
  ],
  "irrigation": [
    {
      id: "irrig-1",
      name: "Smart Drip Irrigation Kit",
      description: "Water-saving drip irrigation system with smart controls",
      price: 299,
      image: "https://media.istockphoto.com/id/1270064595/photo/watering-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=vzZ6GrpFj8RLNW8wvXEiWQzGDt91m0ASuFeiS-Eee2M=",
      rating: 4.8,
      stock: 50,
      discount: 20
    },
    {
      id: "irrig-2",
      name: "Sprinkler System - Pro",
      description: "Professional-grade sprinkler system for even coverage",
      price: 349,
      image: "https://media.istockphoto.com/id/1249603614/photo/sprinkler-head-watering-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=7XzfBxS68YoGX5AbDZPX7hQQ-gUgg0w9fqwx_QT5jC8=",
      rating: 4.7,
      stock: 35
    },
    {
      id: "irrig-3",
      name: "Smart Moisture Sensors",
      description: "IoT-enabled sensors to optimize watering schedules",
      price: 179,
      image: "https://media.istockphoto.com/id/1137813603/photo/hand-check-the-soil-moisture-with-the-mete.webp?a=1&b=1&s=612x612&w=0&k=20&c=x30Sl4TdjYF2bKtodXXoTisJ67UbTnzODRXR7Km9dWo=",
      rating: 4.9,
      stock: 75
    },
    {
      id: "irrig-4",
      name: "Solar-Powered Water Pump",
      description: "Eco-friendly water pump for irrigation systems",
      price: 249,
      image: "https://media.istockphoto.com/id/95628526/photo/irrigation-ditch.jpg?s=612x612&w=0&k=20&c=PZkxj-8ErOObuidUznMSfmF_afd5pLQb80MHDwO9ka8=",
      rating: 4.6,
      stock: 40
    },
    {
      id: "irrig-5",
      name: "Rainwater Collection System",
      description: "Complete system for collecting and reusing rainwater",
      price: 379,
      image: "https://media.istockphoto.com/id/1256524259/photo/rain-barrel-and-garden-watering-can.jpg?s=612x612&w=0&k=20&c=MhzlD5rcoQRKBn8GJOsQ403uHQcIr3i4Myyls0EHvDQ=",
      rating: 4.8,
      stock: 25,
      discount: 10
    }
  ]
};
