-- Create rooms table
CREATE TABLE rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) NOT NULL,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    booking_status TEXT NOT NULL DEFAULT 'confirmed',
    stripe_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS (Row Level Security) policies
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Rooms are viewable by everyone" ON rooms
    FOR SELECT USING (true);

-- Create policies for customers
CREATE POLICY "Customers can view their own data" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update their own data" ON customers
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for bookings
CREATE POLICY "Bookings are viewable by everyone" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Customers can create their own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Insert initial room data
INSERT INTO rooms (name, capacity, price_per_hour) VALUES
    ('Small Meeting Room 1', 4, 12.50),
    ('Small Meeting Room 2', 4, 12.50),
    ('Small Meeting Room 3', 4, 12.50),
    ('Large Meeting Room', 16, 19.50); 