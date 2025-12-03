
/**
 * Nombre: Nodo
 * Descripción: Clase que representa un nodo individual en el grafo.
 *              Cada nodo tiene un valor identificador, una lista de nodos vecinos (adyacentes),
 *              un color asignado para la coloración, y un flag que indica si debe ser recoloreado.
 * Entradas:
 *   - valor: Identificador único del nodo
 */
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.vecinos = []; // lista de nodos conectados
    this.color = "";
    this.recolorear = false;
  }
}

/**
 * Nombre: Grafo
 * Descripción: Clase que representa un grafo no dirigido.
 *              Contiene una lista de nodos, el número de colores permitidos (k),
 *              la lista de colores disponibles, y métodos para manipular y validar la coloración.
 */
export class Grafo {
  constructor() {
    this.nodos = [];
    this.k = null;
    this.listaColores = [];
    this.largo = 0
    this.completo = false;
    this.conflictos = 0;

  }

  /**
   * Nombre: asignarK
   * Descripción: Asigna el número de colores (k) permitidos para colorear el grafo.
   * Entradas:
   *   - n: Número entero que representa la cantidad de colores disponibles
   */
  asignarK(n){
    this.k = n;
  }

  /**
   * Nombre: asignarColoresAleatoriamente
   * Descripción: Asigna colores aleatorios a todos los nodos del grafo que no tienen
   *              el flag 'recolorear' activado. Los colores se seleccionan aleatoriamente
   *              de la lista de colores disponibles.
   */
  asignarColoresAleatoriamente(){
    for (let i = 0; i < this.nodos.length ; i++){
      let nodo = this.nodos[i]
      if (!nodo.recolorear){
        nodo.color = this.listaColores[random(0,this.listaColores.length - 1)]
      }
    }
  }

  /**
   * Nombre: agregarNodo
   * Descripción: Crea un nuevo nodo con el valor especificado y lo agrega al grafo.
   * Entradas:
   *   - valor: Identificador único del nodo
   * Salidas:
   *   - Retorna el nodo creado
   */
  agregarNodo(valor) {
    const nodo = new Nodo(valor);
    this.nodos.push(nodo);
    this.largo += 1;
    return nodo;
  }

  /**
   * Nombre: agregarColores
   * Descripción: Genera una lista de k colores aleatorios en formato hexadecimal
   *              para ser utilizados en la coloración del grafo.
   */
  agregarColores(){
    this.listaColores = [];
    for (let i = 0; i < this.k ; i++){
      const color = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;
      this.listaColores.push(color)
    }
  }

  /**
   * Nombre: agregarArista
   * Descripción: Crea una conexión bidireccional entre dos nodos (arista no dirigida).
   * Entradas:
   *   - nodo1: Primer nodo de la arista
   *   - nodo2: Segundo nodo de la arista
   */
  agregarArista(nodo1, nodo2) {
    nodo1.vecinos.push(nodo2);
    nodo2.vecinos.push(nodo1);
  }

  /**
   * Nombre: verificarAislado
   * Descripción: Verifica si existe al menos un nodo aislado (sin vecinos) en el grafo.
   * Salidas:
   *   - Retorna true si hay al menos un nodo sin vecinos, false en caso contrario
   */
  verificarAislado(){
    for (let i = 0; i < this.nodos.length; i++){
        if (this.nodos[i].vecinos.length === 0){
            return true;
        }
    }
    return false;
  }


  /**
   * Nombre: contarConflictos
   * Descripción: Cuenta el número total de conflictos en el grafo.
   *              Un conflicto ocurre cuando dos nodos adyacentes tienen el mismo color.
   *              Utiliza un Set para evitar contar la misma arista conflictiva dos veces.
   * Salidas:
   *   - Retorna el número de conflictos encontrados (aristas con nodos del mismo color)
   */
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

  /**
   * Nombre: verificarColoreo
   * Descripción: Verifica si la coloración actual del grafo es válida.
   *              Una coloración es válida si ningún par de nodos adyacentes tiene el mismo color.
   * Salidas:
   *   - Retorna true si la coloración es válida, false si existe al menos un conflicto
   */
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

/**
 * Nombre: random
 * Descripción: Genera un número entero aleatorio en el rango especificado (inclusivo).
 * Entradas:
 *   - min: Valor mínimo del rango
 *   - max: Valor máximo del rango
 * Salidas:
 *   - Retorna un número entero aleatorio entre min y max (ambos incluidos)
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Nombre: verificarExistenciaArista
 * Descripción: Verifica si ya existe una arista entre dos nodos específicos en una lista de conexiones.
 * Entradas:
 *   - nodo1: Primer nodo a verificar
 *   - nodo2: Segundo nodo a verificar
 *   - lista: Lista de aristas existentes (array de pares de nodos)
 * Salidas:
 *   - Retorna true si la arista ya existe, false en caso contrario
 */
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

/**
 * Nombre: crearGrafoManual
 * Descripción: Crea un grafo con un número específico de nodos sin conexiones.
 *              Las aristas deben ser agregadas manualmente por el usuario.
 *              Genera automáticamente k colores aleatorios para el grafo.
 * Entradas:
 *   - cantidadNodos: Número de nodos a crear en el grafo
 *   - kColores: Número de colores disponibles para colorear el grafo
 * Salidas:
 *   - Retorna un objeto Grafo con los nodos creados sin aristas
 */
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


function contarAristasDeNodo(nodo, listaConexiones) {
  let contador = 0;

  for (let i = 0; i < listaConexiones.length; i++) {
    const [a, b] = listaConexiones[i];

    if (a === nodo || b === nodo) {
      contador++;
    }
  }

  return contador;
}


/**
 * Nombre: crearGrafoAleatorio
 * Descripción: Crea un grafo aleatorio con el número especificado de nodos.
 *              Genera conexiones aleatorias entre nodos asegurando que no haya nodos aislados.
 *              Evita la creación de aristas duplicadas y auto-conexiones.
 * Entradas:
 *   - cantidadNodos: Número de nodos a crear en el grafo
 *   - kColores: Número de colores disponibles para colorear el grafo
 * Salidas:
 *   - Retorna un objeto Grafo con nodos conectados aleatoriamente
 */
export function crearGrafoAleatorio(cantidadNodos, kColores) {
  const grafo = new Grafo();

  // Creamos las instancias de nodos
  for (let i = 1; i < cantidadNodos + 1; i++) {
    grafo.agregarNodo(i);
  }

  // Generamos los colores
  grafo.asignarK(kColores);
  grafo.agregarColores();

  // Creamos las conexiones entre nodos (aristas)
  let listaConexiones = [];

  while (grafo.verificarAislado()) {
    for (let i = 0; i < grafo.nodos.length; i++) {
      let nodo1 = grafo.nodos[i];
      let nodo2 = grafo.nodos[random(0, grafo.largo - 1)];

      // Validamos que los nodos escogidos no sean los mismos
      // y que no exista ya una conexión entre esos mismos dos nodos.
      const yaExiste = verificarExistenciaArista(nodo1, nodo2, listaConexiones);

      // Contamos cuántas aristas tiene cada nodo
      const aristasNodo1 = contarAristasDeNodo(nodo1, listaConexiones);
      const aristasNodo2 = contarAristasDeNodo(nodo2, listaConexiones);

      if (
        nodo1 !== nodo2 &&
        yaExiste === false &&
        aristasNodo1 < 2 &&     
        aristasNodo2 < 2        
      ) {
        grafo.agregarArista(nodo1, nodo2);
        let conexion = [nodo1, nodo2];
        listaConexiones.push(conexion);
      }
    }
  }

  console.log("Grafo creado con exito!");

  return grafo;
}


/**
 * Nombre: crearCopiaGrafo
 * Descripción: Crea una copia profunda del grafo preservando su estructura, nodos, aristas y colores.
 *              IMPORTANTE: Esta función preserva los métodos de las clases Grafo y Nodo,
 *              a diferencia del operador spread (...) que solo copia propiedades.
 * Entradas:
 *   - grafo: Objeto Grafo a copiar
 * Salidas:
 *   - Retorna un nuevo objeto Grafo con la misma estructura y datos que el original
 */
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
