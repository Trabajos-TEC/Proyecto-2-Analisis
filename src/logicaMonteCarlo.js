import { crearGrafoAleatorio } from "./prototipo.js";
import { crearCopiaGrafo } from "./prototipo.js";

let grafos = []; // Aquí se guardarán snapshots de cada intento

/**
 * Nombre: algoritmoMontecarlo
 * Descripción: Implementa el algoritmo probabilístico Monte Carlo para coloración de grafos.
 *              Ejecuta un número limitado de iteraciones asignando colores aleatorios
 *              en cada intento. No garantiza encontrar una solución válida, pero proporciona
 *              estadísticas sobre la probabilidad de éxito y el comportamiento del algoritmo.
 * Entradas:
 *   - grafo: Objeto Grafo a colorear
 *   - iteraciones: Número máximo de intentos de coloración (por defecto 1000)
 * Salidas:
 *   - Objeto con estadísticas del algoritmo:
 *     * intentos: Número de iteraciones ejecutadas
 *     * tiempoEjecucion: Tiempo en milisegundos
 *     * porcentajeExito: Porcentaje de coloraciones válidas encontradas
 *     * conflictosTotales: Suma de conflictos en todas las iteraciones
 *     * grafosValidos: Cantidad de grafos sin conflictos encontrados
 *     * recoloraciones: Número total de nodos recoloreados
 *     * evolucionConflictos: Array con el número de conflictos en cada iteración
 */
export function algoritmoMontecarlo(grafo, iteraciones = 1000) {
  if (!grafo || grafo.nodos.length === 0) {
    console.error("El grafo está vacío o es inválido.");
    return null;
  }

  let conflictosTotales = 0;
  let grafosValidos = 0;

  grafos = []; // limpiar historial

  let recoloraciones = 0;
  let evolucionConflictos = [];

  const inicio = performance.now();

  for (let i = 0; i < iteraciones; i++) {
    let coloresPrevios = crearCopiaGrafo(grafo).nodos.map(nodo => nodo.color);

    grafo.asignarColoresAleatoriamente();

    grafo.nodos.forEach((nodo, j) => {
      if (nodo.color !== coloresPrevios[j]) {
        recoloraciones++;
      }
    });

    let conflictosActuales = grafo.contarConflictos();
    conflictosTotales += conflictosActuales;

    evolucionConflictos.push(conflictosActuales);

    if (conflictosActuales === 0) {
      grafosValidos += 1;
    }
  }

  const fin = performance.now();
  const tiempoEjecucion = (fin - inicio).toFixed(2);

  return {
    intentos: iteraciones,
    tiempoEjecucion: `${tiempoEjecucion} ms`,
    porcentajeExito: (grafosValidos / iteraciones) * 100,
    conflictosTotales,
    grafos,
    grafosValidos,
    recoloraciones,
    evolucionConflictos
  };
}

console.log(algoritmoMontecarlo(crearGrafoAleatorio(60,6),10000));

