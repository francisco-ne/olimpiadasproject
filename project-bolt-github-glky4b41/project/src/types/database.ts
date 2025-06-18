export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          role: 'client' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          role?: 'client' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          role?: 'client' | 'admin';
          created_at?: string;
        };
      };
      travel_packages: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string;
          price: number;
          image_url: string;
          type: 'national' | 'international';
          duration: string;
          location: string;
          highlights: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description: string;
          price: number;
          image_url: string;
          type: 'national' | 'international';
          duration: string;
          location: string;
          highlights?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          description?: string;
          price?: number;
          image_url?: string;
          type?: 'national' | 'international';
          duration?: string;
          location?: string;
          highlights?: string[];
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          client_id: string;
          order_number: string;
          total: number;
          status: 'pending' | 'delivered' | 'cancelled';
          order_date: string;
          delivery_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          order_number: string;
          total: number;
          status?: 'pending' | 'delivered' | 'cancelled';
          order_date?: string;
          delivery_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          order_number?: string;
          total?: number;
          status?: 'pending' | 'delivered' | 'cancelled';
          order_date?: string;
          delivery_date?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          package_id: string;
          title: string;
          quantity: number;
          price_at_purchase: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          package_id: string;
          title: string;
          quantity: number;
          price_at_purchase: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          package_id?: string;
          title?: string;
          quantity?: number;
          price_at_purchase?: number;
          created_at?: string;
        };
      };
      internal_emails: {
        Row: {
          id: string;
          sector: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sector: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sector?: string;
          email?: string;
          created_at?: string;
        };
      };
    };
  };
}