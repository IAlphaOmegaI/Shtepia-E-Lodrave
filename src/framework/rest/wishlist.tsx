'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  [key: string]: any;
}

interface WishlistState {
  items: WishlistItem[];
  total: number;
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: { id: string | number } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_WISHLIST'; payload: WishlistState };

const initialState: WishlistState = {
  items: [],
  total: 0,
};

const WishlistContext = createContext<{
  items: WishlistItem[];
  total: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  clearWishlist: () => void;
} | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) return state;
      
      const newItems = [...state.items, action.payload];
      return { items: newItems, total: newItems.length };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const newItems = state.items.filter((item) => item.id !== action.payload.id);
      return { items: newItems, total: newItems.length };
    }

    case 'CLEAR_WISHLIST':
      return initialState;

    case 'SET_WISHLIST':
      return action.payload;

    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'SET_WISHLIST', payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state));
  }, [state]);

  const addToWishlist = (item: WishlistItem) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
  };

  const removeFromWishlist = (id: string | number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id } });
  };

  const isInWishlist = (id: string | number) => {
    return state.items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};