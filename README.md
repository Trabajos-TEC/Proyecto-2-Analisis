# Coloración de Grafos - Proyecto #2

Implementación de algoritmos probabilísticos para el problema de coloración de grafos utilizando Monte Carlo y Las Vegas, con técnicas de búsqueda local y visualización interactiva en React.

## Descripción del Proyecto

La coloración de grafos es un problema clásico de la teoría de grafos que consiste en asignar colores a los vértices de un grafo de tal manera que no haya dos vértices adyacentes con el mismo color, utilizando el mínimo número de colores posible.

Este proyecto implementa:
- **Algoritmo Monte Carlo**: Ejecuta un número limitado de iteraciones con coloración aleatoria
- **Algoritmo Las Vegas**: Garantiza encontrar una solución válida mediante iteraciones indefinidas
- **Recoloración Manual Inteligente**: Análisis de probabilidad para optimizar cambios de color
- **Búsqueda Local Greedy**: Optimización automática de coloraciones conflictivas
- **Hill Climbing**: Estrategia de escalada para explorar mejores soluciones
- **Evaluación del Impacto de K**: Análisis comparativo del número óptimo de colores
- **Visualización interactiva**: Canvas API para mostrar grafos con detección de conflictos
- **Gráficos en tiempo real**: Evolución de conflictos con zoom y tooltips interactivos

## Integrantes

- **Elian J. Trejos Quirós** - 2024143262
- **Owen Caleb Smith Cerdas** - 2024083328
- **Keyner Andrey Cerdas Morales** - 2024108270

**Curso**: Análisis de Algoritmos  
**Semestre**: II Semestre 2025  

## Enlace de despliegue

La aplicación está desplegada y disponible en:

🔗 **[https://coloraciongrafos.netlify.app/](https://coloraciongrafos.netlify.app/)**

## Características Principales

### Algoritmos Implementados

1. **Monte Carlo**
   - Iteraciones limitadas (configurable por el usuario)
   - Estadísticas de éxito probabilístico
   - Análisis de conflictos por iteración
   - No garantiza solución válida

2. **Las Vegas**
   - Iteraciones hasta encontrar solución válida
   - Garantiza coloración correcta (0 conflictos)
   - Tiempo de ejecución variable
   - 100% de éxito asegurado

3. **Búsqueda Local**
   - **Greedy**: Selecciona nodo con más conflictos y encuentra mejor color
   - **Hill Climbing**: Explora todas las recoloraciones posibles
   - Métricas de mejora y convergencia
   - Aplicable post-ejecución de algoritmos probabilísticos


## Tecnologías Utilizadas

- **React** 19.1.1
- **Vite** 7.1.7
- **JavaScript ES6+**
- **Canvas API**
- **CSS3** 
- **Netlify**

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 20 o superior)
- npm (incluido con Node.js)

### Instrucciones

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Trabajos-TEC/Proyecto-2-Analisis.git
   cd Proyecto-2-Analisis
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173/`

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Vista previa de producción:**
   ```bash
   npm run preview
   ```

## Uso de la Aplicación

### 1. Crear un Grafo

**Opción 1: Aleatorio**
- Ingrese número de nodos (60-160) y colores (3-n)
- Click en "Crear aleatorio"
- El sistema genera conexiones automáticas evitando nodos aislados

**Opción 2: Manual**
- Ingrese número de nodos y colores
- Click en "Manual"
- Click en dos nodos para conectarlos

### 2. Ejecutar Algoritmo

- Seleccione "Monte Carlo" o "Las Vegas"
- Click en "Iniciar Simulación"
- Para Monte Carlo: especifique número de iteraciones
- Click en "Ejecutar"

### 3. Análisis de Resultados

- Visualice el grafo coloreado (aristas rojas = conflictos)
- Revise estadísticas: intentos, tiempo, tasa de éxito, conflictos
- Explore el gráfico de evolución de conflictos con zoom

### 4. Optimización Manual

- Identifique nodos conflictivos (botones destacados)
- Seleccione nodo y nuevo color
- Click en "Calcular Probabilidad" para análisis
- Click en "Aplicar Recoloración" para confirmar cambio

### 5. Búsqueda Local Automática

- Click en "Aplicar Búsqueda Local (Optimización Automática)"
- El sistema optimiza automáticamente usando Greedy

### 6. Evaluación de K

- Click en "Mostrar Evaluación del Impacto de k"
- Configure rango de k y número de intentos
- Click en "Ejecutar Evaluación"
- Analice tabla comparativa y insights automáticos
