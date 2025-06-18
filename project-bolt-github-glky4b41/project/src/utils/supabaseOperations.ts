import { supabase } from '../lib/supabase';
import { User, TravelPackage, Order, OrderItem, InternalEmail } from '../types';

// Helper function to transform database user to app user
const transformDbUser = (dbUser: any): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  password: dbUser.password,
  role: dbUser.role,
  createdAt: dbUser.created_at
});

// Helper function to transform database package to app package
const transformDbPackage = (dbPackage: any): TravelPackage => ({
  id: dbPackage.id,
  code: dbPackage.code,
  title: dbPackage.title,
  description: dbPackage.description,
  price: dbPackage.price,
  imageUrl: dbPackage.image_url,
  type: dbPackage.type,
  duration: dbPackage.duration,
  location: dbPackage.location,
  highlights: dbPackage.highlights || [],
  createdAt: dbPackage.created_at
});

// Helper function to transform database order to app order
const transformDbOrder = (dbOrder: any, items: OrderItem[] = []): Order => ({
  id: dbOrder.id,
  clientId: dbOrder.client_id,
  orderNumber: dbOrder.order_number,
  items,
  total: dbOrder.total,
  status: dbOrder.status,
  orderDate: dbOrder.order_date,
  deliveryDate: dbOrder.delivery_date
});

// User operations
export const userOperations = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(transformDbUser) || [];
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformDbUser(data);
  },

  authenticate: async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error || !data) return null;
    return transformDbUser(data);
  },

  getCurrentUser: (): User | null => {
    try {
      const userData = localStorage.getItem('travel_portal_current_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem('travel_portal_current_user', JSON.stringify(user));
  },

  logout: (): void => {
    localStorage.removeItem('travel_portal_current_user');
    localStorage.removeItem('travel_portal_cart');
  }
};

// Package operations
export const packageOperations = {
  getAll: async (): Promise<TravelPackage[]> => {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(transformDbPackage) || [];
  },

  create: async (pkg: Omit<TravelPackage, 'id' | 'createdAt'>): Promise<TravelPackage> => {
    const { data, error } = await supabase
      .from('travel_packages')
      .insert({
        code: pkg.code,
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        image_url: pkg.imageUrl,
        type: pkg.type,
        duration: pkg.duration,
        location: pkg.location,
        highlights: pkg.highlights
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformDbPackage(data);
  },

  update: async (id: string, updates: Partial<TravelPackage>): Promise<TravelPackage | null> => {
    const updateData: any = {};
    if (updates.code) updateData.code = updates.code;
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    if (updates.type) updateData.type = updates.type;
    if (updates.duration) updateData.duration = updates.duration;
    if (updates.location) updateData.location = updates.location;
    if (updates.highlights) updateData.highlights = updates.highlights;

    const { data, error } = await supabase
      .from('travel_packages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? transformDbPackage(data) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('travel_packages')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  getById: async (id: string): Promise<TravelPackage | null> => {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return transformDbPackage(data);
  }
};

// Order operations
export const orderOperations = {
  getAll: async (): Promise<Order[]> => {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ordersError) throw ordersError;
    
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        const orderItems: OrderItem[] = (items || []).map(item => ({
          packageId: item.package_id,
          title: item.title,
          quantity: item.quantity,
          priceAtPurchase: item.price_at_purchase
        }));
        
        return transformDbOrder(order, orderItems);
      })
    );
    
    return ordersWithItems;
  },

  getByClientId: async (clientId: string): Promise<Order[]> => {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (ordersError) throw ordersError;
    
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        const orderItems: OrderItem[] = (items || []).map(item => ({
          packageId: item.package_id,
          title: item.title,
          quantity: item.quantity,
          priceAtPurchase: item.price_at_purchase
        }));
        
        return transformDbOrder(order, orderItems);
      })
    );
    
    return ordersWithItems;
  },

  create: async (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>): Promise<Order> => {
    const orderNumber = `ORD-${Date.now()}`;
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        client_id: order.clientId,
        order_number: orderNumber,
        total: order.total,
        status: order.status || 'pending'
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      package_id: item.packageId,
      title: item.title,
      quantity: item.quantity,
      price_at_purchase: item.priceAtPurchase
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return transformDbOrder(orderData, order.items);
  },

  updateStatus: async (id: string, status: Order['status'], deliveryDate?: string): Promise<Order | null> => {
    const updateData: any = { status };
    if (deliveryDate) {
      updateData.delivery_date = deliveryDate;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);
    
    if (itemsError) throw itemsError;
    
    const orderItems: OrderItem[] = (items || []).map(item => ({
      packageId: item.package_id,
      title: item.title,
      quantity: item.quantity,
      priceAtPurchase: item.price_at_purchase
    }));
    
    return data ? transformDbOrder(data, orderItems) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    return !error;
  }
};

// Internal email operations
export const internalEmailOperations = {
  getAll: async (): Promise<InternalEmail[]> => {
    const { data, error } = await supabase
      .from('internal_emails')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(item => ({
      id: item.id,
      sector: item.sector,
      email: item.email
    })) || [];
  }
};

// Cart operations (still using localStorage for cart state)
export const cartOperations = {
  get: () => {
    try {
      const data = localStorage.getItem('travel_portal_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  set: (cart: any[]) => {
    localStorage.setItem('travel_portal_cart', JSON.stringify(cart));
  },
  clear: () => {
    localStorage.removeItem('travel_portal_cart');
  }
};