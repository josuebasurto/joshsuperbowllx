-- Casa Basurto Super Bowl Hub - Supabase Database Schema
-- Ejecuta esto en el SQL Editor de Supabase
-- NOTA: Sin referencias FK - Tablas como colecciones NoSQL

-- 1. TABLE: users
-- Almacena información de los usuarios registrados
-- Nombre de usuario es único (solo 7 personas)
CREATE TABLE IF NOT EXISTS users (
  name TEXT PRIMARY KEY,
  team TEXT CHECK (team IN ('Seahawks', 'Patriots')),
  lastActive TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLE: quinielas
-- Almacena las respuestas de cada usuario en la quiniela
-- Una vez creada, es inmutable (Bloqueo de Respuestas)
-- Sin FK - nombre de usuario como identificador
CREATE TABLE IF NOT EXISTS quinielas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
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
  q16 TEXT,
  q17 TEXT,
  q18 TEXT,
  q19 TEXT,
  q20 TEXT,
  q21 TEXT,
  q22 TEXT,
  q23 TEXT,
  q24 TEXT,
  q25 TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABLE: orders
-- Almacena los pedidos de burgers de cada usuario
-- Sin FK - nombre de usuario como identificador
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bread TEXT,
  doneness TEXT,
  toppings TEXT[] DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 4. TABLE: stats
-- Contador global del evento
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cheves INT DEFAULT 0,
  participants INT DEFAULT 7,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. TABLE: surveys
-- Encuesta de calidad post-evento (5 preguntas)
-- Sin FK - nombre de usuario como identificador
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  q1 TEXT,
  q2 TEXT,
  q3 TEXT,
  q4 TEXT,
  q5 TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. INDEX para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_quinielas_name ON quinielas(name);
CREATE INDEX IF NOT EXISTS idx_orders_name ON orders(name);
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_name ON surveys(name);

-- 7. REALTIME SUBSCRIPTIONS
-- Habilitar replicación en tiempo real para estas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE quinielas;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE stats;
ALTER PUBLICATION supabase_realtime ADD TABLE surveys;

-- Insertar un registro inicial de stats
INSERT INTO stats (cheves, participants) VALUES (0, 7) ON CONFLICT DO NOTHING;
