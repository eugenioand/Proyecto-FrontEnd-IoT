import React from "react";
import ReactECharts from "echarts-for-react";

// Función para determinar el degradado dinámico basado en el nivel de pH
const getGradientColor = (ph: number): [string, string] => {
  if (ph <= 1) return ["#FF0000", "#FF3300"]; // Rojo intenso a rojo anaranjado
  if (ph <= 2) return ["#FF3300", "#FF6600"]; // Rojo anaranjado a naranja intenso
  if (ph <= 3) return ["#FF6600", "#FFA500"]; // Naranja intenso a naranja claro
  if (ph <= 4) return ["#FFA500", "#FFD700"]; // Naranja claro a amarillo dorado
  if (ph <= 5) return ["#FFD700", "#FFFF00"]; // Amarillo dorado a amarillo
  if (ph <= 6) return ["#FFFF00", "#ADFF2F"]; // Amarillo a verde lima
  if (ph <= 6.9) return ["#ADFF2F", "#32CD32"]; // Verde lima a verde claro
  if (ph === 7) return ["#32CD32", "#32CD32"]; // Verde claro (neutro fijo)
  if (ph <= 8) return ["#32CD32", "#00CED1"]; // Verde claro a cian claro
  if (ph <= 9) return ["#00CED1", "#40E0D0"]; // Cian claro a turquesa
  if (ph <= 10) return ["#40E0D0", "#1E90FF"]; // Turquesa a azul claro
  if (ph <= 11) return ["#1E90FF", "#0000FF"]; // Azul claro a azul intenso
  if (ph <= 12) return ["#0000FF", "#8A2BE2"]; // Azul intenso a violeta
  if (ph <= 13) return ["#8A2BE2", "#9400D3"]; // Violeta a púrpura
  if (ph === 14) return ["#9400D3", "#9400D3"]; // Púrpura fijo
  return ["#D3D3D3", "#D3D3D3"]; // Gris como fallback
};

 const PHGaugeChart1: React.FC<{ value: number }> = ({ value }) => {
  // Validar y escalar el nivel de pH al rango de 0 a 100
  const normalizedPHLevel = Math.max(0, Math.min(value, 14));
  const scaledPHLevel = (normalizedPHLevel / 14) * 100;
  const gradientColors = getGradientColor(normalizedPHLevel);

  const options = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c} pH",
    },
    series: [
      {
        name: "Nivel de pH",
        type: "gauge",
        center: ["50%", "60%"],
        radius: "90%",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 14,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [
                scaledPHLevel / 100,
                {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: gradientColors[0] },
                    { offset: 1, color: gradientColors[1] },
                  ],
                },
              ],
              [1, "#D3D3D3"],
            ],
          },
        },
        pointer: {
          length: "70%",
          width: 6,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value} pH",
          fontSize: 16,
        },
        data: [{ value: normalizedPHLevel }],
      },
    ],
  };

  return (
    <div
      className="  "
      style={{
        width: "100%",
        height: "250px",
        position: "relative",
        maxWidth: "300px",
        margin: "0 auto",
      }}
    >
      <ReactECharts
        option={options}
        style={{ width: "100%", height: "100%", maxWidth: "300px" }}
      />
    </div>
  );
};

export const PHGaugeChart = React.memo(PHGaugeChart1);
