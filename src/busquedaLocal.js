/**
 * Módulo de Búsqueda Local y Recoloración
 * Implementa estrategias heurísticas para optimizar la coloración de grafos
 */

/**
 * Nombre: calcularProbabilidadRecoloracion
 * Descripción: Calcula la probabilidad estimada de éxito al recolorear un nodo específico.
 *              Simula el cambio de color y analiza el impacto en los conflictos del grafo.
 *              Considera factores como: reducción de conflictos, vecinos afectados, y
 *              disponibilidad de colores vs grado del nodo.
 * Entradas:
 *   - grafo: Objeto Grafo sobre el cual realizar el análisis
 *   - indiceNodo: Índice del nodo a analizar (0-based)
 *   - nuevoColor: Color en formato hexadecimal que se aplicaría al nodo
 * Salidas:
 *   - Objeto con información detallada:
 *     * probabilidadExito: Porcentaje estimado de éxito (0-100)
 *     * conflictosAntes: Número de conflictos antes del cambio
 *     * conflictosDespues: Número de conflictos después del cambio simulado
 *     * cambioConflictos: Diferencia de conflictos (positivo = mejora)
 *     * vecinosQueNecesitanRecoloreo: Cantidad de vecinos afectados
 *     * vecinosConflictivos: Array con valores de nodos vecinos conflictivos
 *     * mejora: Boolean indicando si reduce conflictos
 *     * empeora: Boolean indicando si aumenta conflictos
 */
export function calcularProbabilidadRecoloracion(grafo, indiceNodo, nuevoColor) {
  if (!grafo || indiceNodo < 0 || indiceNodo >= grafo.nodos.length) {
    return null;
  }

  const nodo = grafo.nodos[indiceNodo];
  const colorOriginal = nodo.color;
  
  // Contar conflictos actuales
  const conflictosAntes = grafo.contarConflictos();
  
  // Simular cambio de color
  nodo.color = nuevoColor;
  const conflictosDespues = grafo.contarConflictos();
  
  // Restaurar color original
  nodo.color = colorOriginal;
  
  // Analizar vecinos afectados
  const vecinosConflictivos = nodo.vecinos.filter(v => v.color === nuevoColor);
  const vecinosQueNecesitanRecoloreo = vecinosConflictivos.length;
  
  // Calcular probabilidad basada en:
  // 1. Reducción de conflictos, 2. Número de colores disponibles vs vecinos, 3. Grado del nodo
  
  const reduccionConflictos = conflictosAntes - conflictosDespues;
  const gradoNodo = nodo.vecinos.length;
  const coloresDisponibles = grafo.k;
  
  // Probabilidad base: colores disponibles vs vecinos
  let probabilidadBase = Math.max(0, (coloresDisponibles - gradoNodo) / coloresDisponibles);
  
  // Ajustar según reducción de conflictos
  if (reduccionConflictos > 0) {
    probabilidadBase += 0.3; // Bonus si reduce conflictos
  } else if (reduccionConflictos < 0) {
    probabilidadBase -= 0.4; // Penalización si aumenta conflictos
  }
  
  // Ajustar según vecinos que necesitan recoloración
  const penalizacionVecinos = vecinosQueNecesitanRecoloreo * 0.15;
  probabilidadBase = Math.max(0, probabilidadBase - penalizacionVecinos);
  
  // Normalizar entre 0 y 1
  const probabilidadExito = Math.min(1, Math.max(0, probabilidadBase));
  
  return {
    probabilidadExito: (probabilidadExito * 100).toFixed(2),
    conflictosAntes,
    conflictosDespues,
    cambioConflictos: reduccionConflictos,
    vecinosQueNecesitanRecoloreo,
    vecinosConflictivos: vecinosConflictivos.map(v => v.valor),
    mejora: conflictosDespues < conflictosAntes,
    empeora: conflictosDespues > conflictosAntes
  };
}

/**
 * Nombre: identificarNodosConflictivos
 * Descripción: Identifica todos los nodos del grafo que tienen al menos un conflicto
 *              (vecinos con el mismo color). Los ordena por número de conflictos
 *              en orden descendente para priorizar los más problemáticos.
 * Entradas:
 *   - grafo: Objeto Grafo a analizar
 * Salidas:
 *   - Array de objetos con información de nodos conflictivos:
 *     * indice: Posición del nodo en el array de nodos del grafo
 *     * valor: Identificador del nodo
 *     * color: Color actual del nodo
 *     * numeroConflictos: Cantidad de vecinos con el mismo color
 *     * grado: Número total de vecinos del nodo
 *     (Ordenado de mayor a menor por numeroConflictos)
 */
export function identificarNodosConflictivos(grafo) {
  const nodosConflictivos = [];
  
  for (let i = 0; i < grafo.nodos.length; i++) {
    const nodo = grafo.nodos[i];
    const conflictos = nodo.vecinos.filter(v => v.color === nodo.color).length;
    
    if (conflictos > 0) {
      nodosConflictivos.push({
        indice: i,
        valor: nodo.valor,
        color: nodo.color,
        numeroConflictos: conflictos,
        grado: nodo.vecinos.length
      });
    }
  }
  
  // Ordenar por número de conflictos (descendente)
  nodosConflictivos.sort((a, b) => b.numeroConflictos - a.numeroConflictos);
  
  return nodosConflictivos;
}

/**
 * Nombre: encontrarMejorColor
 * Descripción: Evalúa todos los colores disponibles para un nodo específico y determina
 *              cuál genera la menor cantidad de conflictos. Prueba cada color de la
 *              paleta del grafo y cuenta los conflictos resultantes.
 * Entradas:
 *   - grafo: Objeto Grafo
 *   - indiceNodo: Índice del nodo a evaluar
 * Salidas:
 *   - Objeto con análisis completo:
 *     * mejorColor: Color que minimiza los conflictos
 *     * conflictosConMejorColor: Número de conflictos con ese color
 *     * colorOriginal: Color previo del nodo
 *     * analisisColores: Array con análisis de cada color disponible
 */
export function encontrarMejorColor(grafo, indiceNodo) {
  const nodo = grafo.nodos[indiceNodo];
  const colorOriginal = nodo.color;
  
  let mejorColor = colorOriginal;
  let menorConflictos = Infinity;
  let analisisColores = [];
  
  for (let color of grafo.listaColores) {
    nodo.color = color;
    const conflictos = contarConflictosNodo(grafo, indiceNodo);
    
    analisisColores.push({
      color,
      conflictos,
      esMejor: conflictos < menorConflictos
    });
    
    if (conflictos < menorConflictos) {
      menorConflictos = conflictos;
      mejorColor = color;
    }
  }
  
  // Restaurar color original
  nodo.color = colorOriginal;
  
  return {
    mejorColor,
    conflictosConMejorColor: menorConflictos,
    colorOriginal,
    analisisColores
  };
}

/**
 * Cuenta conflictos de un nodo específico
 * @param {Grafo} grafo - El grafo
 * @param {number} indiceNodo - Índice del nodo
 * @returns {number} - Número de conflictos
 */
function contarConflictosNodo(grafo, indiceNodo) {
  const nodo = grafo.nodos[indiceNodo];
  return nodo.vecinos.filter(v => v.color === nodo.color).length;
}

/**
 * Nombre: busquedaLocalGreedy
 * Descripción: Implementa una estrategia de búsqueda local voraz (greedy) para optimizar
 *              la coloración del grafo. En cada iteración, identifica el nodo con más
 *              conflictos y le asigna el mejor color posible. Repite hasta resolver
 *              todos los conflictos o alcanzar el límite de iteraciones.
 * Entradas:
 *   - grafo: Objeto Grafo a optimizar (se modifica directamente)
 *   - maxIteraciones: Número máximo de iteraciones permitidas (por defecto 100)
 * Salidas:
 *   - Objeto con resultados del proceso:
 *     * exito: Boolean indicando si se eliminaron todos los conflictos
 *     * iteraciones: Número de iteraciones ejecutadas
 *     * conflictosIniciales: Conflictos al inicio del algoritmo
 *     * conflictosFinales: Conflictos al terminar el algoritmo
 *     * mejora: Reducción absoluta de conflictos
 *     * porcentajeMejora: Porcentaje de mejora respecto a conflictos iniciales
 *     * tiempoEjecucion: Tiempo en milisegundos
 *     * historialConflictos: Array con conflictos en cada iteración
 *     * recoloraciones: Array detallado de cada cambio de color realizado
 */
export function busquedaLocalGreedy(grafo, maxIteraciones = 100) {
  const inicio = performance.now();
  let iteracion = 0;
  let conflictosIniciales = grafo.contarConflictos();
  let historialConflictos = [conflictosIniciales];
  let recoloraciones = [];
  
  while (iteracion < maxIteraciones && grafo.contarConflictos() > 0) {
    const nodosConflictivos = identificarNodosConflictivos(grafo);
    
    if (nodosConflictivos.length === 0) break;
    
    // Seleccionar el nodo con más conflictos
    const nodoProblematico = nodosConflictivos[0];
    const mejorColorInfo = encontrarMejorColor(grafo, nodoProblematico.indice);
    
    // Aplicar mejor color
    const colorAnterior = grafo.nodos[nodoProblematico.indice].color;
    grafo.nodos[nodoProblematico.indice].color = mejorColorInfo.mejorColor;
    
    recoloraciones.push({
      iteracion,
      nodo: nodoProblematico.valor,
      colorAnterior,
      colorNuevo: mejorColorInfo.mejorColor,
      conflictosAntes: historialConflictos[historialConflictos.length - 1],
      conflictosDespues: grafo.contarConflictos()
    });
    
    historialConflictos.push(grafo.contarConflictos());
    iteracion++;
  }
  
  const fin = performance.now();
  const conflictosFinales = grafo.contarConflictos();
  
  return {
    exito: conflictosFinales === 0,
    iteraciones: iteracion,
    conflictosIniciales,
    conflictosFinales,
    mejora: conflictosIniciales - conflictosFinales,
    porcentajeMejora: ((conflictosIniciales - conflictosFinales) / Math.max(conflictosIniciales, 1) * 100).toFixed(2),
    tiempoEjecucion: (fin - inicio).toFixed(2),
    historialConflictos,
    recoloraciones
  };
}

/**
 * Nombre: busquedaLocalHillClimbing
 * Descripción: Implementa el algoritmo de escalada de colinas (Hill Climbing) para
 *              optimización de coloración. Explora ampliamenete todas las posibles
 *              recoloraciones en cada iteración y elige la que produce la mayor mejora.
 *              Se detiene cuando no encuentra mejoras o alcanza el límite de iteraciones.
 * Entradas:
 *   - grafo: Objeto Grafo a optimizar (se modifica directamente)
 *   - maxIteraciones: Número máximo de iteraciones permitidas (por defecto 100)
 * Salidas:
 *   - Objeto con resultados del proceso:
 *     * exito: Boolean indicando si se eliminaron todos los conflictos
 *     * iteraciones: Número de iteraciones ejecutadas
 *     * conflictosIniciales: Conflictos al inicio del algoritmo
 *     * conflictosFinales: Conflictos al terminar el algoritmo
 *     * mejora: Reducción absoluta de conflictos
 *     * porcentajeMejora: Porcentaje de mejora respecto a conflictos iniciales
 *     * tiempoEjecucion: Tiempo en milisegundos
 *     * historialConflictos: Array con conflictos en cada iteración
 *     * recoloraciones: Array detallado de cada cambio de color realizado
 *     * razonParada: Motivo por el cual terminó el algoritmo
 */
export function busquedaLocalHillClimbing(grafo, maxIteraciones = 100) {
  const inicio = performance.now();
  let iteracion = 0;
  let conflictosIniciales = grafo.contarConflictos();
  let historialConflictos = [conflictosIniciales];
  let recoloraciones = [];
  let sinMejora = 0;
  
  while (iteracion < maxIteraciones && grafo.contarConflictos() > 0 && sinMejora < 10) {
    let mejorMejora = null;
    let mejorNodo = null;
    let mejorColor = null;
    
    // Explorar todas las posibles recoloraciones
    for (let i = 0; i < grafo.nodos.length; i++) {
      const nodo = grafo.nodos[i];
      const colorOriginal = nodo.color;
      
      for (let color of grafo.listaColores) {
        if (color === colorOriginal) continue;
        
        nodo.color = color;
        const nuevoConflictos = grafo.contarConflictos();
        const mejora = historialConflictos[historialConflictos.length - 1] - nuevoConflictos;
        
        if (mejorMejora === null || mejora > mejorMejora) {
          mejorMejora = mejora;
          mejorNodo = i;
          mejorColor = color;
        }
        
        nodo.color = colorOriginal;
      }
    }
    
    // Aplicar mejor recoloración encontrada
    if (mejorMejora > 0 && mejorNodo !== null) {
      const colorAnterior = grafo.nodos[mejorNodo].color;
      grafo.nodos[mejorNodo].color = mejorColor;
      
      recoloraciones.push({
        iteracion,
        nodo: grafo.nodos[mejorNodo].valor,
        colorAnterior,
        colorNuevo: mejorColor,
        conflictosAntes: historialConflictos[historialConflictos.length - 1],
        conflictosDespues: grafo.contarConflictos(),
        mejora: mejorMejora
      });
      
      historialConflictos.push(grafo.contarConflictos());
      sinMejora = 0;
    } else {
      sinMejora++;
    }
    
    iteracion++;
  }
  
  const fin = performance.now();
  const conflictosFinales = grafo.contarConflictos();
  
  return {
    exito: conflictosFinales === 0,
    iteraciones: iteracion,
    conflictosIniciales,
    conflictosFinales,
    mejora: conflictosIniciales - conflictosFinales,
    porcentajeMejora: ((conflictosIniciales - conflictosFinales) / Math.max(conflictosIniciales, 1) * 100).toFixed(2),
    tiempoEjecucion: (fin - inicio).toFixed(2),
    historialConflictos,
    recoloraciones,
    razonParada: conflictosFinales === 0 ? 'Solución encontrada' : 
                  sinMejora >= 10 ? 'Sin mejora posible' : 'Límite de iteraciones'
  };
}

/**
 * Nombre: evaluarImpactoK
 * Descripción: Realiza un análisis comparativo del impacto del número de colores (k)
 *              en el rendimiento del algoritmo de búsqueda local. Para cada valor de k
 *              en el rango especificado, ejecuta múltiples muestras y calcula estadísticas
 *              promedio sobre tasa de éxito, tiempo de ejecución y conflictos.
 * Entradas:
 *   - crearGrafoFn: Función que crea un grafo (ej: crearGrafoAleatorio)
 *   - nodos: Número de nodos para los grafos de prueba
 *   - kMin: Valor mínimo de k a evaluar
 *   - kMax: Valor máximo de k a evaluar
 *   - muestras: Número de ejecuciones por cada valor de k (por defecto 5)
 * Salidas:
 *   - Array de objetos con estadísticas por cada valor de k:
 *     * k: Número de colores evaluado
 *     * tasaExito: Porcentaje de éxito promedio
 *     * tiempoPromedio: Tiempo de ejecución promedio en ms
 *     * conflictosPromedio: Conflictos finales promedio
 *     * iteracionesPromedio: Iteraciones promedio necesarias
 */
export function evaluarImpactoK(crearGrafoFn, nodos, kMin, kMax, muestras = 5) {
  const resultados = [];
  
  for (let k = kMin; k <= kMax; k++) {
    let exitosos = 0;
    let tiempoTotal = 0;
    let conflictosTotal = 0;
    let iteracionesTotal = 0;
    
    for (let muestra = 0; muestra < muestras; muestra++) {
      const grafo = crearGrafoFn(nodos, k);
      const inicio = performance.now();
      
      const resultado = busquedaLocalGreedy(grafo, 100);
      
      const fin = performance.now();
      
      if (resultado.exito) exitosos++;
      tiempoTotal += parseFloat(resultado.tiempoEjecucion);
      conflictosTotal += resultado.conflictosFinales;
      iteracionesTotal += resultado.iteraciones;
    }
    
    resultados.push({
      k,
      tasaExito: (exitosos / muestras * 100).toFixed(2),
      tiempoPromedio: (tiempoTotal / muestras).toFixed(2),
      conflictosPromedio: (conflictosTotal / muestras).toFixed(2),
      iteracionesPromedio: (iteracionesTotal / muestras).toFixed(2)
    });
  }
  
  return resultados;
}
