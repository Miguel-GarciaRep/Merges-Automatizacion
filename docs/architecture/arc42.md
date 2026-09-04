# CoreShop — Documentación de arquitectura (arc42)

**Versión:** 1.0  
**Fecha:** 4 de septiembre de 2026  
**Contexto:** Proyecto académico SENA  
**Alcance:** aplicación web frontend de e-commerce de hardware y servicios técnicos.

> Esta documentación describe la arquitectura que realmente implementa CoreShop en su estado actual. No se presenta PostgreSQL, una API de negocio ni un proveedor de pagos como componentes existentes, porque el proyecto actual funciona como frontend estático con `localStorage`.

## 1. Introducción y metas

CoreShop permite explorar hardware, filtrar productos, añadir productos o servicios a un carrito, crear pedidos, consultar el historial, enviar solicitudes de contacto y simular autenticación.

### Metas funcionales

- Navegación clara entre Inicio, Productos, Servicios, Pedidos y Contacto.
- Catálogo filtrable por nombre, marca, precio y categoría.
- Carrito con cantidades y total.
- Creación y consulta de pedidos.
- Registro, inicio de sesión y sesión persistente simulada.
- Flujo reproducible de validación automática y despliegue mediante GitHub Actions.

### Metas de calidad

- **Mantenibilidad:** separar modelo, vista y controlador.
- **Operabilidad:** disponer de CI para detectar errores de sintaxis antes de desplegar.
- **Trazabilidad:** documentar decisiones mediante ADR.
- **Portabilidad:** ejecutar como sitio estático con un servidor HTTP sencillo.

## 2. Restricciones

- Frontend únicamente: HTML5, CSS3 y JavaScript ES6+ sin framework.
- Persistencia local mediante `localStorage`; no existe base de datos ni backend.
- Autenticación social simulada; no existe OAuth real.
- Pago y envío son datos simulados dentro del flujo de compra.
- El proyecto debe poder desplegarse en GitHub Pages como sitio estático.
- El contexto es académico; no se pretende procesar datos financieros o credenciales reales.

## 3. Contexto y alcance

### Actores

- **Cliente:** consulta productos/servicios y crea pedidos.
- **Navegador:** ejecuta toda la lógica frontend y mantiene `localStorage`.
- **GitHub Actions:** valida el repositorio y despliega en GitHub Pages.

### Fuera de alcance

Contabilidad, nómina, inventario centralizado, pasarela de pagos real, mensajería transaccional, API propia y administración multiusuario en servidor.

## 4. Estrategia de solución

La solución sigue una arquitectura frontend modular con patrón **MVC**:

```text
HTML páginas
    │
    ▼
Controllers ─────► Views
    │                 │
    ▼                 ▼
Models ◄────────── DOM
    │
    ▼
localStorage
```

Cada página importa únicamente el controlador que necesita. Los modelos concentran acceso a datos y reglas básicas; las vistas renderizan la interfaz; los controladores coordinan eventos y flujo.

## 5. Bloques de construcción

### Nivel de páginas

- `index.html`: inicio.
- `productos.html`: catálogo.
- `servicios.html`: servicios técnicos.
- `pedidos.html`: carrito e historial.
- `comprar.html`: checkout.
- `contacto.html`: soporte.
- `login.html` y `registro.html`: autenticación simulada.

### Modelos

`ProductModel`, `ServiceModel`, `CartModel`, `OrderModel`, `UserModel`, `ContactModel`.

### Vistas

`NavbarView`, `ProductsView`, `ServicesView`, `CartView`, `OrdersView`, `CheckoutView`, `AuthView`, `ContactView`.

### Controladores

`AppController`, `HomeController`, `ProductsController`, `ServicesController`, `CartController`, `CheckoutController`, `OrdersController`, `AuthController`, `ContactController`.

### Utilidad transversal

`js/utils/storage.js` encapsula lectura, escritura y eliminación en `localStorage`.

## 6. Vista de ejecución

### Escenario principal: compra

```text
Usuario
  │
  ▼
ProductosView ──► ProductsController
                      │
                      ▼
                  ProductModel
                      │
                      ▼
                   CartModel
                      │
                      ▼
                 comprar.html
                      │
                      ▼
              CheckoutController
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
       UserModel           OrderModel
            │                   │
            └──────► localStorage ◄───┘
```

El proyecto no bloquea cupos de inventario en servidor ni autoriza pagos reales; esas capacidades corresponden a una futura evolución del sistema.

## 7. Vista de despliegue

```text
Desarrollador
     │ git push / pull request
     ▼
Repositorio GitHub
     │
     ▼
GitHub Actions
  ┌──┴─────────────┐
  │ validar        │
  │ checkout       │
  │ npm ci         │
  │ npm test       │
  └──────┬─────────┘
         │ si pasa en main
         ▼
GitHub Pages
         │
         ▼
Navegador del usuario
```

Los ambientes considerados son **validación CI** y **producción estática en GitHub Pages**.

## 8. Conceptos transversales

- **Estado:** `localStorage` para catálogo inicial, carrito, pedidos, usuarios, sesión y contactos.
- **Navegación protegida:** `AppController` redirige a login en páginas privadas.
- **Validación de formularios:** HTML5 y validaciones de dominio básicas en modelos/controladores.
- **Sincronización de UI:** eventos `storage` y `visibilitychange` actualizan carrito y pedidos.
- **Automatización:** cada push a `main` y pull request se valida; solo `main` despliega.
- **Trazabilidad:** ADR para decisiones que afectan mantenimiento, persistencia y despliegue.

## 9. Decisiones arquitectónicas

Las decisiones se mantienen separadas como ADR para registrar contexto, alternativas y consecuencias:

- [ADR-001 — MVC frontend modular](adr/ADR-001-mvc-frontend-modular.md)
- [ADR-002 — localStorage como persistencia](adr/ADR-002-localstorage-persistencia.md)
- [ADR-003 — GitHub Actions + GitHub Pages](adr/ADR-003-github-actions-pages.md)

## 10. Calidad

### Escenario 1 — validación automática

**Dado** un cambio JavaScript, **cuando** se ejecuta `npm test`, **entonces** todos los archivos `.js` deben pasar `node --check` y existir las páginas, documentación y marcadores críticos del workflow.

### Escenario 2 — acceso protegido

**Dado** un usuario no autenticado, **cuando** intenta abrir Productos, Servicios, Pedidos o Contacto, **entonces** `AppController` debe redirigir a `login.html` con una ruta de retorno permitida.

### Escenario 3 — continuidad del carrito

**Dado** un carrito con productos, **cuando** la vista se oculta y vuelve a ser visible, **entonces** `CartController` debe volver a renderizar el contenido desde `localStorage`.

### Indicadores verificables

- 100% de los `.js` del proyecto pasan verificación de sintaxis en CI.
- Las 8 páginas HTML requeridas existen.
- El workflow contiene validación y despliegue condicionado a `validar`.
- Las 12 secciones arc42 y 3 ADR están presentes en el repositorio.

## 11. Riesgos y deuda técnica

| Riesgo / deuda | Impacto | Estado / mitigación |
|---|---|---|
| Credenciales simuladas en `localStorage` | Alto si se reutiliza para producción | Aceptado solo para prototipo académico; requiere backend + hash seguro para producción. |
| Datos no compartidos entre dispositivos | Medio | Limitación explícita del alcance actual. |
| Sin backend ni base central | Medio | Adecuado para demo estática; migración futura a API/DB. |
| Pagos simulados | Alto si se interpreta como comercio real | Documentado como fuera de alcance. |
| Catálogo inicial embebido en JS | Bajo/medio | Adecuado para prototipo; migrar a fuente administrable después. |

## 12. Glosario

- **Producto:** componente físico disponible en catálogo.
- **Servicio:** trabajo técnico ofrecido por CoreShop.
- **Carrito:** colección temporal de productos/servicios antes del checkout.
- **Pedido:** registro persistido generado desde el carrito.
- **Sesión:** estado de usuario autenticado simulado.
- **MVC:** separación entre Modelo, Vista y Controlador.
- **CI:** integración continua; validación automática de cambios.
- **CD:** entrega/despliegue automático después de una validación exitosa.
- **ADR:** Architecture Decision Record; registro del porqué de una decisión.
- **GitHub Pages:** mecanismo de publicación estática usado por el proyecto.
