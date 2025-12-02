import { useState } from "react";
import "./App.css";
import { crearGrafoAleatorio, crearGrafoManual } from "./prototipo.js";
import GraphView from "./components/vistaGrafo.jsx";
import { algoritmoMontecarlo } from "./logicaMonteCarlo.js";
import { algoritmoLasVegas } from "./logicaLasVegas.js";
import GraficoConflictosCanvas from "./components/graficoConflictosCanvas";
import EvaluacionK from "./components/EvaluacionK.jsx";
import { calcularProbabilidadRecoloracion, busquedaLocalGreedy } from "./busquedaLocal.js";


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
  const [probabilidadInfo, setProbabilidadInfo] = useState(null);
  const [mostrarEvaluacionK, setMostrarEvaluacionK] = useState(false);
  const [, forceUpdate] = useState(0);

  // Función para forzar re-render sin destruir el grafo
  const actualizarGrafo = () => {
    forceUpdate(n => n + 1);
  };

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
    setProbabilidadInfo(null);
    setMostrarIteraciones(false);
    setMostrarEvaluacionK(false);
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
          actualizarGrafo();
        }
        return [];
      }

      return nuevaSel;
    });
  };
  // === CALCULAR PROBABILIDAD AL CAMBIAR COLOR ===
  const calcularProbabilidad = () => {
    if (!grafo || !nodoARecolorear || !colorNuevo) return;
    
    const num = Number(nodoARecolorear);
    if (isNaN(num) || num < 1 || num > grafo.nodos.length) return;
    
    const info = calcularProbabilidadRecoloracion(grafo, num - 1, colorNuevo);
    setProbabilidadInfo(info);
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

    grafo.nodos[num - 1].color = colorNuevo;
    actualizarGrafo();
    setProbabilidadInfo(null);
  };

  // === IDENTIFICAR NODOS CONFLICTIVOS ===
  const obtenerNodosConflictivos = () => {
    if (!grafo) return [];
    
    const conflictivos = [];
    for (let i = 0; i < grafo.nodos.length; i++) {
      const nodo = grafo.nodos[i];
      const numConflictos = nodo.vecinos.filter(v => v.color === nodo.color).length;
      
      if (numConflictos > 0) {
        conflictivos.push({
          valor: nodo.valor,
          indice: i,
          color: nodo.color,
          conflictos: numConflictos
        });
      }
    }
    
    return conflictivos.sort((a, b) => b.conflictos - a.conflictos);
  };

  // === APLICAR BÚSQUEDA LOCAL ===
  const aplicarBusquedaLocal = () => {
    if (!grafo) {
      alert("Debe generar un grafo primero.");
      return;
    }

    const resultadoBusqueda = busquedaLocalGreedy(grafo, 100);
    actualizarGrafo();
    
    alert(
      `Búsqueda Local Completada:\n\n` +
      `Éxito: ${resultadoBusqueda.exito ? "Sí" : "No"}\n` +
      `Iteraciones: ${resultadoBusqueda.iteraciones}\n` +
      `Conflictos iniciales: ${resultadoBusqueda.conflictosIniciales}\n` +
      `Conflictos finales: ${resultadoBusqueda.conflictosFinales}\n` +
      `Mejora: ${resultadoBusqueda.mejora} conflictos (${resultadoBusqueda.porcentajeMejora}%)\n` +
      `Tiempo: ${resultadoBusqueda.tiempoEjecucion} ms`
    );
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

    console.log("Resultado Las Vegas:", resultado);

    // El algoritmo debe modificar grafo.nodos[i].color → refrescamos
    actualizarGrafo();

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
    actualizarGrafo();

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

      {/* === RECOLORACIÓN MANUAL CON PROBABILIDAD === */}
      {resultado && grafo && (
        <div className="recoloracion-container">
          <h3 className="recoloracion-title">🎨 Recoloración Manual Inteligente</h3>

          {/* MOSTRAR NODOS CONFLICTIVOS */}
          {(() => {
            const nodosConflictivos = obtenerNodosConflictivos();
            const totalConflictos = grafo.contarConflictos();
            
            return (
              <div className={`estado-grafo ${totalConflictos > 0 ? 'con-conflictos' : 'sin-conflictos'}`}>
                <h4>
                  {totalConflictos > 0 ? "⚠️" : "✅"} 
                  Estado del Grafo: {totalConflictos} conflicto(s) total(es)
                </h4>
                
                {nodosConflictivos.length > 0 && (
                  <div>
                    <strong style={{ color: "#e9e9e9" }}>Nodos con conflictos ({nodosConflictivos.length}):</strong>
                    <div className="nodos-conflictivos-grid">
                      {nodosConflictivos.map((nodo) => (
                        <button
                          key={nodo.valor}
                          onClick={() => {
                            setNodoARecolorear(nodo.valor.toString());
                            setProbabilidadInfo(null);
                          }}
                          className={`btn-nodo-conflictivo ${nodoARecolorear === nodo.valor.toString() ? 'selected' : ''}`}
                          style={{ background: nodo.color }}
                        >
                          Nodo {nodo.valor} ({nodo.conflictos} conflicto{nodo.conflictos > 1 ? "s" : ""})
                        </button>
                      ))}
                    </div>
                    <p className="hint-text">
                      💡 Haz clic en un nodo para seleccionarlo y recolorearlo
                    </p>
                  </div>
                )}
                
                {nodosConflictivos.length === 0 && (
                  <p style={{ margin: "0", color: "#3dd16b", fontWeight: "600" }}>
                    ✅ ¡Coloración válida! No hay conflictos en el grafo.
                  </p>
                )}
              </div>
            );
          })()}

          <div style={{ display: "flex", gap: "15px", alignItems: "flex-end", marginBottom: "15px" }}>
            <div>
              <label>Número de nodo:</label>
              <input
                type="number"
                value={nodoARecolorear}
                onChange={(e) => {
                  setNodoARecolorear(e.target.value);
                  setProbabilidadInfo(null);
                }}
                placeholder="Ej: 1"
                min={1}
                max={grafo.nodos.length}
                style={{ marginLeft: "10px", width: "80px", padding: "5px" }}
              />
            </div>

            <div>
              <label>Color nuevo:</label>
              <select
                value={colorNuevo}
                onChange={(e) => {
                  setColorNuevo(e.target.value);
                  setProbabilidadInfo(null);
                }}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value="">Seleccione color</option>
                {grafo.listaColores.map((c, idx) => (
                  <option key={idx} value={c} style={{ background: c, color: "#fff" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn-calcular-probabilidad" 
              onClick={calcularProbabilidad}
            >
              Calcular Probabilidad
            </button>

            <button 
              className="btn-aplicar-recoloreo" 
              onClick={recolorearNodo}
            >
              Aplicar Recoloración
            </button>
          </div>

          {probabilidadInfo && (
            <div className={`probabilidad-info ${probabilidadInfo.mejora ? 'mejora' : probabilidadInfo.empeora ? 'empeora' : 'neutro'}`}>
              <h4> Análisis de Probabilidad</h4>
              
              <div className={`probabilidad-value ${probabilidadInfo.mejora ? 'mejora' : probabilidadInfo.empeora ? 'empeora' : 'neutro'}`}>
                {probabilidadInfo.probabilidadExito}% de éxito
              </div>

              <div className="metricas-grid">
                <div className="metrica-item">
                  <strong>Conflictos actuales:</strong> {probabilidadInfo.conflictosAntes}
                </div>
                <div className="metrica-item">
                  <strong>Conflictos si se aplica:</strong> {probabilidadInfo.conflictosDespues}
                </div>
                <div className="metrica-item">
                  <strong>Cambio:</strong> 
                  <span style={{ color: probabilidadInfo.mejora ? "#3dd16b" : probabilidadInfo.empeora ? "#ff7070" : "#999" }}>
                    {probabilidadInfo.cambioConflictos > 0 ? "+" : ""}{probabilidadInfo.cambioConflictos}
                    {probabilidadInfo.mejora ? " ✓ Mejora" : probabilidadInfo.empeora ? " ✗ Empeora" : " - Sin cambio"}
                  </span>
                </div>
                <div className="metrica-item">
                  <strong>Vecinos que necesitan recoloración:</strong> {probabilidadInfo.vecinosQueNecesitanRecoloreo}
                </div>
              </div>

              {probabilidadInfo.vecinosConflictivos.length > 0 && (
                <div className="vecinos-box">
                  <strong>Nodos vecinos conflictivos:</strong> {probabilidadInfo.vecinosConflictivos.join(", ")}
                </div>
              )}
            </div>
          )}

          <div className="separador-busqueda">
            <button 
              className="btn-busqueda-local" 
              onClick={aplicarBusquedaLocal}
            >
               Aplicar Búsqueda Local (Optimización Automática)
            </button>
            <p className="hint-text">
              Utiliza algoritmo Greedy para encontrar la mejor coloración posible
            </p>
          </div>
        </div>
      )}

      {/* === EVALUACIÓN DE K === */}
      {grafo && (
        <div className="evaluacion-k-container">
          <button
            onClick={() => setMostrarEvaluacionK(!mostrarEvaluacionK)}
            className="btn-evaluacion-k"
          >
            {mostrarEvaluacionK ? "Ocultar" : "Mostrar"} Evaluación del Impacto de k
          </button>
          
          {mostrarEvaluacionK && <EvaluacionK grafo={grafo} />}
        </div>
      )}

    </div>
  );
}

export default App;
