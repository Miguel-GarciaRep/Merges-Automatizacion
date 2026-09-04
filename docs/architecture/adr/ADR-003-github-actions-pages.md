# ADR-003 — GitHub Actions para CI y GitHub Pages para despliegue

**Estado:** Aceptada  
**Fecha:** 4 de septiembre de 2026

## Contexto

El proyecto es estático y ya vive en GitHub. Se necesita demostrar repositorio, automatización, validación y despliegue sin agregar infraestructura de servidor.

## Opciones consideradas

1. Verificación y publicación manual.
2. GitHub Actions para validar y GitHub Pages para publicar.
3. Servidor de aplicaciones externo.

## Decisión

Usar **GitHub Actions** para CI y **GitHub Pages** para CD. Pull requests y cambios en `main` ejecutan validación; solo `main` habilita el despliegue.

## Consecuencias

**Beneficios:** flujo reproducible, trazabilidad y publicación estática automática.  
**Costos:** dependencia del servicio GitHub y necesidad de configurar Pages en el repositorio.  
**Seguimiento:** agregar pruebas funcionales de navegador cuando el alcance del proyecto lo justifique.
