
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
};

type CartContextType = {
  cart: Record<string, number>;
  cartItems: CartItem[];
  addToCart: (id: string, name: string, price: number, image: string, category: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

// Combined product catalog (copied from Checkout.tsx to be accessible globally)
export const allProducts: Record<string, any> = {
  "lg-plant-1": { name: "High-Yield Rice Seedling", price: 199, image: "https://images.unsplash.com/photo-1628684582941-abfbf5732f0e?q=80&w=2080&auto=format&fit=crop", category: "lab-grown-plants" },
  "lg-plant-2": { name: "Disease-Resistant Wheat", price: 249, image: "https://images.unsplash.com/photo-1536704515403-0b54f32be3aa?q=80&w=2069&auto=format&fit=crop", category: "lab-grown-plants" },
  "lg-plant-3": { name: "Drought-Tolerant Corn", price: 279, image: "https://images.unsplash.com/photo-1601329378636-b2f48bb6de76?q=80&w=2078&auto=format&fit=crop", category: "lab-grown-plants" },
  "lg-plant-4": { name: "Fast-Growing Vegetable Set", price: 349, image: "https://images.unsplash.com/photo-1528825539566-2bcb5882445c?q=80&w=2070&auto=format&fit=crop", category: "lab-grown-plants" },
  "seeds-1": { name: "Premium Hybrid Tomato Seeds", price: 89, image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=2070&auto=format&fit=crop", category: "seeds" },
  "seeds-2": { name: "Organic Carrot Seeds", price: 59, image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=2070&auto=format&fit=crop", category: "seeds" },
  "seeds-3": { name: "Watermelon Seed Mix", price: 99, image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=2070&auto=format&fit=crop", category: "seeds" },
  "seeds-4": { name: "Herb Garden Seed Kit", price: 129, image: "https://images.unsplash.com/photo-1619542402805-a6fff4407b9f?q=80&w=1932&auto=format&fit=crop", category: "seeds" },
  "fert-1": { name: "All-Purpose Organic Fertilizer", price: 299, image: "https://images.unsplash.com/photo-1615412704911-55d589229864?q=80&w=2070&auto=format&fit=crop", category: "fertilizers" },
  "fert-2": { name: "Slow-Release Granular Fertilizer", price: 399, image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop", category: "fertilizers" },
  "fert-3": { name: "Liquid Seaweed Fertilizer", price: 179, image: "https://images.unsplash.com/photo-1576158114254-3b8ac9df9adf?q=80&w=2080&auto=format&fit=crop", category: "fertilizers" },
  "fert-4": { name: "Specialized Fruit Tree Fertilizer", price: 349, image: "https://images.unsplash.com/photo-1658490858699-ea28503c7d4b?q=80&w=2069&auto=format&fit=crop", category: "fertilizers" },
  "pest-1": { name: "Organic Insect Spray", price: 159, image: "https://images.unsplash.com/photo-1527367888476-abf53aaf7bf1?q=80&w=2070&auto=format&fit=crop", category: "pesticides" },
  "pest-2": { name: "Fungicide Solution", price: 219, image: "https://images.unsplash.com/photo-1603256811365-19a4ccc3beb0?q=80&w=2071&auto=format&fit=crop", category: "pesticides" },
  "pest-3": { name: "Weed Control Concentrate", price: 289, image: "https://images.unsplash.com/photo-1560806853-c492a5d166b4?q=80&w=2017&auto=format&fit=crop", category: "pesticides" },
  "pest-4": { name: "Rodent Repellent", price: 199, image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop", category: "pesticides" },
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('agrilift-cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      
      // Convert cart object to array of items with product details
      const items: CartItem[] = Object.entries(parsedCart).map(([id, quantity]) => {
        const product = allProducts[id];
        return {
          id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity as number,
          category: product.category
        };
      });
      
      setCartItems(items);
    }
  }, []);

  const addToCart = (id: string, name: string, price: number, image: string, category: string, quantity = 1) => {
    setCart(prevCart => {
      const newQuantity = (prevCart[id] || 0) + quantity;
      const newCart = { ...prevCart, [id]: newQuantity };
      
      // Save to localStorage
      localStorage.setItem('agrilift-cart', JSON.stringify(newCart));
      
      // Update cart items array
      const updatedItems = [...cartItems];
      const existingItemIndex = updatedItems.findIndex(item => item.id === id);
      
      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity = newQuantity;
      } else {
        updatedItems.push({
          id,
          name,
          price,
          image,
          quantity,
          category
        });
      }
      
      setCartItems(updatedItems);
      
      toast({
        description: `Added ${quantity} ${name} to your cart`,
      });
      
      return newCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[id];
      
      // Save to localStorage
      localStorage.setItem('agrilift-cart', JSON.stringify(newCart));
      
      // Update cart items array
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      
      return newCart;
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => {
      const newCart = { ...prevCart, [id]: newQuantity };
      localStorage.setItem('agrilift-cart', JSON.stringify(newCart));
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
    setCartItems([]);
    localStorage.removeItem('agrilift-cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
