/*
  # Initial Schema for Travel Portal

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text)
      - `role` (text, check constraint for 'client' or 'admin')
      - `created_at` (timestamp)
    
    - `travel_packages`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `type` (text, check constraint for 'national' or 'international')
      - `duration` (text)
      - `location` (text)
      - `highlights` (text array)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to users)
      - `order_number` (text, unique)
      - `total` (numeric)
      - `status` (text, check constraint for 'pending', 'delivered', 'cancelled')
      - `order_date` (timestamp)
      - `delivery_date` (timestamp, nullable)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `package_id` (uuid, foreign key to travel_packages)
      - `title` (text)
      - `quantity` (integer)
      - `price_at_purchase` (numeric)
      - `created_at` (timestamp)
    
    - `internal_emails`
      - `id` (uuid, primary key)
      - `sector` (text)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for admin users to access all data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  created_at timestamptz DEFAULT now()
);

-- Create travel_packages table
CREATE TABLE IF NOT EXISTS travel_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  image_url text NOT NULL,
  type text NOT NULL CHECK (type IN ('national', 'international')),
  duration text NOT NULL,
  location text NOT NULL,
  highlights text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  total numeric NOT NULL CHECK (total > 0),
  status text NOT NULL CHECK (status IN ('pending', 'delivered', 'cancelled')) DEFAULT 'pending',
  order_date timestamptz DEFAULT now(),
  delivery_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES travel_packages(id) ON DELETE CASCADE,
  title text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric NOT NULL CHECK (price_at_purchase > 0),
  created_at timestamptz DEFAULT now()
);

-- Create internal_emails table
CREATE TABLE IF NOT EXISTS internal_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_emails ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Anyone can create user accounts"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Travel packages policies
CREATE POLICY "Anyone can read travel packages"
  ON travel_packages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage travel packages"
  ON travel_packages
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (client_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id::text = auth.uid()::text);

CREATE POLICY "Users can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (client_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Order items policies
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND (orders.client_id::text = auth.uid()::text OR EXISTS (
      SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
    ))
  ));

CREATE POLICY "Users can create order items for own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND orders.client_id::text = auth.uid()::text
  ));

-- Internal emails policies
CREATE POLICY "Only admins can read internal emails"
  ON internal_emails
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Insert default data
INSERT INTO users (id, name, email, password, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@travelportal.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO travel_packages (id, code, title, description, price, image_url, type, duration, location, highlights) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'PAR001', 'París Romántico', 'Descubre la Ciudad del Amor con este increíble paquete que incluye los mejores sitios románticos de París.', 2500, 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', 'international', '7 días, 6 noches', 'París, Francia', ARRAY['Torre Eiffel', 'Museo del Louvre', 'Crucero por el Sena', 'Montmartre']),
  ('00000000-0000-0000-0000-000000000002', 'BAR002', 'Barcelona Mágica', 'Explora la vibrante Barcelona con su arquitectura única, playas hermosas y gastronomía excepcional.', 1800, 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', 'international', '5 días, 4 noches', 'Barcelona, España', ARRAY['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Playa Barceloneta']),
  ('00000000-0000-0000-0000-000000000003', 'BAR003', 'Bariloche Aventura', 'Vive la aventura en la Patagonia argentina con paisajes únicos, lagos cristalinos y montañas nevadas.', 1200, 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800', 'national', '4 días, 3 noches', 'Bariloche, Argentina', ARRAY['Cerro Catedral', 'Lago Nahuel Huapi', 'Chocolate Tour', 'Bosque de Arrayanes']),
  ('00000000-0000-0000-0000-000000000004', 'TOK004', 'Tokio Moderno', 'Sumérgete en la cultura japonesa moderna y tradicional en la fascinante ciudad de Tokio.', 3200, 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', 'international', '8 días, 7 noches', 'Tokio, Japón', ARRAY['Templo Senso-ji', 'Shibuya Crossing', 'Monte Fuji', 'Mercado Tsukiji']),
  ('00000000-0000-0000-0000-000000000005', 'MEN005', 'Mendoza Vinos', 'Descubre los mejores vinos argentinos en el corazón de la región vitivinícola más importante del país.', 800, 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=800', 'national', '3 días, 2 noches', 'Mendoza, Argentina', ARRAY['Bodega Catena Zapata', 'Cordillera de los Andes', 'Cata de vinos', 'Termas de Cacheuta']),
  ('00000000-0000-0000-0000-000000000006', 'BAL006', 'Bali Tropical', 'Relájate en las playas paradisíacas de Bali y experimenta la rica cultura balinesa.', 2800, 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800', 'international', '6 días, 5 noches', 'Bali, Indonesia', ARRAY['Templo Tanah Lot', 'Arrozales de Tegallalang', 'Playa Kuta', 'Volcán Batur'])
ON CONFLICT (code) DO NOTHING;

INSERT INTO internal_emails (sector, email) VALUES 
  ('Ventas', 'ventas@travelportal.com'),
  ('Contabilidad', 'contabilidad@travelportal.com'),
  ('Atención al Cliente', 'atencion@travelportal.com')
ON CONFLICT DO NOTHING;