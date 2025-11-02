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
  }

  asignarK(n){
    this.k = n;
  }

  agregarNodo(valor) {
    const nodo = new Nodo(valor);
    this.nodos.push(nodo);
    return nodo;
  }

  agregarColores(){
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


}

// Aun en desarrollo
function crearGrafoAleatorio(cantidadNodos,kColores,){
  const grafo = new Grafo();

}


