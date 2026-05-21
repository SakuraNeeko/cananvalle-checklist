-- ============================================================
--  CANANVALLE Check List Cultivo — Esquema de base de datos
--  Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Tabla principal de reportes
CREATE TABLE IF NOT EXISTS reports (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  finca      TEXT        NOT NULL,
  semana     INTEGER     NOT NULL CHECK (semana BETWEEN 1 AND 52),
  year       INTEGER     NOT NULL CHECK (year >= 2024),
  closed     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at  TIMESTAMPTZ,
  -- areas guarda toda la estructura de áreas, filas, criterios y firmas (base64)
  areas      JSONB       NOT NULL DEFAULT '{}'::jsonb
);

-- 2. Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_reports_finca   ON reports (finca);
CREATE INDEX IF NOT EXISTS idx_reports_semana  ON reports (semana, year);
CREATE INDEX IF NOT EXISTS idx_reports_closed  ON reports (closed);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports (created_at DESC);

-- 3. Seguridad: habilitar RLS (Row Level Security)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de acceso
--    Por ahora: acceso público (cualquiera con la anon key puede leer/escribir).
--    Cuando quieras agregar autenticación, modifica estas políticas.

-- Permitir lectura
CREATE POLICY "Lectura pública de reportes"
  ON reports FOR SELECT
  USING (true);

-- Permitir inserción
CREATE POLICY "Inserción pública de reportes"
  ON reports FOR INSERT
  WITH CHECK (true);

-- Permitir actualización
CREATE POLICY "Actualización pública de reportes"
  ON reports FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Permitir eliminación (opcional, comenta si no la quieres)
CREATE POLICY "Eliminación pública de reportes"
  ON reports FOR DELETE
  USING (true);

-- ============================================================
--  Listo. La tabla 'reports' almacena cada reporte semanal.
--  El campo 'areas' (JSONB) contiene toda la información de
--  colaboradores, criterios, observaciones y firmas (base64).
-- ============================================================
