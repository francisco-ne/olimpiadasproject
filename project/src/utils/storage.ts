import { User, TravelPackage, Order, InternalEmail } from '../types';

const STORAGE_KEYS = {
  USERS: 'travel_portal_users',
  PACKAGES: 'travel_portal_packages',
  ORDERS: 'travel_portal_orders',
  INTERNAL_EMAILS: 'travel_portal_internal_emails',
  CURRENT_USER: 'travel_portal_current_user',
  CART: 'travel_portal_cart'
};

// Storage utilities
export const storage = {
  get: <T>(key: string): T[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  set: <T>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

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

// Initialize default data
export const initializeDefaultData = () => {
  // Default admin user
  const users = storage.get<User>(STORAGE_KEYS.USERS);
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: '1',
      name: 'Admin User',
      email: 'admin@travelportal.com',
      password: 'admin123', // In real app, this would be hashed
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    storage.set(STORAGE_KEYS.USERS, [defaultAdmin]);
  }

  // Default travel packages
  const packages = storage.get<TravelPackage>(STORAGE_KEYS.PACKAGES);
  if (packages.length === 0) {
    const defaultPackages: TravelPackage[] = [
      {
        id: '1',
        code: 'PAR001',
        title: 'París Romántico',
        description: 'Descubre la Ciudad del Amor con este increíble paquete que incluye los mejores sitios románticos de París.',
        price: 2500,
        imageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'international',
        duration: '7 días, 6 noches',
        location: 'París, Francia',
        highlights: ['Torre Eiffel', 'Museo del Louvre', 'Crucero por el Sena', 'Montmartre'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        code: 'BAR002',
        title: 'Barcelona Mágica',
        description: 'Explora la vibrante Barcelona con su arquitectura única, playas hermosas y gastronomía excepcional.',
        price: 1800,
        imageUrl: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'international',
        duration: '5 días, 4 noches',
        location: 'Barcelona, España',
        highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Playa Barceloneta'],
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        code: 'BAR003',
        title: 'Bariloche Aventura',
        description: 'Vive la aventura en la Patagonia argentina con paisajes únicos, lagos cristalinos y montañas nevadas.',
        price: 1200,
        imageUrl: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'national',
        duration: '4 días, 3 noches',
        location: 'Bariloche, Argentina',
        highlights: ['Cerro Catedral', 'Lago Nahuel Huapi', 'Chocolate Tour', 'Bosque de Arrayanes'],
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        code: 'TOK004',
        title: 'Tokio Moderno',
        description: 'Sumérgete en la cultura japonesa moderna y tradicional en la fascinante ciudad de Tokio.',
        price: 3200,
        imageUrl: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'international',
        duration: '8 días, 7 noches',
        location: 'Tokio, Japón',
        highlights: ['Templo Senso-ji', 'Shibuya Crossing', 'Monte Fuji', 'Mercado Tsukiji'],
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        code: 'MEN005',
        title: 'Mendoza Vinos',
        description: 'Descubre los mejores vinos argentinos en el corazón de la región vitivinícola más importante del país.',
        price: 800,
        imageUrl: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'national',
        duration: '3 días, 2 noches',
        location: 'Mendoza, Argentina',
        highlights: ['Bodega Catena Zapata', 'Cordillera de los Andes', 'Cata de vinos', 'Termas de Cacheuta'],
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        code: 'BAL006',
        title: 'Bali Tropical',
        description: 'Relájate en las playas paradisíacas de Bali y experimenta la rica cultura balinesa.',
        price: 2800,
        imageUrl: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'international',
        duration: '6 días, 5 noches',
        location: 'Bali, Indonesia',
        highlights: ['Templo Tanah Lot', 'Arrozales de Tegallalang', 'Playa Kuta', 'Volcán Batur'],
        createdAt: new Date().toISOString()
      }
    ];
    storage.set(STORAGE_KEYS.PACKAGES, defaultPackages);
  }

  // Default internal emails
  const internalEmails = storage.get<InternalEmail>(STORAGE_KEYS.INTERNAL_EMAILS);
  if (internalEmails.length === 0) {
    const defaultEmails: InternalEmail[] = [
      { id: '1', sector: 'Ventas', email: 'ventas@travelportal.com' },
      { id: '2', sector: 'Contabilidad', email: 'contabilidad@travelportal.com' },
      { id: '3', sector: 'Atención al Cliente', email: 'atencion@travelportal.com' }
    ];
    storage.set(STORAGE_KEYS.INTERNAL_EMAILS, defaultEmails);
  }
};

// User operations
export const userOperations = {
  getAll: (): User[] => storage.get<User>(STORAGE_KEYS.USERS),
  
  create: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  authenticate: (email: string, password: string): User | null => {
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    return users.find(user => user.email === email && user.password === password) || null;
  },

  getCurrentUser: (): User | null => {
    return storage.getSingle<User>(STORAGE_KEYS.CURRENT_USER);
  },

  setCurrentUser: (user: User): void => {
    storage.setSingle(STORAGE_KEYS.CURRENT_USER, user);
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    storage.remove(STORAGE_KEYS.CART);
  }
};

// Package operations
export const packageOperations = {
  getAll: (): TravelPackage[] => storage.get<TravelPackage>(STORAGE_KEYS.PACKAGES),
  
  create: (pkg: Omit<TravelPackage, 'id' | 'createdAt'>): TravelPackage => {
    const packages = storage.get<TravelPackage>(STORAGE_KEYS.PACKAGES);
    const newPackage: TravelPackage = {
      ...pkg,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    packages.push(newPackage);
    storage.set(STORAGE_KEYS.PACKAGES, packages);
    return newPackage;
  },

  update: (id: string, updates: Partial<TravelPackage>): TravelPackage | null => {
    const packages = storage.get<TravelPackage>(STORAGE_KEYS.PACKAGES);
    const index = packages.findIndex(pkg => pkg.id === id);
    if (index !== -1) {
      packages[index] = { ...packages[index], ...updates };
      storage.set(STORAGE_KEYS.PACKAGES, packages);
      return packages[index];
    }
    return null;
  },

  delete: (id: string): boolean => {
    const packages = storage.get<TravelPackage>(STORAGE_KEYS.PACKAGES);
    const filteredPackages = packages.filter(pkg => pkg.id !== id);
    if (filteredPackages.length !== packages.length) {
      storage.set(STORAGE_KEYS.PACKAGES, filteredPackages);
      return true;
    }
    return false;
  },

  getById: (id: string): TravelPackage | null => {
    const packages = storage.get<TravelPackage>(STORAGE_KEYS.PACKAGES);
    return packages.find(pkg => pkg.id === id) || null;
  }
};

// Order operations
export const orderOperations = {
  getAll: (): Order[] => storage.get<Order>(STORAGE_KEYS.ORDERS),
  
  getByClientId: (clientId: string): Order[] => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    return orders.filter(order => order.clientId === clientId);
  },

  create: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>): Order => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    const orderNumber = `ORD-${Date.now()}`;
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      orderNumber,
      orderDate: new Date().toISOString()
    };
    orders.push(newOrder);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateStatus: (id: string, status: Order['status'], deliveryDate?: string): Order | null => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
      orders[index] = { 
        ...orders[index], 
        status,
        ...(deliveryDate && { deliveryDate })
      };
      storage.set(STORAGE_KEYS.ORDERS, orders);
      return orders[index];
    }
    return null;
  },

  delete: (id: string): boolean => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    const filteredOrders = orders.filter(order => order.id !== id);
    if (filteredOrders.length !== orders.length) {
      storage.set(STORAGE_KEYS.ORDERS, filteredOrders);
      return true;
    }
    return false;
  }
};

// Cart operations
export const cartOperations = {
  get: () => storage.get(STORAGE_KEYS.CART),
  set: (cart: any[]) => storage.set(STORAGE_KEYS.CART, cart),
  clear: () => storage.remove(STORAGE_KEYS.CART)
};