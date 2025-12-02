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

