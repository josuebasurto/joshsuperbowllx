-- Casa Basurto Super Bowl Hub - Supabase Database Schema
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. TABLE: users
-- Almacena información de los usuários registrados
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT CHECK (team IN ('Seahawks', 'Patriots')),
  lastActive TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLE: quinielas
-- Almacena las respuestas de cada usuario en la quiniela
-- Una vez creada, es inmutable (UC-08: Bloqueo de Respuestas)
CREATE TABLE IF NOT EXISTS quinielas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  team TEXT,
  q1 TEXT,
  q2 TEXT,
  q3 TEXT,
  q4 TEXT,
  q5 TEXT,
  q6 TEXT,
  q7 TEXT,
  q8 TEXT,
  q9 TEXT,
  q10 TEXT,
  q11 TEXT,
  q12 TEXT,
  q13 TEXT,
  q14 TEXT,
  q15 TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(uid)
);

-- 3. TABLE: orders
-- Almacena los pedidos de burgers de cada usuario
-- UC-10: Personalización de Burger
-- UC-11: Envío de Comanda
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bread TEXT,
  doneness TEXT,
  toppings TEXT[] DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 4. TABLE: stats
-- Contador global del evento
-- UC-04: Cheve-Meter Global
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cheves INT DEFAULT 0,
  participants INT DEFAULT 7,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. TABLE: messages
-- Mensajes entre amigos durante el evento
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. TABLE: surveys
-- Encuesta de calidad post-evento (5 preguntas)
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  q1 TEXT,
  q2 TEXT,
  q3 TEXT,
  q4 TEXT,
  q5 TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(uid)
);

-- 7. INDEX para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_quinielas_uid ON quinielas(uid);
CREATE INDEX IF NOT EXISTS idx_orders_uid ON orders(uid);
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_uid ON surveys(uid);

-- 8. REALTIME SUBSCRIPTIONS
-- Habilitar replicación en tiempo real para estas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE quinielas;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE stats;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE surveys;

-- Insertar un registro inicial de stats
INSERT INTO stats (cheves, participants) VALUES (0, 7) ON CONFLICT DO NOTHING;
