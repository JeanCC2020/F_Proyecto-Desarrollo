-- 0. Limpieza previa 
DROP TABLE IF EXISTS historial_incidencias CASCADE;
DROP TABLE IF EXISTS incidencias CASCADE;
DROP TABLE IF EXISTS tecnicos CASCADE;
DROP TABLE IF EXISTS equipos CASCADE;

-- 1. Tabla de Equipos 
CREATE TABLE equipos (
    codigo TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    area TEXT NOT NULL
);

-- 2. Tabla de Técnicos Operativos
CREATE TABLE tecnicos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    especialidad TEXT,
    capacidad_maxima INTEGER DEFAULT 5,
    tareas_actuales INTEGER DEFAULT 0
);

-- 3. Tabla de Incidencias
CREATE TABLE incidencias (
    id TEXT PRIMARY KEY,
    codigo_equipo TEXT REFERENCES equipos(codigo),
    problema TEXT NOT NULL,
    usuario_responsable TEXT,
    registrado_por TEXT,
    fecha_hora TIMESTAMPTZ DEFAULT NOW(),
    estado TEXT DEFAULT 'Pendiente', 
    informe_tecnico TEXT,
    repuesto_solicitado TEXT
);

-- 4. Tabla de Historial (Trazabilidad y Auditoría)
CREATE TABLE historial_incidencias (
    id BIGSERIAL PRIMARY KEY,
    incidencia_id TEXT REFERENCES incidencias(id) ON DELETE CASCADE,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    evento TEXT NOT NULL
);

-- Habilitamos RLS para demostrar buenas prácticas de seguridad
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_incidencias ENABLE ROW LEVEL SECURITY;

-- Creamos políticas para que el rol 'anon' pueda operar
CREATE POLICY "Acceso total para API" ON equipos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total para API" ON tecnicos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total para API" ON incidencias FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total para API" ON historial_incidencias FOR ALL TO anon USING (true) WITH CHECK (true);

-- Insertar Equipos Reales
INSERT INTO equipos (codigo, descripcion, area) VALUES
('SOP-L01', 'MacBook Pro M2 - 16GB RAM', 'Desarrollo'),
('SOP-L02', 'Dell XPS 15 - 32GB RAM', 'Diseño'),
('SOP-D01', 'Workstation HP Z4 - i9', 'Data Science'),
('SOP-I01', 'Impresora Láser Xerox B230', 'Administración'),
('SOP-M01', 'Monitor LG Ultrawide 34"', 'Marketing');

-- Insertar Técnicos
INSERT INTO tecnicos (id, nombre, especialidad, capacidad_maxima, tareas_actuales) VALUES
('T-CARLOS', 'Carlos Tecnico', 'Hardware & Laptops', 5, 0),
('T-ANA', 'Ana Especialista', 'Sistemas Operativos', 3, 0),
('T-ROBERTO', 'Roberto Redes', 'Conectividad & Redes', 4, 0);

-- Insertar Incidencia de Prueba
INSERT INTO incidencias (id, codigo_equipo, problema, usuario_responsable, registrado_por, estado) 
VALUES ('INC-DEMO', 'SOP-L01', 'Prueba inicial del sistema', 'Admin', 'Sistema', 'Pendiente');

INSERT INTO historial_incidencias (incidencia_id, evento) 
VALUES ('INC-DEMO', 'Incidencia de demostración creada');
