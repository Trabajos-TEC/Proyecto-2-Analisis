import { crearCopiaGrafo } from "./prototipo.js";
import { crearGrafoAleatorio } from "./prototipo.js";

let grafos = []; // Aquí se guardarán snapshots de cada intento

export function algoritmoLasVegas(grafo) {
  if (!grafo || grafo.nodos.length === 0) {
    console.error("El grafo está vacío o es inválido.");
    return null;
  }

  let iteraciones = 0;
  let conflictosTotales = 0;
  let grafosValidos = 0;

  grafos = []; // limpiar historial

  let recoloraciones = 0;
  let evolucionConflictos = [];

  const inicio = performance.now();

  while (true) {
    iteraciones += 1;

    let coloresPrevios = crearCopiaGrafo(grafo).nodos.map(nodo => nodo.color);

    grafo.asignarColoresAleatoriamente();

    grafo.nodos.forEach((nodo, i) => {
      if (nodo.color !== coloresPrevios[i]) {
        recoloraciones++;
      }
    });

    let conflictosActuales = grafo.contarConflictos();
    conflictosTotales += conflictosActuales;

    evolucionConflictos.push(conflictosActuales);

    if (conflictosActuales === 0) {
      grafosValidos += 1;
    }

    if (grafo.verificarColoreo()) {
      const fin = performance.now();
      const tiempoEjecucion = (fin - inicio).toFixed(2);

      return {
        intentos: iteraciones,
        tiempoEjecucion: `${tiempoEjecucion} ms`,
        porcentajeExito: grafosValidos * 100,
        conflictosTotales,
        grafos,
        grafosValidos,
        recoloraciones,
        evolucionConflictos
      };
    }
  }
}

console.log(algoritmoLasVegas(crearGrafoAleatorio(60,10)));
