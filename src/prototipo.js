// Nodo individual
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.vecinos = []; // lista de nodos conectados
    this.color = "";
    this.recolorear = false;
  }
}

// Grafo
export class Grafo {
  constructor() {
    this.nodos = [];
    this.k = null;
    this.listaColores = [];
    this.largo = 0
    this.completo = false;
    this.conflictos = 0;

  }

  asignarK(n){
    this.k = n;
  }

  asignarColoresAleatoriamente(){
    for (let i = 0; i < this.nodos.length ; i++){
      let nodo = this.nodos[i]
      if (!nodo.recolorear){
        nodo.color = this.listaColores[random(0,this.listaColores.length - 1)]
      }
    }
  }

  agregarNodo(valor) {
    const nodo = new Nodo(valor);
    this.nodos.push(nodo);
    this.largo += 1;
    return nodo;
  }

  agregarColores(){
    this.listaColores = [];
    for (let i = 0; i < this.k ; i++){
      const color = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;
      this.listaColores.push(color)
    }
  }

  agregarArista(nodo1, nodo2) {
    nodo1.vecinos.push(nodo2);
    nodo2.vecinos.push(nodo1);
  }

  verificarAislado(){
    for (let i = 0; i < this.nodos.length; i++){
        if (this.nodos[i].vecinos.length === 0){
            return true;
        }
    }
    return false;
  }

  verificarCompleto(){
  }

  
  contarConflictos() {
    this.conflictos = 0;
    let setConflictos = new Set();

    for (let i = 0; i < this.nodos.length; i++) {
      let nodo = this.nodos[i];

      for (let j = 0; j < nodo.vecinos.length; j++) {
        let vecino = nodo.vecinos[j];

        if (nodo.color === vecino.color) {
          
          let key = [nodo.valor, vecino.valor].sort().join("-");

          if (!setConflictos.has(key)) {
            setConflictos.add(key);
            this.conflictos += 1;
          }
        }
      }
    }

    return this.conflictos;
  }


  verificarColoreo(){
    for (let i = 0; i < this.nodos.length; i++){
      let nodoSeleccionado = this.nodos[i];
      for (let j = 0; j < nodoSeleccionado.vecinos.length ; j++){
        if (nodoSeleccionado.color === nodoSeleccionado.vecinos[j].color){
          return false;
        }
      }
    }
    return true;
  }
  

}


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function verificarExistenciaArista(nodo1,nodo2,lista){
  for (let i = 0; i < lista.length ; i++){
    if (lista[i][0].valor === nodo1.valor && lista[i][1].valor === nodo2.valor){
      return true;
    } 
    if (lista[i][0].valor === nodo2.valor && lista[i][1].valor === nodo1.valor){
      return true;
    } 
  }

  return false;
}



export function crearGrafoManual(cantidadNodos,kColores,){
  const grafo = new Grafo();
  // Creamos las instancias de nodos
  for (let i = 1; i < cantidadNodos + 1; i++){
    grafo.agregarNodo(i);
  }
  // Generamos los colores
  grafo.asignarK(kColores);
  grafo.agregarColores();


  console.log("Grafo creado con exito!")

  return grafo;
}


export function crearGrafoAleatorio(cantidadNodos,kColores,){
  const grafo = new Grafo();
  // Creamos las instancias de nodos
  for (let i = 1; i < cantidadNodos + 1; i++){
    grafo.agregarNodo(i);
  }
  // Generamos los colores
  grafo.asignarK(kColores);
  grafo.agregarColores();

  // Creamos las conneciones entre nodos (aristas)
  let listaConexiones = []

  while (grafo.verificarAislado()){
    for(let i = 0; i < grafo.nodos.length ; i++){
      let nodo1 = grafo.nodos[i]
      let nodo2 = grafo.nodos[random(0,grafo.largo - 1)]

      // Validamos que los nodos escogidos no sean los mismos
      // Validamos que no exista ya una conexion entre esos mismos dos nodos.
      if (nodo1 != nodo2 && verificarExistenciaArista(nodo1,nodo2,listaConexiones) === false){
   
          grafo.agregarArista(nodo1,nodo2);
          let conexion = [nodo1,nodo2]
          listaConexiones.push(conexion)
      }

    } 
  }
  console.log("Grafo creado con exito!")

  return grafo;
}

export function crearCopiaGrafo(grafo) {
    let copia = new Grafo();

    copia.largo = grafo.largo;
    copia.completo = grafo.completo;
    copia.k = grafo.k;

    copia.listaColores = [];
    for (let i = 0; i < grafo.listaColores.length; i++) {
        copia.listaColores[i] = grafo.listaColores[i];
    }

    copia.nodos = [];
    for (let i = 0; i < grafo.nodos.length; i++) {
        let nodoOriginal = grafo.nodos[i];

        let nodoNuevo = new Nodo(nodoOriginal.valor);
        nodoNuevo.color = nodoOriginal.color;

        copia.nodos[i] = nodoNuevo;
    }

    for (let i = 0; i < grafo.nodos.length; i++) {
        let nodoOriginal = grafo.nodos[i];
        let nodoCopia = copia.nodos[i];

        nodoCopia.vecinos = [];

        for (let j = 0; j < nodoOriginal.vecinos.length; j++) {
            let vecinoOriginal = nodoOriginal.vecinos[j];

            let indexVecino = -1;
            for (let k = 0; k < grafo.nodos.length; k++) {
                if (grafo.nodos[k] === vecinoOriginal) {
                    indexVecino = k;
                    break;
                }
            }

            nodoCopia.vecinos[j] = copia.nodos[indexVecino];
        }
    }
    copia.contarConflictos();
    return copia;
}
