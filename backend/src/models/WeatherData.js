const mongoose = require('mongoose');

// Weather Forecast Schema
const forecastSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  temperature: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  condition: {
    type: String,
    required: true,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'snowy', 'windy']
  },
  precipitation: {
    type: Number,
    min: 0,
    default: 0
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100
  },
  windSpeed: {
    type: Number,
    min: 0
  },
  windDirection: {
    type: String,
    enum: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  }
}, {
  _id: false
});

// Weather Data Schema
const weatherDataSchema = new mongoose.Schema({
  location: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  current: {
    temperature: {
      type: Number,
      required: true
    },
    feelsLike: Number,
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    pressure: {
      type: Number,
      required: true,
      min: 0
    },
    windSpeed: {
      type: Number,
      required: true,
      min: 0
    },
    windDirection: {
      type: String,
      enum: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    },
    precipitation: {
      type: Number,
      min: 0,
      default: 0
    },
    visibility: {
      type: Number,
      min: 0
    },
    uvIndex: {
      type: Number,
      min: 0,
      max: 11
    },
    condition: {
      type: String,
      required: true,
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'snowy', 'windy']
    },
    cloudCover: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  forecast: [forecastSchema],
  alerts: [{
    type: {
      type: String,
      enum: ['heat_wave', 'cold_wave', 'heavy_rain', 'storm', 'drought', 'flood', 'cyclone']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'extreme']
    },
    title: String,
    description: String,
    startTime: Date,
    endTime: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  dataSource: {
    type: String,
    required: true,
    enum: ['openweather', 'weatherapi', 'accuweather', 'manual', 'sensor']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  quality: {
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: 85
    },
    reliability: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }
}, {
  timestamps: true,
  collection: 'weather_data'
});

// Indexes for better performance
weatherDataSchema.index({ 'location.coordinates': '2dsphere' });
weatherDataSchema.index({ 'location.name': 1, lastUpdated: -1 });
weatherDataSchema.index({ lastUpdated: -1 });
weatherDataSchema.index({ isActive: 1 });
weatherDataSchema.index({ dataSource: 1 });

// Virtual for weather summary
weatherDataSchema.virtual('summary').get(function() {
  const temp = this.current.temperature;
  const condition = this.current.condition;
  const humidity = this.current.humidity;
  
  return {
    temperature: `${temp}°C`,
    condition: condition.charAt(0).toUpperCase() + condition.slice(1),
    humidity: `${humidity}%`,
    description: this.getWeatherDescription()
  };
});

// Instance methods
weatherDataSchema.methods.getWeatherDescription = function() {
  const temp = this.current.temperature;
  const condition = this.current.condition;
  const humidity = this.current.humidity;
  
  let description = '';
  
  // Temperature description
  if (temp < 10) description += 'Cold ';
  else if (temp < 25) description += 'Pleasant ';
  else if (temp < 35) description += 'Warm ';
  else description += 'Hot ';
  
  // Condition description
  description += condition;
  
  // Humidity description
  if (humidity > 80) description += ' with high humidity';
  else if (humidity < 30) description += ' with low humidity';
  
  return description;
};

weatherDataSchema.methods.isDataFresh = function(maxAgeMinutes = 60) {
  const ageInMinutes = (Date.now() - this.lastUpdated.getTime()) / (1000 * 60);
  return ageInMinutes <= maxAgeMinutes;
};

weatherDataSchema.methods.getActiveAlerts = function() {
  return this.alerts.filter(alert => 
    alert.isActive && 
    alert.startTime <= new Date() && 
    alert.endTime >= new Date()
  );
};

weatherDataSchema.methods.addAlert = function(alertData) {
  this.alerts.push({
    ...alertData,
    isActive: true
  });
  return this.save();
};

weatherDataSchema.methods.updateForecast = function(forecastData) {
  this.forecast = forecastData;
  this.lastUpdated = new Date();
  return this.save();
};

// Static methods
weatherDataSchema.statics.findByLocation = function(latitude, longitude, maxDistance = 10000) {
  return this.findOne({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  }).sort({ lastUpdated: -1 });
};

weatherDataSchema.statics.findByCity = function(cityName, stateName = null) {
  const query = {
    'location.city': new RegExp(cityName, 'i'),
    isActive: true
  };
  
  if (stateName) {
    query['location.state'] = new RegExp(stateName, 'i');
  }
  
  return this.findOne(query).sort({ lastUpdated: -1 });
};

weatherDataSchema.statics.getRecentData = function(hours = 24) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.find({
    lastUpdated: { $gte: cutoffTime },
    isActive: true
  }).sort({ lastUpdated: -1 });
};

weatherDataSchema.statics.cleanupOldData = function(daysOld = 7) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  
  return this.deleteMany({
    lastUpdated: { $lt: cutoffDate }
  });
};

weatherDataSchema.statics.getWeatherStats = function(startDate, endDate) {
  const matchStage = {
    isActive: true
  };
  
  if (startDate || endDate) {
    matchStage.lastUpdated = {};
    if (startDate) matchStage.lastUpdated.$gte = new Date(startDate);
    if (endDate) matchStage.lastUpdated.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$current.condition',
        count: { $sum: 1 },
        avgTemperature: { $avg: '$current.temperature' },
        avgHumidity: { $avg: '$current.humidity' },
        avgPressure: { $avg: '$current.pressure' },
        totalPrecipitation: { $sum: '$current.precipitation' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

module.exports = WeatherData;
