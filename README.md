# Pastelería Brenda B3stia's Cake

Sitio web para la pastelería "Brenda B3stia's Cake" con funcionalidades de pedidos personalizados y panel de administrador.

## Características Principales

### 🎂 Pedidos Personalizados
- Formulario completo para pedidos de pasteles personalizados
- Subida de imágenes de referencia
- Validación de campos requeridos
- Almacenamiento local de pedidos para pruebas



### 👑 Panel de Administrador
- Acceso con contraseña (triple clic en el logo)
- Gestión de pedidos con estados (Pendiente, En proceso, Completado, Entregado)
- Vista detallada de pedidos con imágenes
- Estadísticas de pedidos
- Funciones de utilidad para pruebas

## Funcionalidades de Almacenamiento Local

### 📦 Persistencia de Datos
- Los pedidos se guardan automáticamente en localStorage
- Los datos persisten entre recargas de página
- Ideal para pruebas y desarrollo

### 🔧 Funciones de Utilidad
- **Exportar Pedidos como PDF**: Genera y descarga un PDF profesional con todos los pedidos, incluyendo:
  - Información completa de cada pedido
  - Datos del cliente (nombre, email, teléfono)
  - Detalles del pastel (sabor, tamaño, decoración)
  - Fechas de pedido y entrega
  - Estado actual del pedido
  - Mensajes especiales
  - **Imágenes de referencia** (si fueron proporcionadas)
  - Diseño profesional con colores de la marca
  - Múltiples páginas automáticas
- **Limpiar Pedidos**: Elimina todos los pedidos del localStorage
- **Estadísticas**: Muestra estadísticas en tiempo real de los pedidos

### 📊 Estados de Pedidos
- **Pendiente**: Pedido recién recibido
- **En proceso**: Pedido en preparación
- **Completado**: Pastel terminado
- **Entregado**: Pedido entregado al cliente

## Instalación y Uso

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. Para acceder al panel de administrador:
   - Haz triple clic en el logo
   - Ingresa la contraseña: `123`

## Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS y animaciones)
- JavaScript (ES6+)
- Font Awesome (iconos)
- LocalStorage API
- jsPDF (generación de PDFs)
- html2canvas (procesamiento de imágenes)

## Estructura del Proyecto

```
Pasteleria Brenda B3stia's cake/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── Public/
│   └── logo.jpg        # Logo de la pastelería
├── firebase.json       # Configuración de Firebase
├── .firebaserc         # ID del proyecto Firebase
└── README.md           # Este archivo
```

## Funciones JavaScript Principales

### Almacenamiento Local
- `guardarPedidosEnLocalStorage(pedidos)`: Guarda pedidos en localStorage
- `cargarPedidosDesdeLocalStorage()`: Carga pedidos desde localStorage
- `agregarPedidoALocalStorage(pedidoData)`: Agrega un nuevo pedido
- `actualizarEstadoPedidoEnLocalStorage(pedidoId, nuevoEstado)`: Actualiza estado
- `limpiarPedidosLocalStorage()`: Limpia todos los pedidos
- `exportarPedidos()`: Exporta pedidos como PDF con imágenes
- `obtenerEstadisticasPedidos()`: Obtiene estadísticas

### Panel de Administrador
- `openAdminPanel()`: Abre el panel de administrador
- `cargarPedidos()`: Carga y muestra los pedidos
- `verPedido()`: Muestra detalles de un pedido
- `cambiarEstado()`: Cambia el estado de un pedido

### Formularios
- Validación de campos requeridos
- Manejo de archivos de imagen
- Prevención de envío de formularios vacíos

## Notas de Desarrollo

- El proyecto está configurado para Firebase Hosting
- Los pedidos se almacenan localmente para facilitar las pruebas
- El panel de administrador es completamente funcional
- Responsive design para móviles y tablets

## Próximos Pasos

- Integración con base de datos real
- Sistema de autenticación
- Notificaciones en tiempo real
- Pago en línea
- Historial de pedidos por cliente