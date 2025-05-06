
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { categories, productsByCategory } from '@/data/marketData';

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

// Create a comprehensive product catalog from all categories in marketData
const buildProductCatalog = (): Record<string, any> => {
  const catalog: Record<string, any> = {};
  
  // Add all products from each category to the catalog
  Object.entries(productsByCategory).forEach(([category, products]) => {
    products.forEach(product => {
      catalog[product.id] = {
        name: product.name,
        price: product.price,
        image: product.image,
        category: category
      };
    });
  });
  
  return catalog;
};

// Combined product catalog with all products from all categories
export const allProducts: Record<string, any> = buildProductCatalog();

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('agrilift-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        
        // Convert cart object to array of items with product details
        const items: CartItem[] = Object.entries(parsedCart)
          .filter(([id]) => allProducts[id] !== undefined) // Filter out products that don't exist
          .map(([id, quantity]) => {
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
        
        // If any items were filtered out, update the stored cart
        if (items.length !== Object.keys(parsedCart).length) {
          const validCart = items.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {} as Record<string, number>);
          localStorage.setItem('agrilift-cart', JSON.stringify(validCart));
          setCart(validCart);
        }
        
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Reset cart if there's an error
      localStorage.removeItem('agrilift-cart');
      setCart({});
      setCartItems([]);
    }
  }, []);

  const addToCart = (id: string, name: string, price: number, image: string, category: string, quantity = 1) => {
    // Verify the product exists in our catalog, if not add it temporarily
    if (!allProducts[id]) {
      console.log(`Product ${id} not found in catalog, adding temporarily`);
      allProducts[id] = { name, price, image, category };
    }
    
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
