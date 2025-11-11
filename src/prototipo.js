// Nodo individual
class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.vecinos = []; // lista de nodos conectados
    this.color = "";
  }
}

// Grafo
class Grafo {
  constructor() {
    this.nodos = [];
    this.k = null;
    this.listaColores = [];
    this.largo = 0
    this.completo = false;
  }

  asignarK(n){
    this.k = n;
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

  while (grafo.verificarAislado()){ // Mientras que exista un nodo aislado en el grafo ...
    let nodo1 = grafo.nodos[random(0,grafo.largo - 1)]
    let nodo2 = grafo.nodos[random(0,grafo.largo - 1)]

    // Validamos que los nodos escogidos no sean los mismos
    // Validamos que no exista ya una conexion entre esos mismos dos nodos.
    if (nodo1 != nodo2 && verificarExistenciaArista(nodo1,nodo2,listaConexiones) === false){
      grafo.agregarArista(nodo1,nodo2);
      let conexion = [nodo1,nodo2]
      listaConexiones.push(conexion)
    }

  }
  console.log("Grafo creado con exito!")

  return grafo;
}




// ==================== PRUEBAS ====================

// Crear un grafo manualmente
const g = new Grafo();
const n1 = g.agregarNodo("A");
const n2 = g.agregarNodo("B");
const n3 = g.agregarNodo("C");

// Crear aristas
g.agregarArista(n1, n2);
g.agregarArista(n2, n3);
g.agregarArista(n1, n3);

// Asignar colores distintos (sin conflicto)
n1.color = "rojo";
n2.color = "verde";
n3.color = "azul";

console.log(" Caso 1 (sin conflicto):", g.verificarColoreo()); //  debería imprimir true

// Crear conflicto: dos vecinos con el mismo color
n2.color = "rojo";

console.log(" Caso 2 git (con conflicto):", g.verificarColoreo()); //  debería imprimir false
// ==================== PRUEBA ALEATORIA ====================

const grafoAleatorio = crearGrafoAleatorio(5, 5);
grafoAleatorio.nodos.forEach(nodo => {
  nodo.color = grafoAleatorio.listaColores[random(0, grafoAleatorio.k - 1)];
});

console.log("\n Caso 3 (aleatorio):");
grafoAleatorio.nodos.forEach(n => {
  console.log(`Nodo ${n.valor} -> color: ${n.color}, vecinos: [${n.vecinos.map(v => v.valor).join(", ")}]`);
});
console.log("¿Coloreo válido?", grafoAleatorio.verificarColoreo());
