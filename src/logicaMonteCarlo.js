import { crearGrafoAleatorio } from "./prototipo.js";
import { crearCopiaGrafo } from "./prototipo.js";

let grafos = []; // Aquí se guardarán snapshots de cada intento

export function algoritmoMontecarlo(grafo, iteraciones = 1000) {
  if (!grafo || grafo.nodos.length === 0) {
    console.error("El grafo está vacío o es inválido.");
    return null;
  }

  let conflictosTotales = 0;
  let grafosValidos = 0;

  grafos = []; // limpiar historial

  // Agregamos recoloraciones y evolución ***
  let recoloraciones = 0;
  let evolucionConflictos = [];

  const inicio = performance.now(); // Tiempo de inicio

  for (let i = 0; i < iteraciones; i++) {

    // Asignar colores aleatorios
    grafo.asignarColoresAleatoriamente();

    // CAMBIO 2: sumamos recoloraciones
    recoloraciones += grafo.nodos.length;

    // Contar conflictos
    let conflictosActuales = grafo.contarConflictos();
    conflictosTotales += conflictosActuales;

    // Guardamos evolución
    evolucionConflictos.push(conflictosActuales);


    // Verificar si es válido (cero conflictos)
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

    // Devolvemos nuevas estadísticas ***
    recoloraciones,
    evolucionConflictos

  };
}

console.log(algoritmoMontecarlo(crearGrafoAleatorio(60,6),10000));
