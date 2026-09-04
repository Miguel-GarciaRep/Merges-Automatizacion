# ADR-001 — Mantener MVC frontend modular

**Estado:** Aceptada  
**Fecha:** 4 de septiembre de 2026

## Contexto

CoreShop está construido con HTML, CSS y JavaScript vanilla y necesita separar interfaz, datos y lógica de navegación para facilitar mantenimiento académico.

## Opciones consideradas

1. Código JavaScript monolítico por página.
2. Patrón MVC con modelos, vistas y controladores por responsabilidad.
3. Introducir un framework frontend para toda la aplicación.

## Decisión

Se adopta **MVC frontend modular** usando módulos ES6.

## Consecuencias

**Beneficios:** responsabilidades claras, reutilización y trazabilidad entre páginas.  
**Costos:** más archivos y coordinación entre capas.  
**Seguimiento:** mantener las dependencias entre capas simples y evitar lógica de negocio duplicada en vistas.
