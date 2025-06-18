// Legacy storage utilities - kept for backward compatibility
// Most operations now use Supabase, but some local storage is still used for cart and current user

const STORAGE_KEYS = {
  CURRENT_USER: 'travel_portal_current_user',
  CART: 'travel_portal_cart'
};

// Storage utilities
export const storage = {
  getSingle: <T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSingle: <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

// Re-export operations from supabaseOperations for backward compatibility
export { 
  userOperations, 
  packageOperations, 
  orderOperations, 
  cartOperations 
} from './supabaseOperations';

// Initialize default data - now handled by Supabase migrations
export const initializeDefaultData = () => {
  // This function is now a no-op since data initialization is handled by Supabase migrations
  // Keeping it for backward compatibility
};