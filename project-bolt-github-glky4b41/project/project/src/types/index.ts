export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface TravelPackage {
  id: string;
  code: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  type: 'national' | 'international';
  duration: string;
  location: string;
  highlights: string[];
  createdAt: string;
}

export interface CartItem {
  package: TravelPackage;
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
}

export interface OrderItem {
  packageId: string;
  title: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface InternalEmail {
  id: string;
  sector: string;
  email: string;
}