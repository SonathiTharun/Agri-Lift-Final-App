import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
  product?: {
    _id: string;
    name: string;
    images: string[];
    stock: number;
    isActive: boolean;
  };
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  lastUpdated: string;
}

interface UseCartReturn {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getCart();
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setError(null);
      
      const response = await apiService.addToCart(productId, quantity);
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err; // Re-throw so components can handle it
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      setError(null);
      
      const response = await apiService.updateCartItem(productId, quantity);
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      throw err;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setError(null);
      
      const response = await apiService.removeFromCart(productId);
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      
      const response = await apiService.clearCart();
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  };
};
