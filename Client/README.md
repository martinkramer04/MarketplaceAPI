# BigBox Marketplace API - Frontend (Grupo 14)

Este proyecto corresponde al desarrollo de la capa de Frontend de la plataforma de regalos de experiencias BigBox, estructurado bajo el paradigma de una Single Page Application (SPA).

## 🛠️ Arquitectura y Tecnologías Utilizadas

* **React**: Librería principal para la interfaz de usuario, basada en componentes reutilizables y gestión de estados dinámicos.
* **Vite**: Entorno de desarrollo moderno y empaquetador de módulos de alta velocidad (con HMR nativo).
* **React Router DOM**: Gestor de enrutamiento dinámico en el cliente, permitiendo simular múltiples vistas dentro de un único archivo de entrada `index.html`.
* **CSS3**: Estilos adaptados con diseño responsivo para soportar dispositivos móviles y computadoras de escritorio.

## ⚙️ Características Clave Implementadas

* **Vidriera y Filtros Dinámicos**: Buscador y filtrado en tiempo real de cajas de experiencias gastronómicas, de aventura y bienestar.
* **Flujo de Compra Optimizado**: Migración de la caja de cupones de descuento al resumen de la orden (`OrderSummary`) según la retroalimentación de experiencia de usuario (UX).
* **Paneles de Gestión Interactivos**: Vistas especializadas para los roles de Administrador y Proveedor (incluyendo simulación interactiva mediante estados de React para la aprobación y suspensión de cuentas).

## 🚀 Instrucciones para ejecutar el proyecto localmente

Dado que el proyecto se entrega sin la carpeta `node_modules` por razones de optimización de peso del archivo comprimido, siga estos pasos para inicializarlo:

1. **Instalar dependencias:**
   Abra la terminal en la raíz de la carpeta del proyecto y descargue las librerías necesarias con:
   ```bash
   npm install
2. **Levantar el servidor local:**
Una vez completada la instalación de los módulos, ejecute el servidor de desarrollo de Vite:
    Bash
    npm run dev
3. **Acceso al sistema:**
    Haga clic en la dirección local provista por la consola (habitualmente http://localhost:5173).
4. **Integrantes**
    [Kramer Martin]
    [Mariano Moretti]
    [German Picas]
