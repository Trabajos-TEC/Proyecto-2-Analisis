import { useEffect, useRef, useState } from "react";

/**
 * Nombre: GraficoConflictosCanvas
 * Descripción: Componente React que visualiza la evolución de conflictos a lo largo
 *              de las iteraciones de un algoritmo de coloración.
 * Entradas:
 *   - datos: Array de números representando conflictos por iteración
 */
export default function GraficoConflictosCanvas({ datos }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset] = useState(0); // offset congelado
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!datos || datos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 350;

    ctx.fillStyle = "#0e0e0e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const margin = 50;
    const w = canvas.width - margin * 2;
    const h = canvas.height - margin * 2;

    const visibleCount = Math.max(50, Math.floor(datos.length / zoom));
    const startIndex = 0;
    const endIndex = Math.min(visibleCount, datos.length);
    const slice = datos.slice(startIndex, endIndex);

    const maxPoints = 1500;
    const step = Math.ceil(slice.length / maxPoints);

    const puntos = [];
    for (let i = 0; i < slice.length; i += step) {
      puntos.push({ iter: startIndex + i, conf: slice[i] });
    }

    if (puntos.length < 2) return;

    const maxY = Math.max(...puntos.map(p => p.conf));
    const minY = Math.min(...puntos.map(p => p.conf));
    const rangeY = maxY - minY || 1;

    const scaleX = w / (puntos.length - 1);
    const scaleY = h / rangeY;

    // GRID
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    const divisiones = 5;
    for (let i = 0; i <= divisiones; i++) {
      const y = margin + (h / divisiones) * i;

      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(margin + w, y);
      ctx.stroke();

      const valor = maxY - (rangeY / divisiones) * i;
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(valor.toFixed(0), 10, y + 4);
    }

    // EJE X
    ctx.fillStyle = "white";
    ctx.fillText("Iteraciones", margin + w / 2 - 30, canvas.height - 10);
    ctx.fillText(startIndex.toString(), margin, margin + h + 20);
    ctx.fillText((endIndex - 1).toString(), margin + w - 40, margin + h + 20);

    // LÍNEA
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 0, 200, 0.7)";
    ctx.beginPath();

    let prevX = null;
    let prevY = null;

    puntos.forEach((p, i) => {
      const x = margin + i * scaleX;
      const y = margin + h - (p.conf - minY) * scaleY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.quadraticCurveTo(prevX, prevY, x, y);

      prevX = x;
      prevY = y;
    });

    ctx.stroke();

    // PROMEDIO
    const prom = slice.reduce((a, b) => a + b, 0) / slice.length;
    const yProm = margin + h - (prom - minY) * scaleY;

    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(margin, yProm);
    ctx.lineTo(margin + w, yProm);
    ctx.stroke();

    ctx.fillStyle = "yellow";
    ctx.fillText(`Prom: ${prom.toFixed(1)}`, margin + 10, yProm - 5);

    // TOOLTIP
    if (tooltip) {
      const { mouseX, mouseY } = tooltip;

      let closest = null;
      let minDist = Infinity;

      puntos.forEach((p, i) => {
        const x = margin + i * scaleX;
        const y = margin + h - (p.conf - minY) * scaleY;

        const dist = Math.abs(mouseX - x);
        if (dist < minDist) {
          minDist = dist;
          closest = { x, y, iter: p.iter, conf: p.conf };
        }
      });

      if (closest) {
        ctx.fillStyle = "magenta";
        ctx.beginPath();
        ctx.arc(closest.x, closest.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(closest.x + 10, closest.y - 30, 120, 40);

        ctx.strokeStyle = "white";
        ctx.strokeRect(closest.x + 10, closest.y - 30, 120, 40);

        ctx.fillStyle = "white";
        ctx.fillText(`Iter: ${closest.iter}`, closest.x + 15, closest.y - 12);
        ctx.fillText(`Conf: ${closest.conf}`, closest.x + 15, closest.y + 4);
      }
    }
  }, [datos, zoom, offset, tooltip]);

  // ==== ZOOM ====
  function handleWheel(e) {
    e.preventDefault();

    const factor = 0.1;
    if (e.deltaY < 0) setZoom(z => Math.min(10, z + factor));
    else setZoom(z => Math.max(1, z - factor));
  }

  // Habilitar wheel con passive: false
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    canvas.addEventListener("wheel", wheelHandler, { passive: false });
    return () => canvas.removeEventListener("wheel", wheelHandler);
  }, []);

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <h3 style={{ color: "white" }}>Evolución de conflictos por iteración</h3>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", cursor: "crosshair" }}
        onMouseMove={(e) =>
          setTooltip({
            mouseX: e.nativeEvent.offsetX,
            mouseY: e.nativeEvent.offsetY,
          })
        }
        onMouseLeave={() => setTooltip(null)}
      />
    </div>
  );
}
