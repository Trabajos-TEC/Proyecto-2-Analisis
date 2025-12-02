/**
 * Módulo de Búsqueda Local y Recoloración
 * Implementa estrategias heurísticas para optimizar la coloración de grafos
 */

/**
 * Calcula la probabilidad estimada de éxito tras recolorear un nodo
 * @param {Grafo} grafo - El grafo actual
 * @param {number} indiceNodo - Índice del nodo a analizar
 * @param {string} nuevoColor - Color que se aplicará
 * @returns {Object} - Información sobre la probabilidad y análisis
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
  // 1. Reducción de conflictos
  // 2. Número de colores disponibles vs vecinos
  // 3. Grado del nodo
  
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
 * Identifica nodos conflictivos en el grafo
 * @param {Grafo} grafo - El grafo a analizar
 * @returns {Array} - Lista de nodos con conflictos
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
 * Encuentra el mejor color para un nodo dado
 * @param {Grafo} grafo - El grafo
 * @param {number} indiceNodo - Índice del nodo
 * @returns {Object} - Mejor color y análisis
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
 * Estrategia de búsqueda local: Recoloración Greedy
 * Recolorea nodos conflictivos de forma iterativa hasta resolver conflictos
 * @param {Grafo} grafo - El grafo a optimizar
 * @param {number} maxIteraciones - Máximo de iteraciones
 * @returns {Object} - Resultado de la búsqueda local
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
 * Estrategia de búsqueda local: Hill Climbing
 * Explora recoloraciones vecinas y se mueve hacia la mejor opción
 * @param {Grafo} grafo - El grafo a optimizar
 * @param {number} maxIteraciones - Máximo de iteraciones
 * @returns {Object} - Resultado de la búsqueda
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
 * Evalúa el impacto del número de colores (k) en el rendimiento
 * @param {Function} crearGrafoFn - Función para crear grafo
 * @param {number} nodos - Número de nodos
 * @param {number} kMin - Mínimo número de colores
 * @param {number} kMax - Máximo número de colores
 * @param {number} muestras - Número de muestras por k
 * @returns {Array} - Análisis comparativo
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
