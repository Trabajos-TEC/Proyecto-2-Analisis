import { useState } from "react";
import "./App.css";
import { crearGrafoAleatorio, crearGrafoManual } from "./prototipo.js";
import GraphView from "./components/vistaGrafo.jsx";
import { algoritmoMontecarlo } from "./logicaMonteCarlo.js";
import { algoritmoLasVegas } from "./logicaLasVegas.js";
import GraficoConflictosCanvas from "./components/graficoConflictosCanvas";


function App() {
  const [algoritmo, setAlgoritmo] = useState("Monte Carlo");
  const [nodos, setNodos] = useState("");
  const [colores, setColores] = useState("");
  const [grafo, setGrafo] = useState(null);
  const [seleccion, setSeleccion] = useState([]);
  const [iteraciones, setIteraciones] = useState("");
  const [mostrarIteraciones, setMostrarIteraciones] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [nodoARecolorear, setNodoARecolorear] = useState("");
  const [colorNuevo, setColorNuevo] = useState("");

  // === ADVERTIR REINICIO ===
  const advertirReinicio = () => {
    alert("Debe reiniciar antes de iniciar una nueva ejecución.");
  };

  // === REINICIAR A ESTADO INICIAL ===
  const handleReinicio = () => {
    setGrafo(null);
    setResultado(null);
    setIteraciones("");
    setSeleccion([]);
    setNodoARecolorear("");
    setColorNuevo("");
    setMostrarIteraciones(false);
    alert("La aplicación ha sido reiniciada.");
  };


  // === CREAR GRAFO ALEATORIO ===
  const handleCrearGrafoAleatorio = () => {

    if (nodos < 60) {
      alert("Debe usar al menos 60 nodos.");
      return;
    }
    if (nodos > 160) {
      alert("El máximo permitido es 160 nodos.");
      return;
    }

    const nuevoGrafo = crearGrafoAleatorio(Number(nodos), Number(colores));
    console.log("Grafo generado:", nuevoGrafo);
    setGrafo(nuevoGrafo);
    setResultado(null);
  };


  // === CREAR GRAFO MANUAL ===
  const handleCrearManual = () => {

    if (nodos < 60) {
      alert("Debe usar al menos 60 nodos.");
      return;
    }
    if (nodos > 160) {
      alert("El máximo permitido es 160 nodos.");
      return;
    }

    const nuevoGrafo = crearGrafoManual(Number(nodos), Number(colores));
    console.log("Grafo generado:", nuevoGrafo);
    setGrafo(nuevoGrafo);
    setResultado(null);
  };

  // === CLICK EN NODO (SOLO PARA MANUAL) ===
  const handleNodoClick = (index) => {
    setSeleccion((prev) => {
      const nuevaSel = [...prev, index];

      if (nuevaSel.length === 2) {
        const [a, b] = nuevaSel;

        if (a !== b) {
          grafo.nodos[a].vecinos.push(grafo.nodos[b]);
          grafo.nodos[b].vecinos.push(grafo.nodos[a]);
          setGrafo({ ...grafo }); // refrescar
        }
        return [];
      }

      return nuevaSel;
    });
  };
const recolorearNodo = () => {
  if (!grafo) return;
  
  const num = Number(nodoARecolorear);
  if (isNaN(num) || num < 1 || num > grafo.nodos.length) {
    alert("Número de nodo inválido.");
    return;
  }
  if (!colorNuevo) {
    alert("Debe elegir un color.");
    return;
  }

  grafo.nodos[num - 1].color = colorNuevo; // aplicar cambio
  setGrafo({ ...grafo }); // refrescar
};

  // === INICIAR SIMULACIÓN ===
  const handleIniciarSimulacion = () => {
    if (!grafo) {
      alert("Debe generar un grafo primero.");
      return;
    }

    if (algoritmo === "Monte Carlo") {
      setMostrarIteraciones(true);
    } else {
      ejecutarLasVegas();
    }
  };
  const ejecutarLasVegas = () => {
    const it = Number(iteraciones);

    const resultado = algoritmoLasVegas(grafo);

    console.log("Resultado Monte Carlo:", resultado);

    // El algoritmo debe modificar grafo.nodos[i].color → refrescamos
    setGrafo({ ...grafo });

    setResultado(resultado);
    setMostrarIteraciones(false);
  };
  // === EJECUTAR MONTE CARLO ===
  const ejecutarMonteCarlo = () => {
    const it = Number(iteraciones);
    if (isNaN(it) || it <= 0) {
      alert("Ingrese un número válido de iteraciones.");
      return;
    }

    const resultado = algoritmoMontecarlo(grafo, it);

    console.log("Resultado Monte Carlo:", resultado);

    // El algoritmo debe modificar grafo.nodos[i].color → refrescamos
    setGrafo({ ...grafo });

    setResultado(resultado);
    setMostrarIteraciones(false);
  };

  return (
    <div className="container">
      <div className="top-bar">
        <div className="section">
          <label>Algoritmo:</label>
          <select
            value={algoritmo}
            onChange={(e) => setAlgoritmo(e.target.value)}
          >
            <option value="Monte Carlo">Monte Carlo</option>
            <option value="Las Vegas">Las Vegas</option>
          </select>
        </div>

        <div className="section">
          <label>Nodos:</label>
          <input
            type="number"
            value={nodos}
            onChange={(e) => setNodos(e.target.value)}
            onBlur={(e) => {
              const valor = Number(e.target.value);

              if (valor < 60) {
                alert("El número mínimo de nodos es 60.");
                setNodos(60);
              } else if (valor > 160) {
                alert("El número máximo de nodos es 160.");
                setNodos(160);
              }
            }}
            placeholder="Entre 60 y 160"
            min={60}
            max={160}
          />
        </div>

        <div className="section">
          <label>Colores:</label>
          <input
            type="number"
            value={colores}
            onChange={(e) => setColores(e.target.value)}
            placeholder="Ej: 5"
            min={3}
          />
        </div>

        <div className="buttons">
          <button
            className="btn-random"
            onClick={resultado ? advertirReinicio : handleCrearGrafoAleatorio}
          >
            Crear aleatorio
          </button>

          <button
            className="btn-manual"
            onClick={resultado ? advertirReinicio : handleCrearManual}
          >
            Manual
          </button>

          <button
            className="btn-iniciar-simulacion"
            onClick={resultado ? advertirReinicio : handleIniciarSimulacion}
          >
            Iniciar Simulación
          </button>

          <button
            className="btn-reiniciar"
            onClick={handleReinicio}
          >
            Reiniciar
          </button>
        </div>

      </div>

      {mostrarIteraciones && (
        <div className="iteraciones-box">
          <label>Iteraciones:</label>
          <input
            type="number"
            value={iteraciones}
            onChange={(e) => setIteraciones(e.target.value)}
            placeholder="Ej: 1000"
            min={1}
          />
          <button className="btn-ejecutar-montecarlo" onClick={ejecutarMonteCarlo}> Ejecutar </button>
        </div>
      )}


      {/* VISTA DEL GRAFO */}
      {grafo && (
        <div className="graph-area">
          <GraphView grafo={grafo} onNodoClick={handleNodoClick} />
        </div>
      )}

      {resultado && (
        <div style={{ marginTop: "20px" }}>
          <h2>Resultado Monte Carlo</h2>
          <p>Intentos: {resultado.intentos}</p>
          <p>Conflictos totales: {resultado.conflictosTotales}</p>
          <p>Grafos Validos: {resultado.grafosValidos}</p>
          <p>Éxito: {resultado.porcentajeExito.toFixed(2)}%</p>
          <p>Tiempo: {resultado.tiempoEjecucion} </p>

          <br/><br/>

          <p>Recoloraciones totales: {resultado.recoloraciones}</p>

          <br/><br/>
        </div>
      )}

      {/* === GRÁFICO DE LÍNEAS === */}
      {resultado && resultado.evolucionConflictos && (
        <GraficoConflictosCanvas datos={resultado.evolucionConflictos} />
      )}

      {resultado && grafo && (
  <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
    <h3>Recolorear nodo manualmente</h3>

    <label>Número de nodo:</label>
    <input
      type="number"
      value={nodoARecolorear}
      onChange={(e) => setNodoARecolorear(e.target.value)}
      placeholder="Ej: 1"
      min={1}
      max={grafo.nodos.length}
      style={{ marginLeft: "10px", width: "80px" }}
    />

    <br /><br />

    <label>Color nuevo:</label>
    <select
      value={colorNuevo}
      onChange={(e) => setColorNuevo(e.target.value)}
      style={{ marginLeft: "10px" }}
    >
      <option value="">Seleccione color</option>
      {grafo.listaColores.map((c, idx) => (
        <option key={idx} value={c}>{c}</option>
      ))}
    </select>

    <br /><br />

    <button className="btn-aplicar-recoloreo" onClick={recolorearNodo}>Aplicar</button>
    <button className="btn-ejecutar-recoloreo" onClick={handleCrearManual}>
            Ejecutar
    </button>
  </div>
)}

    </div>
  );
}

export default App;
