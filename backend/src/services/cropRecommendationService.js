class CropRecommendationService {
  constructor() {
    this.cropDatabase = this.initializeCropDatabase();
  }

  // Initialize crop database with detailed crop information
  initializeCropDatabase() {
    return {
      kharif: [
        {
          name: "Rice",
          description: "Staple food crop grown in flooded fields",
          growingPeriod: "120-150 days",
          waterNeed: "High",
          idealConditions: {
            pH: { min: 5.5, max: 7.0 },
            nitrogen: { min: 120, max: 200 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 150, max: 250 },
            organic_matter: { min: 3, max: 5 },
          },
          marketPrice: { min: 2000, max: 2500, unit: "₹/quintal" },
          yield: { min: 40, max: 60, unit: "quintal/hectare" }
        },
        {
          name: "Cotton",
          description: "Important fiber crop with moderate water needs",
          growingPeriod: "150-180 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 5.8, max: 8.0 },
            nitrogen: { min: 80, max: 150 },
            phosphorus: { min: 15, max: 35 },
            potassium: { min: 120, max: 200 },
            organic_matter: { min: 2, max: 4 },
          },
          marketPrice: { min: 5500, max: 6500, unit: "₹/quintal" },
          yield: { min: 15, max: 25, unit: "quintal/hectare" }
        },
        {
          name: "Maize",
          description: "Versatile grain used for food, feed and industry",
          growingPeriod: "90-120 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 5.5, max: 7.5 },
            nitrogen: { min: 100, max: 180 },
            phosphorus: { min: 18, max: 30 },
            potassium: { min: 130, max: 230 },
            organic_matter: { min: 2.5, max: 5 },
          },
          marketPrice: { min: 1800, max: 2200, unit: "₹/quintal" },
          yield: { min: 50, max: 80, unit: "quintal/hectare" }
        },
        {
          name: "Soybean",
          description: "Protein-rich legume that fixes nitrogen in soil",
          growingPeriod: "100-120 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 6.0, max: 7.0 },
            nitrogen: { min: 60, max: 120 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 150, max: 220 },
            organic_matter: { min: 3, max: 6 },
          },
          marketPrice: { min: 4000, max: 4800, unit: "₹/quintal" },
          yield: { min: 20, max: 35, unit: "quintal/hectare" }
        }
      ],
      rabi: [
        {
          name: "Wheat",
          description: "Essential winter season grain crop",
          growingPeriod: "120-150 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 6.0, max: 8.0 },
            nitrogen: { min: 100, max: 180 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 130, max: 210 },
            organic_matter: { min: 2, max: 5 },
          },
          marketPrice: { min: 2100, max: 2400, unit: "₹/quintal" },
          yield: { min: 35, max: 55, unit: "quintal/hectare" }
        },
        {
          name: "Mustard",
          description: "Oil seed crop suitable for cooler temperatures",
          growingPeriod: "110-130 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 7.5 },
            nitrogen: { min: 70, max: 130 },
            phosphorus: { min: 15, max: 35 },
            potassium: { min: 120, max: 200 },
            organic_matter: { min: 2, max: 4 },
          },
          marketPrice: { min: 5000, max: 6000, unit: "₹/quintal" },
          yield: { min: 12, max: 20, unit: "quintal/hectare" }
        },
        {
          name: "Chickpea",
          description: "Drought-resistant legume with high protein content",
          growingPeriod: "90-120 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 8.0 },
            nitrogen: { min: 50, max: 100 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 110, max: 180 },
            organic_matter: { min: 2, max: 5 },
          },
          marketPrice: { min: 4500, max: 5500, unit: "₹/quintal" },
          yield: { min: 15, max: 25, unit: "quintal/hectare" }
        },
        {
          name: "Barley",
          description: "Hardy cereal crop with multiple uses",
          growingPeriod: "90-110 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 8.5 },
            nitrogen: { min: 80, max: 140 },
            phosphorus: { min: 15, max: 30 },
            potassium: { min: 100, max: 180 },
            organic_matter: { min: 2, max: 4 },
          },
          marketPrice: { min: 1600, max: 2000, unit: "₹/quintal" },
          yield: { min: 25, max: 40, unit: "quintal/hectare" }
        }
      ],
      zaid: [
        {
          name: "Moong Bean",
          description: "Short-duration pulse crop rich in protein",
          growingPeriod: "60-90 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 7.5 },
            nitrogen: { min: 40, max: 80 },
            phosphorus: { min: 15, max: 30 },
            potassium: { min: 100, max: 170 },
            organic_matter: { min: 2, max: 4 },
          },
          marketPrice: { min: 6000, max: 7500, unit: "₹/quintal" },
          yield: { min: 8, max: 15, unit: "quintal/hectare" }
        },
        {
          name: "Watermelon",
          description: "Heat-loving summer fruit crop",
          growingPeriod: "80-110 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 6.0, max: 7.0 },
            nitrogen: { min: 60, max: 120 },
            phosphorus: { min: 25, max: 45 },
            potassium: { min: 150, max: 250 },
            organic_matter: { min: 3, max: 6 },
          },
          marketPrice: { min: 800, max: 1500, unit: "₹/quintal" },
          yield: { min: 200, max: 400, unit: "quintal/hectare" }
        },
        {
          name: "Cucumber",
          description: "Fast-growing summer vegetable",
          growingPeriod: "45-65 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 5.5, max: 7.0 },
            nitrogen: { min: 70, max: 130 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 140, max: 220 },
            organic_matter: { min: 3, max: 6 },
          },
          marketPrice: { min: 1000, max: 2000, unit: "₹/quintal" },
          yield: { min: 150, max: 300, unit: "quintal/hectare" }
        }
      ]
    };
  }

  // Calculate parameter score for crop suitability
  calculateParameterScore(value, min, max) {
    if (value === null || value === undefined) return 0.5; // Neutral score for missing data
    
    if (value < min) {
      return Math.max(0, 0.7 * (value / min));
    } else if (value > max) {
      return Math.max(0, 1 - 0.3 * ((value - max) / max));
    } else {
      // Within ideal range - calculate score with peak in middle
      const mid = (min + max) / 2;
      const distanceFromMid = Math.abs(value - mid);
      const rangeHalf = (max - min) / 2;
      return 1 - 0.1 * (distanceFromMid / rangeHalf);
    }
  }

  // Generate crop recommendations based on soil parameters
  generateRecommendations(soilParameters, season = 'kharif') {
    const seasonCrops = this.cropDatabase[season] || [];
    
    // Extract parameter values
    const getParameterValue = (name) => {
      const param = soilParameters.find(p => 
        p.name.toLowerCase().replace(/\s+/g, '_') === name.toLowerCase()
      );
      return param ? param.value : null;
    };

    const pH = getParameterValue('ph');
    const nitrogen = getParameterValue('nitrogen');
    const phosphorus = getParameterValue('phosphorus');
    const potassium = getParameterValue('potassium');
    const organicMatter = getParameterValue('organic_matter') || getParameterValue('organic matter');

    // Calculate recommendations
    const recommendations = seasonCrops.map(crop => {
      // Calculate individual parameter scores
      const pHScore = this.calculateParameterScore(pH, crop.idealConditions.pH.min, crop.idealConditions.pH.max);
      const nitrogenScore = this.calculateParameterScore(nitrogen, crop.idealConditions.nitrogen.min, crop.idealConditions.nitrogen.max);
      const phosphorusScore = this.calculateParameterScore(phosphorus, crop.idealConditions.phosphorus.min, crop.idealConditions.phosphorus.max);
      const potassiumScore = this.calculateParameterScore(potassium, crop.idealConditions.potassium.min, crop.idealConditions.potassium.max);
      const organicMatterScore = this.calculateParameterScore(organicMatter, crop.idealConditions.organic_matter.min, crop.idealConditions.organic_matter.max);

      // Calculate weighted overall score
      const overallScore = (
        pHScore * 0.25 +
        nitrogenScore * 0.2 +
        phosphorusScore * 0.2 +
        potassiumScore * 0.2 +
        organicMatterScore * 0.15
      ) * 100;

      // Determine suitability level
      let suitability;
      if (overallScore >= 85) suitability = "Excellent";
      else if (overallScore >= 70) suitability = "Good";
      else if (overallScore >= 50) suitability = "Fair";
      else suitability = "Poor";

      // Calculate potential profit
      const avgYield = (crop.yield.min + crop.yield.max) / 2;
      const avgPrice = (crop.marketPrice.min + crop.marketPrice.max) / 2;
      const potentialRevenue = avgYield * avgPrice;

      return {
        name: crop.name,
        description: crop.description,
        growingPeriod: crop.growingPeriod,
        waterNeed: crop.waterNeed,
        suitability,
        score: parseFloat(overallScore.toFixed(1)),
        marketPrice: crop.marketPrice,
        expectedYield: crop.yield,
        potentialRevenue: Math.round(potentialRevenue),
        season,
        parameterScores: {
          pH: parseFloat((pHScore * 100).toFixed(1)),
          nitrogen: parseFloat((nitrogenScore * 100).toFixed(1)),
          phosphorus: parseFloat((phosphorusScore * 100).toFixed(1)),
          potassium: parseFloat((potassiumScore * 100).toFixed(1)),
          organicMatter: parseFloat((organicMatterScore * 100).toFixed(1))
        }
      };
    });

    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);

    return recommendations;
  }

  // Get all available crops for a season
  getCropsBySeason(season) {
    return this.cropDatabase[season] || [];
  }

  // Get all available seasons
  getAvailableSeasons() {
    return Object.keys(this.cropDatabase);
  }
}

module.exports = new CropRecommendationService();
