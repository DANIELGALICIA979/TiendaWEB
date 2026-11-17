# Arquitectura de Navegación y Secuencia Actualizada de Pantallas — Nexus Keys

A continuación se presenta el flujo completo y secuencial de la plataforma **Nexus Keys**, integrando todas las páginas creadas en las últimas iteraciones (Catálogo Completo con Filtros, Detalle del Producto, Resultado/Confirmación de Pago, y la Bóveda de Claves).

---

## 1. Diagrama del Recorrido del Usuario (*User Journey*)

```
[ Visitante / No Autenticado ]
       │
       ├──► 01. Tienda Principal / Home (Landing de Lanzamientos y Ofertas)
       │          │
       │          ├──► 02. Catálogo Completo & Filtros Avanzados
       │          │          │
       │          │          └──► 03. Detalle del Producto & Especificaciones
       │          │                     │
       │          │                     └──► [ Agregar al Carrito ] ──┐
       │          │                                                   │
       │          ├──► 04. Registro de Nuevo Usuario ─────────────────┤
       │          ├──► 05. Login & Autenticación ─────────────────────┤
       │          │          │                                        │
       │          │          └──► 05B. Recuperación de Contraseña     │
       │          │                                                   │
       │          ▼                                                   ▼
[ Checkout & Adquisición ] ◄──────────────────────────────────────────┘
       │
       └──► 06. Carrito de Compras & Pago (Pasarelas: Tarjeta, PayPal, Cripto)
                  │
                  ▼
       07. Confirmación de Pago & Estado de Orden (Validación de Transacción)
                  │
                  ▼  (Clic en "Ver mis Claves en la Bóveda")
       08. Historial & Bóveda de Claves Digitales (Revelar/Copiar Keys y Guías)

[ Área de Gestión / Backoffice ]
       │
       └──► 09. Panel Administrador & Gestión de Ventas (KPIs, Catálogo y Batch CSV)
```

---

## 2. Secuencia Detallada Paso a Paso

### **Fase 1: Descubrimiento y Exploración**

#### **Paso 1: Tienda Principal (`Web - Tienda Principal & Catálogo`)**
* **Objetivo:** Página de aterrizaje (*Home*). Presenta títulos destacados (hero banners), novedades y accesos rápidos por plataforma (*Steam, PlayStation, Xbox, Nintendo*).
* **Viene de:** Acceso directo a la URL de la web.
* **Va hacia:** Catálogo completo, Detalle del producto, Carrito, Registro o Login.

#### **Paso 2: Catálogo Completo & Filtros Avanzados (`Web - Catálogo Completo & Filtros`)** *(NUEVA)*
* **Objetivo:** Búsqueda exhaustiva y filtrado granular de todo el inventario de la tienda.
* **Elementos clave:** Barra predictiva con atajo `ESC`, filtros facetados laterales (DRM/Plataformas con conteos en vivo, selector de precio $0-$100, región de cifrado, tags/géneros), ordenamiento por popularidad o precio, y badges de descuento.
* **Viene de:** Barra de navegación superior o clic en *"Ver catálogo completo"* desde la Tienda Principal.
* **Va hacia:** Detalle del Producto (`Ver Ficha`) o directo al Carrito (`Bóveda / Comprar`).

#### **Paso 3: Detalle del Producto & Especificaciones (`Web - Detalle del Producto & Especificaciones`)** *(NUEVA)*
* **Objetivo:** Página individual de decisión técnica y de compra de un videojuego.
* **Elementos clave:**
  * Selector de **Plataforma** (*Steam, GOG, PS5, Xbox*).
  * Selector de **Región** (detección de nodo IP sin VPN).
  * Selector de **Edición** (*Standard, Deluxe Neural, Collector Core*).
  * Ficha técnica facetada: *Descripción & Lore*, *Requisitos de Sistema (PC)*, *Compatibilidad & Hardware* (Steam Deck/mandos) y *Protocolo de Activación*.
  * Stock en vivo, calificaciones de compradores (4.9/5) y garantía oficial de distribuidor.
* **Viene de:** Tienda Principal o Catálogo Completo.
* **Va hacia:** Carrito de Compras (`Añadir al Carrito` o `Comprar Licencia Inmediata`).

---

### **Fase 2: Identificación y Cuentas**

#### **Paso 4: Registro de Nuevo Usuario (`Web - Registro de Nuevo Usuario`)**
* **Objetivo:** Alta de nueva cuenta (Gamertag, Correo electrónico, Contraseña segura y Confirmación de contraseña).
* **Viene de:** Botón "Registrarse" en el header o prompt durante el checkout.
* **Va hacia:** Tienda Principal o Carrito con sesión iniciada.

#### **Paso 5: Login & Autenticación (`Web - Login & Autenticación`)**
* **Objetivo:** Inicio de sesión para usuarios registrados.
* **Viene de:** Botón "Iniciar Sesión" en el header.
* **Va hacia:** Tienda Principal, Carrito o Bóveda de Claves.

#### **Paso 5B: Recuperación de Contraseña (`Web - Recuperación de Contraseña`)**
* **Objetivo:** Envío de token temporal de restablecimiento por correo.
* **Viene de:** Enlace "¿Olvidaste tu contraseña?" en la pantalla de Login.
* **Va hacia:** Retorno a Login tras validar el token.

---

### **Fase 3: Transacción y Verificación**

#### **Paso 6: Carrito de Compras & Pago (`Web - Carrito de Compras & Pago`)**
* **Objetivo:** Revisión de las licencias agregadas, aplicación de cupones y selección de método de pago (Tarjeta, PayPal o Cripto USDT/BTC).
* **Viene de:** Botón de carrito desde la barra superior, Catálogo o Detalle de Producto.
* **Va hacia:** Confirmación de Pago & Estado de Orden.

#### **Paso 7: Confirmación de Pago & Estado de Orden (`Web - Confirmación de Pago & Estado de Orden`)** *(NUEVA / ACTUALIZADA)*
* **Objetivo:** Validación oficial y transparente de la pasarela de pago antes de despachar licencias.
* **Elementos clave:**
  * Estado de transacción verificado (**¡Orden Confirmada y Liquidada!**).
  * Ficha de la orden: N° de Orden (`#NX-984210`), fecha/hora UTC, método de pago y monto total.
  * Botón CTA prioritario en cian: **"Ver mis Claves en la Bóveda de Licencias"** (redirige al Paso 8).
  * Opciones secundarias: Descargar comprobante PDF o volver a la tienda.
* **Viene de:** Carrito de Compras tras procesar el pago.
* **Va hacia:** Historial & Bóveda de Claves Digitales (Paso 8).

---

### **Fase 4: Entrega de Licencias y Post-Venta**

#### **Paso 8: Historial & Bóveda de Claves Digitales (`Web - Historial & Claves Digitales`)**
* **Objetivo:** Repositorio personal permanente del comprador donde se entregan y consultan las claves adquiridas.
* **Elementos clave:**
  * Listado de licencias con códigos alfanuméricos ocultos bajo botones de **"Revelar"** y **"Copiar"**.
  * Instrucciones y guías de canje para Steam, PlayStation y Xbox.
  * Descarga de recibos PDF e historial histórico de órdenes.
  * Canal de soporte y reclamo de garantía (*Garantía Shield*).
* **Viene de:** Pantalla de Confirmación de Pago (Paso 7) o menú de usuario "Mi Bóveda".
* **Va hacia:** Tienda Principal para seguir explorando.

---

### **Fase 5: Administración Interna**

#### **Paso 9: Panel Administrador & Ventas (`Web - Panel Administrador & Ventas`)**
* **Objetivo:** Dashboard administrativo para operadores de la tienda (telemetría de ingresos, métricas de inventario, monitor de pedidos y carga masiva de seriales vía CSV).
* **Viene de:** Enlace exclusivo de administradores o subdominio interno.

---

## 3. Matriz Resumen Comparativa

| N° | Pantalla | Tipo / Estado | Rol Principal | Pantalla Previa | Siguiente Pantalla |
|:--:|---|:---:|---|---|---|
| **01** | **Tienda Principal & Catálogo (HomePage)** | Existente | Portada / Home | Acceso directo / Navegación | Catálogo, Detalle, Carrito, Login |
| **02** | **Catálogo Completo & Filtros (GameCatalog)** | **NUEVA** | Búsqueda exhaustiva con filtros DRM/Precio | Tienda Principal | Detalle del Producto, Carrito |
| **03** | **Detalle del Producto & Specs** | **NUEVA** | Ficha técnica, ediciones y requisitos | Catálogo o Tienda Principal | Carrito de Compras |
| **04** | **Registro de Nuevo Usuario** | Existente | Registro con usuario y contraseñas | Tienda / Login / Carrito | Tienda / Carrito |
| **05** | **Login & Autenticación** | Existente | Acceso con credenciales | Tienda / Registro / Carrito | Tienda / Bóveda / Carrito |
| **05B**| **Recuperación de Contraseña** | Existente | Recuperación de cuenta por correo | Login | Login |
| **06** | **Carrito de Compras & Pago** | Existente | Checkout y selección de pasarela | Detalle Producto / Tienda | Confirmación de Pago |
| **07** | **Confirmación de Pago & Estado**| **NUEVA** | Validación de orden (#NX-984210) | Carrito de Compras | Bóveda de Claves (Paso 08) |
| **08** | **Historial & Bóveda de Claves** | Existente | Entrega y revelación de seriales | Confirmación de Pago | Activación en Steam/PSN/Xbox |
| **09** | **Panel Administrador & Ventas**| Existente | Backoffice, KPIs y carga de keys | Menú Admin / Acceso interno | Gestión interna |
