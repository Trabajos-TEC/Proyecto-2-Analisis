import { crearCopiaGrafo } from "./prototipo.js";
//import { crearGrafoAleatorio } from "./prototipo.js";
let grafos = []; 

export function algoritmoLasVegas(grafo) {
  if (!grafo || grafo.nodos.length === 0) {
    console.error("El grafo está vacío o es inválido.");
    return null;
  }
  let iteraciones = 0;
  let conflictosTotales = 0;
  let grafosValidos = 0;

  grafos = [];

  const inicio = performance.now(); // Tiempo de inicio

  while(true){
    iteraciones+=1 ;

    // Asignar colores aleatorios
    grafo.asignarColoresAleatoriamente();


    //grafos.push(crearCopiaGrafo(grafo));

    // Contar conflictos
    let conflictosActuales = grafo.contarConflictos();
    conflictosTotales += conflictosActuales;
    if (conflictosActuales === 0) {
      grafosValidos += 1;
    }
    if (grafo.verificarColoreo()){
        const fin = performance.now();
        const tiempoEjecucion = (fin - inicio).toFixed(2);
        return {
            intentos: iteraciones,
            tiempoEjecucion: `${tiempoEjecucion} ms`,
            porcentajeExito: (grafosValidos) * 100,
            conflictosTotales,
            grafos,
            grafosValidos
        };
    }


  }


}


//console.log(algoritmoLasVegas(crearGrafoAleatorio(60,10)));