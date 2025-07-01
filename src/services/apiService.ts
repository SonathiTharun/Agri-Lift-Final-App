const API_BASE_URL = 'http://localhost:5006/api';

// Types for API responses
export interface SoilParameter {
  id?: number;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'low' | 'deficient';
  optimal: {
    min: number;
    max: number;
  };
  confidence?: number;
  extractionMethod?: string;
  createdAt?: string;
}

export interface SoilReport {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadTimestamp: string;
  ocrConfidence: number;
  processingStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CropRecommendation {
  id?: number;
  name: string;
  description: string;
  growingPeriod: string;
  waterNeed: 'Low' | 'Medium' | 'High';
  suitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  score: number;
  season: string;
  marketPrice?: {
    min: number;
    max: number;
    unit: string;
  };
  expectedYield?: {
    min: number;
    max: number;
    unit: string;
  };
  potentialRevenue?: number;
  parameterScores?: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
  };
  createdAt?: string;
}

export interface UploadResponse {
  success: boolean;
  reportId: string;
  sessionId: string;
  ocrResult: {
    confidence: number;
    method: string;
    processingTime: number;
  };
  soilData: {
    extractedCount: number;
    totalParameters: number;
    parameters: SoilParameter[];
  };
  message: string;
}

export interface RecommendationResponse {
  success: boolean;
  reportId: string;
  season: string;
  recommendations: CropRecommendation[];
  metadata: {
    totalRecommendations: number;
    excellentCrops: number;
    goodCrops: number;
    fairCrops: number;
    poorCrops: number;
  };
}

export interface VisualizationData {
  report: SoilReport;
  parameters: SoilParameter[];
  charts: {
    radar: any;
    bar: any;
    pie: any;
  };
  summary: {
    totalParameters: number;
    optimalCount: number;
    lowCount: number;
    deficientCount: number;
    healthScore: number;
    recommendations: string[];
  };
}

// Authentication types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'executive';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verification: 'verified' | 'unverified' | 'pending';
  profileImage?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails?: {
    farmName?: string;
    farmSize?: number;
    farmType?: 'organic' | 'conventional' | 'mixed';
    primaryCrops?: string[];
    experience?: number;
  };
  executiveDetails?: {
    department?: string;
    position?: string;
    employeeId?: string;
    accessLevel?: 'basic' | 'advanced' | 'admin';
  };
  preferences?: {
    language?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    theme?: 'light' | 'dark';
  };
  lastLogin?: string;
  totalLogins?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'executive';
  farmDetails?: {
    farmName?: string;
    farmSize?: number;
    farmType?: 'organic' | 'conventional' | 'mixed';
    primaryCrops?: string[];
    experience?: number;
  };
  executiveDetails?: {
    department?: string;
    position?: string;
    employeeId?: string;
    accessLevel?: 'basic' | 'advanced' | 'admin';
  };
}

export interface LoginData {
  email: string;
  password: string;
  userType?: 'farmer' | 'executive';
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  // Get headers with authentication
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    } else if (!this.getToken()) {
      // Add session ID for guest users
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
      }
      headers['X-Session-ID'] = sessionId;
    }

    return headers;
  }

  // Make authenticated request
  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    // Handle token expiration
    if (response.status === 401) {
      this.setToken(null);
      // Redirect to login or emit event
      window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
    }

    return response;
  }

  // Authentication methods

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();

    // Store token
    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  // Login user
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      credentials: 'include', // Include cookies for refresh token
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();

    // Store token
    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await this.makeRequest(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }

    // Clear token
    this.setToken(null);

    return response.json();
  }

  // Get user profile
  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await this.makeRequest(`${this.baseUrl}/auth/profile`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  }

  // Update user profile
  async updateProfile(updateData: Partial<User>): Promise<{ success: boolean; message: string; data: { user: User } }> {
    const response = await this.makeRequest(`${this.baseUrl}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<{ success: boolean; message: string; data: { user: User; profileImageUrl: string } }> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const headers: HeadersInit = {};
    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    const response = await fetch(`${this.baseUrl}/auth/profile/picture`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload profile picture');
    }

    return response.json();
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await this.makeRequest(`${this.baseUrl}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return response.json();
  }

  // Verify token
  async verifyToken(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await this.makeRequest(`${this.baseUrl}/auth/verify-token`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token verification failed');
    }

    return response.json();
  }

  // Refresh token
  async refreshToken(): Promise<{ success: boolean; data: { token: string } }> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token refresh failed');
    }

    const result = await response.json();

    // Update token
    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  // Get user statistics (Executive only)
  async getUserStatistics(): Promise<{
    success: boolean;
    data: {
      totalUsers: number;
      roleStats: Array<{
        _id: string;
        total: number;
        active: number;
        pending: number;
        suspended: number;
      }>;
      recentUsers: User[];
    };
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/auth/stats`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user statistics');
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get current user role from token
  getCurrentUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  // Upload soil health card
  async uploadSoilHealthCard(file: File, userId?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('soilHealthCard', file);
    if (userId) {
      formData.append('userId', userId);
    }

    const headers: HeadersInit = {};
    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    const response = await fetch(`${this.baseUrl}/soil-analysis/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  // Get soil analysis report
  async getSoilReport(reportId: string): Promise<{
    report: SoilReport;
    parameters: SoilParameter[];
    processingLog: any[];
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/soil-analysis/report/${reportId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch report');
    }

    return response.json();
  }

  // Get all reports for a user
  async getUserReports(userId?: string, limit = 10, offset = 0): Promise<{
    reports: SoilReport[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (userId) {
      params.append('userId', userId);
    }

    const response = await fetch(`${this.baseUrl}/soil-analysis/reports?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch reports');
    }

    return response.json();
  }

  // Generate crop recommendations
  async generateCropRecommendations(reportId: string, season: string): Promise<RecommendationResponse> {
    const response = await fetch(`${this.baseUrl}/crop-recommendation/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId, season }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate recommendations');
    }

    return response.json();
  }

  // Get crop recommendations for a report
  async getCropRecommendations(reportId: string, season?: string): Promise<{
    reportId: string;
    season: string;
    recommendations: CropRecommendation[];
    metadata: {
      totalRecommendations: number;
      seasons: string[];
    };
  }> {
    const params = new URLSearchParams();
    if (season) {
      params.append('season', season);
    }

    const response = await fetch(`${this.baseUrl}/crop-recommendation/report/${reportId}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch recommendations');
    }

    return response.json();
  }

  // Get available seasons
  async getAvailableSeasons(): Promise<{
    seasons: Array<{
      value: string;
      label: string;
      description: string;
    }>;
  }> {
    const response = await fetch(`${this.baseUrl}/crop-recommendation/seasons`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch seasons');
    }

    return response.json();
  }

  // Get crops for a specific season
  async getCropsBySeason(season: string): Promise<{
    season: string;
    crops: Array<{
      name: string;
      description: string;
      growingPeriod: string;
      waterNeed: string;
      idealConditions: any;
      marketPrice: any;
      expectedYield: any;
    }>;
  }> {
    const response = await fetch(`${this.baseUrl}/crop-recommendation/crops/${season}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch crops');
    }

    return response.json();
  }

  // Get visualization data
  async getVisualizationData(reportId: number): Promise<VisualizationData> {
    const response = await fetch(`${this.baseUrl}/visualization/soil-data/${reportId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch visualization data');
    }

    return response.json();
  }

  // Get comparison data for multiple reports
  async getComparisonData(reportIds: number[]): Promise<{
    reports: any[];
    charts: any;
    metadata: {
      totalReports: number;
      requestedReports: number;
      parameters: string[];
    };
  }> {
    const params = new URLSearchParams({
      reportIds: reportIds.join(','),
    });

    const response = await fetch(`${this.baseUrl}/visualization/comparison?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch comparison data');
    }

    return response.json();
  }

  // Get trend data for a user
  async getTrendData(userId: string, parameter?: string, limit = 10): Promise<{
    userId: string;
    parameter: string;
    trends: Array<{
      parameter: string;
      unit: string;
      data: Array<{
        reportId: number;
        timestamp: string;
        value: number;
      }>;
    }>;
    metadata: {
      totalDataPoints: number;
      parameters: string[];
      dateRange: {
        from: string | null;
        to: string | null;
      };
    };
  }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    if (parameter) {
      params.append('parameter', parameter);
    }

    const response = await fetch(`${this.baseUrl}/visualization/trends/${userId}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch trend data');
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  }> {
    const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);

    if (!response.ok) {
      throw new Error('Backend server is not responding');
    }

    return response.json();
  }

  // Product Management

  // Get product categories
  async getProductCategories(): Promise<{
    success: boolean;
    data: {
      categories: Array<{
        _id: string;
        name: string;
        description: string;
        icon: string;
        image: string;
        sortOrder: number;
      }>;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/products/categories`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch categories');
    }

    return response.json();
  }

  // Get featured products
  async getFeaturedProducts(limit = 10): Promise<{
    success: boolean;
    data: {
      products: Array<any>;
      count: number;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/products/featured?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch featured products');
    }

    return response.json();
  }

  // Get products with filtering
  async getProducts(options: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    success: boolean;
    data: {
      products: Array<any>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/products?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch products');
    }

    return response.json();
  }

  // Get products by category
  async getProductsByCategory(categoryId: string, page = 1, limit = 20): Promise<{
    success: boolean;
    data: {
      category: any;
      products: Array<any>;
      pagination: any;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/products/category/${categoryId}?page=${page}&limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch products');
    }

    return response.json();
  }

  // Get single product
  async getProduct(productId: string): Promise<{
    success: boolean;
    data: {
      product: any;
      relatedProducts: Array<any>;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/products/${productId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch product');
    }

    return response.json();
  }

  // Cart Management

  // Get user's cart
  async getCart(): Promise<{
    success: boolean;
    data: {
      cart: any;
      stockValidation?: Array<any>;
    };
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/cart`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch cart');
    }

    return response.json();
  }

  // Add item to cart
  async addToCart(productId: string, quantity: number): Promise<{
    success: boolean;
    message: string;
    data: { cart: any };
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/cart/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add item to cart');
    }

    return response.json();
  }

  // Update cart item quantity
  async updateCartItem(productId: string, quantity: number): Promise<{
    success: boolean;
    message: string;
    data: { cart: any };
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update cart');
    }

    return response.json();
  }

  // Remove item from cart
  async removeFromCart(productId: string): Promise<{
    success: boolean;
    message: string;
    data: { cart: any };
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/cart/remove/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove item from cart');
    }

    return response.json();
  }

  // Clear cart
  async clearCart(): Promise<{
    success: boolean;
    message: string;
    data: { cart: any };
  }> {
    const response = await this.makeRequest(`${this.baseUrl}/cart/clear`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to clear cart');
    }

    return response.json();
  }

  // Weather API

  // Get current weather
  async getCurrentWeather(options: {
    lat?: number;
    lon?: number;
    city?: string;
    state?: string;
  }): Promise<{
    success: boolean;
    data: {
      weather: any;
      isFresh: boolean;
      lastUpdated: string;
      summary: any;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/weather/current?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch weather data');
    }

    return response.json();
  }

  // Get weather forecast
  async getWeatherForecast(options: {
    lat?: number;
    lon?: number;
    city?: string;
    state?: string;
    days?: number;
  }): Promise<{
    success: boolean;
    data: {
      location: any;
      current: any;
      forecast: Array<any>;
      alerts: Array<any>;
      lastUpdated: string;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/weather/forecast?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch weather forecast');
    }

    return response.json();
  }

  // Market Prices API

  // Get latest market prices
  async getLatestMarketPrices(crops?: string[], limit = 50): Promise<{
    success: boolean;
    data: {
      prices: Array<any>;
      count: number;
      lastUpdated: string | null;
    };
  }> {
    const params = new URLSearchParams();
    if (crops && crops.length > 0) {
      params.append('crops', crops.join(','));
    }
    params.append('limit', limit.toString());

    const response = await fetch(`${this.baseUrl}/market-prices/latest?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch market prices');
    }

    return response.json();
  }

  // Get real-time price ticker
  async getRealTimePrices(crops?: string[], limit = 10): Promise<{
    success: boolean;
    data: {
      ticker: Array<{
        id: string;
        name: string;
        price: number;
        change: number;
        changePercent: number;
        trend: 'up' | 'down' | 'neutral';
        unit: string;
        market: string;
        lastUpdated: string;
      }>;
      count: number;
      lastUpdated: string | null;
    };
  }> {
    const params = new URLSearchParams();
    if (crops && crops.length > 0) {
      params.append('crops', crops.join(','));
    }
    params.append('limit', limit.toString());

    const response = await fetch(`${this.baseUrl}/market-prices/realtime?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch real-time prices');
    }

    return response.json();
  }

  // Get trending crops
  async getTrendingCrops(days = 7, limit = 10): Promise<{
    success: boolean;
    data: {
      trending: Array<any>;
      period: string;
      count: number;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/market-prices/trending?days=${days}&limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch trending crops');
    }

    return response.json();
  }

  // Get crop prices
  async getCropPrices(cropName: string, options: {
    state?: string;
    marketType?: string;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    data: {
      crop: string;
      prices: Array<any>;
      count: number;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/market-prices/crop/${cropName}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch crop prices');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
