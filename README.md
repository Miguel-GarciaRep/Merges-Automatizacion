# CoreShop

Tienda web de hardware informático de alto rendimiento. Proyecto frontend con **HTML**, **CSS** y **JavaScript** vanilla, organizado bajo el patrón **Modelo-Vista-Controlador (MVC)**.

## Características

- Tema oscuro con paleta principal **amarillo** y **naranja**, y acentos **azules** en elementos concretos
- Navbar con acceso a todas las secciones: Inicio, Productos, Servicios, Pedidos, Contacto, Registrarse e Iniciar sesión
- Aside funcional en cada sección con contenido relacionado
- Persistencia de datos con `localStorage` (sin base de datos ni API)
- Validaciones HTML5 en formularios
- Animaciones sutiles para mejorar la experiencia de usuario
- Autenticación simulada con correo/contraseña y proveedores sociales (Google, GitHub, Microsoft)

## Secciones

| Página | Descripción |
|--------|-------------|
| **Inicio** | Landing page con hero, estadísticas animadas, ventajas y llamada a la acción |
| **Productos** | Catálogo con filtros por nombre, marca y rango de precio |
| **Servicios** | Ensamblaje, overclocking, refrigeración líquida y diagnóstico de hardware |
| **Pedidos** | Historial con nombre, precio, stock, descripción y destino de envío |
| **Contacto** | Formulario de soporte técnico con mensajes guardados en el aside |
| **Login / Registro** | Acceso con credenciales o proveedores sociales simulados |

## Estructura del proyecto

```
CoreShop/
├── index.html
├── productos.html
├── servicios.html
├── pedidos.html
├── contacto.html
├── login.html
├── registro.html
├── css/
│   └── style.css
└── js/
    ├── models/
    │   ├── ProductModel.js
    │   ├── OrderModel.js
    │   ├── UserModel.js
    │   ├── ContactModel.js
    │   └── ServiceModel.js
    ├── views/
    │   ├── NavbarView.js
    │   ├── ProductsView.js
    │   ├── OrdersView.js
    │   ├── ContactView.js
    │   ├── ServicesView.js
    │   └── AuthView.js
    ├── controllers/
    │   ├── AppController.js
    │   ├── HomeController.js
    │   ├── ProductsController.js
    │   ├── OrdersController.js
    │   ├── ContactController.js
    │   ├── ServicesController.js
    │   └── AuthController.js
    └── utils/
        └── storage.js
```

## Arquitectura MVC

- **Modelo** (`js/models/`): Gestiona los datos y la persistencia en `localStorage`.
- **Vista** (`js/views/`): Renderiza el DOM y define la interfaz de cada sección.
- **Controlador** (`js/controllers/`): Conecta modelos y vistas, maneja eventos y la lógica de negocio.

Cada página HTML carga únicamente el controlador que necesita mediante módulos ES6 (`type="module"`).

## Cómo ejecutar el proyecto

El proyecto usa módulos JavaScript ES6, por lo que **no funciona abriendo los archivos HTML directamente** (`file://`). Se requiere un servidor local.

### Opción 1: Python

```bash
cd CoreShop
python -m http.server 3456
```

Abre [http://localhost:3456](http://localhost:3456) en el navegador.

### Opción 2: Live Server

Usa la extensión **Live Server** de VS Code o Cursor y abre `index.html` con "Go Live".

## Flujo de uso

1. **Registrarse** o **iniciar sesión** desde el navbar.
2. En **Productos**, filtra el catálogo y añade artículos a pedidos.
3. En **Pedidos**, consulta los detalles y guarda el destino de envío.
4. En **Servicios**, reserva un servicio (se añade automáticamente a pedidos).
5. En **Contacto**, envía un ticket de soporte (visible en el aside).

## Datos en localStorage

| Clave | Contenido |
|-------|-----------|
| `coreshop_products` | Catálogo de productos |
| `coreshop_orders` | Pedidos del usuario |
| `coreshop_users` | Usuarios registrados |
| `coreshop_session` | Sesión activa |
| `coreshop_contacts` | Mensajes de contacto enviados |

## Calidad y documentación de arquitectura

La arquitectura del proyecto está documentada con una estructura **arc42 de 12 secciones** y decisiones mediante **ADR** en `docs/architecture/`.

- `docs/architecture/arc42.md`: contexto, restricciones, solución, bloques, ejecución, despliegue, conceptos transversales, decisiones, calidad, riesgos y glosario.
- `docs/architecture/adr/`: ADR-001 MVC, ADR-002 `localStorage` y ADR-003 GitHub Actions + GitHub Pages.
- `npm test`: valida sintaxis JavaScript, páginas requeridas, estructura documental y elementos críticos del workflow.

## Integración y despliegue continuos

`.github/workflows/deploy.yaml` ejecuta las validaciones en `pull_request` y `push` sobre `main`. El despliegue a GitHub Pages solo se realiza cuando la validación termina correctamente sobre `main`.

## Tecnologías

- HTML5
- CSS3 (variables CSS, Grid, Flexbox, animaciones)
- JavaScript ES6+ (módulos, clases, arrow functions)
- localStorage API

## Autor

Proyecto académico — CoreShop © 2026
