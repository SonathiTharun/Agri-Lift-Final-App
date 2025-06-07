
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  dateAdded: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const addToWishlist = (item: Omit<WishlistItem, 'dateAdded'>) => {
    const newItem: WishlistItem = {
      ...item,
      dateAdded: new Date().toISOString()
    };
    
    setWishlist(prev => {
      const updated = [...prev, newItem];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
    
    toast.success(`${item.name} added to wishlist!`);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
    
    toast.success('Item removed from wishlist');
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
