import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ApiService from '../services/apiService';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export interface Equipment {
    _id: string;
    name: string;
    category: string;
    brand?: string;
    condition: string;
    capacity?: string;
    location: string;
    price: number;
    description?: string;
    images: string[];
    seller: string;
    contactInfo?: string;
    conditionReport?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface FavoritesContextType {
    favorites: Equipment[];
    loading: boolean;
    error: string | null;
    fetchFavorites: () => Promise<void>;
    addFavorite: (equipment: Equipment) => Promise<void>;
    removeFavorite: (equipmentId: string) => Promise<void>;
    isFavorite: (equipmentId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const api = ApiService;

    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getFavorites();
            setFavorites(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch favorites');
        } finally {
            setLoading(false);
        }
    };

    const addFavorite = async (equipment: Equipment) => {
        setLoading(true);
        setError(null);
        try {
            await api.addFavorite(equipment._id);
            setFavorites((prev) => [...prev, equipment]);
        } catch (err: any) {
            setError(err.message || 'Failed to add favorite');
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (equipmentId: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.removeFavorite(equipmentId);
            setFavorites((prev) => prev.filter(eq => eq._id !== equipmentId));
        } catch (err: any) {
            setError(err.message || 'Failed to remove favorite');
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (equipmentId: string) => favorites.some(eq => eq._id === equipmentId);

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <FavoritesContext.Provider value={{ favorites, loading, error, fetchFavorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
    return context;
}; 