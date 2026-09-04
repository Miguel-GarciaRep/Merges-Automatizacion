# ADR-002 — Usar localStorage como mecanismo de persistencia del prototipo

**Estado:** Aceptada para prototipo académico  
**Fecha:** 4 de septiembre de 2026

## Contexto

El alcance actual es un sitio frontend estático desplegable en GitHub Pages, sin backend propio ni base de datos.

## Opciones consideradas

1. Mantener estado solo en memoria.
2. Usar `localStorage` del navegador.
3. Incorporar API + base de datos desde la primera versión.

## Decisión

Usar **`localStorage`** encapsulado por `js/utils/storage.js`.

## Consecuencias

**Beneficios:** implementación simple, persistencia local y cero infraestructura backend.  
**Costos:** datos aislados por navegador/dispositivo, sin concurrencia real y sin seguridad adecuada para credenciales reales.  
**Seguimiento:** para producción, migrar usuarios, pedidos e inventario a una API con almacenamiento seguro.
