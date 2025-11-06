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

// Aun en desarrollo
function crearGrafoAleatorio(cantidadNodos,kColores,){
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


let grafo = crearGrafoAleatorio(120,5);


console.log("=== Conexiones del Grafo ===");
grafo.nodos.forEach(nodo => {
  const vecinos = nodo.vecinos.map(v => v.valor).join(", ");
  console.log(`Nodo ${nodo.valor}: ${vecinos.length > 0 ? vecinos : "sin conexiones"}`);
});
