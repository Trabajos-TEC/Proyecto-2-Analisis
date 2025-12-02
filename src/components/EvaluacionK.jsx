import { useState } from "react";
import { busquedaLocalGreedy } from "../busquedaLocal.js";
import { crearCopiaGrafo } from "../prototipo.js";
import "./EvaluacionK.css";

/**
 * Componente para evaluar el impacto del número de colores (k) en el grafo actual
 */
export default function EvaluacionK({ grafo }) {
  // Inicializar valores basados en el k actual del grafo
  const kActual = grafo ? grafo.k : 5;
  const [kMin, setKMin] = useState(Math.max(3, kActual - 2));
  const [kMax, setKMax] = useState(kActual + 3);
  const [intentosPorK, setIntentosPorK] = useState(10);
  const [resultados, setResultados] = useState(null);
  const [evaluando, setEvaluando] = useState(false);

  const ejecutarEvaluacion = async () => {
    if (!grafo) {
      alert("Debe generar un grafo primero.");
      return;
    }
    
    setEvaluando(true);
    
    setTimeout(() => {
      const resultadosK = [];
      
      // Guardar estructura del grafo original (solo estructura, no colores)
      const estructuraOriginal = {
        nodos: grafo.nodos.length,
        aristas: grafo.nodos.map(n => ({
          valor: n.valor,
          vecinos: n.vecinos.map(v => v.valor)
        }))
      };
      
      for (let k = kMin; k <= kMax; k++) {
        let exitosos = 0;
        let tiempoTotal = 0;
        let conflictosTotal = 0;
        let iteracionesTotal = 0;
        
        for (let intento = 0; intento < intentosPorK; intento++) {
          // Crear copia COMPLETA del grafo con nuevo k
          const copiaGrafo = crearCopiaGrafo(grafo);
          copiaGrafo.k = k;
          copiaGrafo.agregarColores();
          copiaGrafo.asignarColoresAleatoriamente();
          
          const inicio = performance.now();
          const resultado = busquedaLocalGreedy(copiaGrafo, 100);
          const fin = performance.now();
          
          if (resultado.exito) exitosos++;
          tiempoTotal += (fin - inicio);
          conflictosTotal += resultado.conflictosFinales;
          iteracionesTotal += resultado.iteraciones;
        }
        
        resultadosK.push({
          k,
          tasaExito: ((exitosos / intentosPorK) * 100).toFixed(1),
          tiempoPromedio: (tiempoTotal / intentosPorK).toFixed(2),
          conflictosPromedio: (conflictosTotal / intentosPorK).toFixed(1),
          iteracionesPromedio: (iteracionesTotal / intentosPorK).toFixed(1),
          intentosExitosos: exitosos,
          totalIntentos: intentosPorK
        });
      }
      
      setResultados(resultadosK);
      setEvaluando(false);
    }, 100);
  };

  if (!grafo) {
    return (
      <div className="evaluacion-k-container disabled">
        <h3 className="section-title">Evaluación del Impacto de k</h3>
        <p className="info-message">Genere un grafo primero para evaluar el impacto del número de colores.</p>
      </div>
    );
  }

  return (
    <div className="evaluacion-k-container">
      <div className="section-header">
        <h3 className="section-title">Evaluación del Impacto de k</h3>
        <p className="section-description">
          Analiza cómo diferentes valores de k (número de colores) afectan la capacidad de colorear el grafo actual ({grafo.nodos.length} nodos, {grafo.nodos.reduce((sum, n) => sum + n.vecinos.length, 0) / 2} aristas).
          Esta evaluación prueba múltiples valores de k sobre la misma estructura del grafo para determinar el número óptimo de colores.
        </p>
      </div>
      
      <div className="config-grid">
        <div className="input-group">
          <label className="input-label">k Mínimo</label>
          <input
            type="number"
            value={kMin}
            onChange={(e) => setKMin(Number(e.target.value))}
            min={3}
            className="input-field"
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">k Máximo</label>
          <input
            type="number"
            value={kMax}
            onChange={(e) => setKMax(Number(e.target.value))}
            min={kMin}
            className="input-field"
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">Intentos por k</label>
          <input
            type="number"
            value={intentosPorK}
            onChange={(e) => setIntentosPorK(Number(e.target.value))}
            min={1}
            max={20}
            className="input-field"
          />
        </div>
      </div>
      
      <button
        onClick={ejecutarEvaluacion}
        disabled={evaluando}
        className={`btn-primary ${evaluando ? 'disabled' : ''}`}
      >
        {evaluando ? "Evaluando..." : "Ejecutar Evaluación"}
      </button>
      
      {resultados && (
        <div className="resultados-section">
          <h4 className="subsection-title">Resultados Comparativos</h4>
          
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>k (Colores)</th>
                  <th>Tasa de Éxito</th>
                  <th>Tiempo Prom. (ms)</th>
                  <th>Conflictos Prom.</th>
                  <th>Iteraciones Prom.</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r, idx) => (
                  <tr key={idx} className={parseFloat(r.tasaExito) === 100 ? 'success-row' : ''}>
                    <td className="k-value">{r.k}</td>
                    <td className="tasa-exito">
                      <span className={`badge ${
                        parseFloat(r.tasaExito) === 100 ? 'success' : 
                        parseFloat(r.tasaExito) >= 50 ? 'warning' : 'error'
                      }`}>
                        {r.tasaExito}%
                      </span>
                      <span className="ratio">({r.intentosExitosos}/{r.totalIntentos})</span>
                    </td>
                    <td>{r.tiempoPromedio}</td>
                    <td>{r.conflictosPromedio}</td>
                    <td>{r.iteracionesPromedio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="insights-grid">
            <div className="insight-card success">
              <div className="insight-label">Mejor k (Éxito)</div>
              {(() => {
                const mejor = resultados.reduce((prev, curr) => 
                  parseFloat(curr.tasaExito) > parseFloat(prev.tasaExito) ? curr : prev
                );
                return (
                  <>
                    <div className="insight-value">k = {mejor.k}</div>
                    <div className="insight-detail">{mejor.tasaExito}% de éxito</div>
                  </>
                );
              })()}
            </div>
            
            <div className="insight-card info">
              <div className="insight-label">Más Rápido</div>
              {(() => {
                const rapido = resultados.reduce((prev, curr) => 
                  parseFloat(curr.tiempoPromedio) < parseFloat(prev.tiempoPromedio) ? curr : prev
                );
                return (
                  <>
                    <div className="insight-value">k = {rapido.k}</div>
                    <div className="insight-detail">{rapido.tiempoPromedio} ms</div>
                  </>
                );
              })()}
            </div>
            
            <div className="insight-card warning">
              <div className="insight-label">Menos Conflictos</div>
              {(() => {
                const menosConflictos = resultados.reduce((prev, curr) => 
                  parseFloat(curr.conflictosPromedio) < parseFloat(prev.conflictosPromedio) ? curr : prev
                );
                return (
                  <>
                    <div className="insight-value">k = {menosConflictos.k}</div>
                    <div className="insight-detail">{menosConflictos.conflictosPromedio} conflictos</div>
                  </>
                );
              })()}
            </div>
          </div>
          
          <div className="conclusion-box">
            <h5 className="conclusion-title">Conclusión</h5>
            <p className="conclusion-text">
              {(() => {
                const tasasExito = resultados.map(r => parseFloat(r.tasaExito));
                const mejorTasa = Math.max(...tasasExito);
                const mejorK = resultados.find(r => parseFloat(r.tasaExito) === mejorTasa);
                
                if (mejorTasa === 100) {
                  const primerExito = resultados.find(r => parseFloat(r.tasaExito) === 100);
                  return `El grafo puede ser coloreado exitosamente con k = ${primerExito.k} colores. 
                          Este es el número mínimo de colores que garantiza una solución válida en todos los casos probados.`;
                } else {
                  return `El mejor resultado se obtiene con k = ${mejorK.k} colores (${mejorK.tasaExito}% de éxito). 
                          Considere aumentar el número de colores o aplicar técnicas de búsqueda local más avanzadas.`;
                }
              })()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
