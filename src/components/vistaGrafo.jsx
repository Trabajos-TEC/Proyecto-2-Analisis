import { useEffect, useRef } from "react";
import "./vistaGrafo.css";

export default function GraphView({ grafo }) {
  const canvasRef = useRef(null);

  // efecto para ajustar tamaño del canvas al contenedor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      recalcularPosiciones();
      drawAll(grafo);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [grafo]);

  // guardamos posiciones y selección en refs para que los handlers las lean sin
  // necesidad de re-renderizar componente
  const posicionesRef = useRef([]);
  const selectedRef = useRef(null);

  // función que dibuja todo (la usamos desde distintos lugares)
  function drawAll(currentGrafo) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentGrafo || !currentGrafo.nodos || currentGrafo.nodos.length === 0)
      return;

    const maxSize = 22;   // tamaño del nodo con pocos nodos
    const minSize = 4;    // tamaño mínimo con muchos nodos

    const N = currentGrafo.nodos.length;

    // límite superior del rango
    const Nmax = 160; 

    // proporción directa según cantidad de nodos
    let proporcion = Math.min(1, N / Nmax);

    // tamaño final del nodo
    const nodoRadio = maxSize - (maxSize - minSize) * proporcion;


    const posiciones = posicionesRef.current;
    // Dibujar aristas (solo una vez por arista: j > i)
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1.5;
    currentGrafo.nodos.forEach((nodo, i) => {
      nodo.vecinos.forEach((vecino) => {
        const j = currentGrafo.nodos.indexOf(vecino);
        if (j > i) {
          ctx.beginPath();

          // detectar conflicto coloreo 
          const mismoColor =
            nodo.color &&
            vecino.color &&
            nodo.color === vecino.color;

          // Si hay conflicto, pinta arista roja; si no, gris
          ctx.strokeStyle = mismoColor ? "red" : "#888";
          ctx.lineWidth = mismoColor ? 2.5 : 1.5;

          ctx.moveTo(posiciones[i].x, posiciones[i].y);
          ctx.lineTo(posiciones[j].x, posiciones[j].y);
          ctx.stroke();
        }
      });
    });

    // Dibujar nodos
    currentGrafo.nodos.forEach((nodo, i) => {
      const { x, y } = posiciones[i];

      // si está seleccionado, dibujamos resaltado (circunferencia más gruesa)
      if (selectedRef.current === i) {
        ctx.beginPath();
        ctx.arc(x, y, nodoRadio + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = "#f39c12";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // círculo sin relleno (no color de coloreo todavía)
      ctx.beginPath();
      ctx.arc(posiciones[i].x, posiciones[i].y, nodoRadio, 0, 2 * Math.PI);

      if (nodo.color && nodo.color !== "") {
        ctx.fillStyle = nodo.color;
        ctx.fill();
      }

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // número en círculo exterior
      const posTxt = posicionesRef.currentTexto[i];
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(nodo.valor, posTxt.x, posTxt.y);

    });
  }

  // cuando cambia el grafo, calculamos posiciones (círculo) y dibujamos
  useEffect(() => {
    recalcularPosiciones();
    drawAll(grafo);
  }, [grafo]);

function recalcularPosiciones() {
  if (!grafo || !grafo.nodos || grafo.nodos.length === 0) {
    posicionesRef.current = [];
    return;
  }

  const canvas = canvasRef.current;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Ajusta radio para que quepa bien dentro del canvas
  const radio = Math.min(canvas.width, canvas.height) / 3.0;
  const step = (2 * Math.PI) / grafo.nodos.length;

  const posiciones = grafo.nodos.map((_, i) => {
    const angle = i * step;
    return {
      x: centerX + radio * Math.cos(angle),
      y: centerY + radio * Math.sin(angle),
    };
  });

  posicionesRef.current = posiciones;

  // === círculo exterior para los números ===
  const radioTexto = radio + 35;

  posicionesRef.currentTexto = grafo.nodos.map((_, i) => {
    const angle = i * step;
    return {
      x: centerX + radioTexto * Math.cos(angle),
      y: centerY + radioTexto * Math.sin(angle),
      angle
    };
  });

  selectedRef.current = null;
}


  // manejador de clicks para seleccionar/nodos y crear arista
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onClick(ev) {
      if (!grafo || !grafo.nodos || grafo.nodos.length === 0) return;

      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (ev.clientX - rect.left) * scaleX;
      const y = (ev.clientY - rect.top) * scaleY;

      const posiciones = posicionesRef.current;
      const nodoRadio = 14;
      const clickTolerance = 18;

      let foundIndex = -1;
      for (let i = 0; i < posiciones.length; i++) {
        const dx = posiciones[i].x - x;
        const dy = posiciones[i].y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= clickTolerance) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        selectedRef.current = null;
        drawAll(grafo);
        return;
      }

      if (selectedRef.current === null) {
        selectedRef.current = foundIndex;
        drawAll(grafo);
        return;
      }

      const a = selectedRef.current;
      const b = foundIndex;

      if (a === b) {
        selectedRef.current = null;
        drawAll(grafo);
        return;
      }

      const nodoA = grafo.nodos[a];
      const nodoB = grafo.nodos[b];
      const existe = nodoA.vecinos.includes(nodoB);

      if (!existe) {
        if (typeof grafo.agregarArista === "function") {
          try {
            grafo.agregarArista(nodoA, nodoB);
          } catch (e) {
            nodoA.vecinos.push(nodoB);
            nodoB.vecinos.push(nodoA);
          }
        } else {
          nodoA.vecinos.push(nodoB);
          nodoB.vecinos.push(nodoA);
        }
      }

      selectedRef.current = null;
      drawAll(grafo);
    }

    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
  }, [grafo]);

  return (
    <div className="graph-container">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
