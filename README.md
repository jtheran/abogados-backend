# 📚 Sistema de Gestión de Casos Legales

Aplicación web para abogados en Colombia que permite administrar casos, documentos, citas, eventos, notificaciones y usuarios.  
El backend está desarrollado en **Node.js** con **Express**, **Prisma ORM** y base de datos **SQL Server**.  

La API cuenta con documentación generada en **Swagger** para facilitar las pruebas y la integración.

---

## 🚀 Tecnologías utilizadas

- **Node.js** + **Express** → Backend y API REST.
- **Prisma ORM** → Modelado y acceso a la base de datos.
- **SQL Server** → Base de datos relacional.
- **Swagger** → Documentación interactiva de endpoints.
- **Zod** + **Validator.js** → Validación de datos.
- **TypeScript** (opcional, recomendado).

---

## 🗂️ Esquema de Base de Datos

### Usuario
- `id` (UUID, PK)  
- `nombre`  
- `tarjetaProfesional` (único)  
- `email` (único)  
- `telefono`  
- `rol` (admin, abogado, asistente, cliente)  
- `documento` (único)  
- `tipoDocumento`  
- `passwordHash`  
- `estado` (booleano, activo/inactivo)  
- `fechaRegistro`  

Relaciones:  
- Tiene muchos **casos** (como abogado principal).  
- Puede crear **documentos, eventos, citas, notificaciones, logs**.  

---

### Caso
- `id` (UUID, PK)  
- `titulo`  
- `descripcion`  
- `estado` (abierto, cerrado, en proceso)  
- `fechaInicio`  
- `fechaCierre`  

Relaciones:  
- Varios **usuarios** (relación N:M con abogados o clientes).  
- Tiene muchos **documentos, eventos, citas, notificaciones**.  

---

### Documento
- `id` (UUID, PK)  
- `nombre`  
- `rutaArchivo`  
- `tipo` (memorial, contrato, prueba, sentencia)  
- `fechaSubida`  

Relaciones:  
- Pertenece a un **caso**.  
- Subido por un **usuario**.  

---

### Evento
- `id` (UUID, PK)  
- `titulo`  
- `descripcion`  
- `fechaEvento`  

Relaciones:  
- Pertenece a un **caso**.  
- Creado por un **usuario**.  

---

### Cita
- `id` (UUID, PK)  
- `fechaCita`  
- `lugar`  
- `descripcion`  
- `participantes` (string serializado)  

Relaciones:  
- Pertenece a un **caso**.  
- Creado por un **usuario**.  

---

### Notificación
- `id` (UUID, PK)  
- `tipo` (email, whatsapp, sistema)  
- `mensaje`  
- `estado` (pendiente, enviado, error)  
- `fechaEnvio`  

Relaciones:  
- Pertenece a un **usuario**.  
- Puede estar vinculada a un **caso**.  

---

### Log
- `id` (UUID, PK)  
- `accion`  
- `descripcion`  
- `fecha`  

Relaciones:  
- Pertenece a un **usuario**.  

---

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/gestion-casos-legales.git
   cd gestion-casos-legales
