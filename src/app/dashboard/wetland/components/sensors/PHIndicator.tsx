import React from 'react';
import ReactECharts from 'echarts-for-react';
import { min } from 'date-fns';

// Función para determinar el color según el nivel de pH
const getColorForPH = (ph: number) => {
    if (ph < 7) {
        return '#ff4500'; // Rojizo para ácido
    } else if (ph === 7) {
        return '#ffcc00'; // Amarillo para neutro
    } else {
        return '#32cd32'; // Verde para alcalino
    }
};

const PHGaugeChart: React.FC<{ value: number }> = ({ value }) => {
    // Validar que el nivel de pH esté en el rango permitido (0 a 14)
    // const normalizedPHLevel = Math.min(Math.max(value, 0), 14);

    // Escalar el nivel de pH al rango de 0 a 100
    const scaledPHLevel = (value / 14) * 100;

    // Definir el degradado dinámico basado en el nivel de pH
    const getGradientColor = (ph: number): [string, string] => {
        if (ph <= 1) return ['#FF0000', '#FF3300']; // Rojo intenso a rojo anaranjado
        if (ph <= 2) return ['#FF3300', '#FF6600']; // Rojo anaranjado a naranja intenso
        if (ph <= 3) return ['#FF6600', '#FFA500']; // Naranja intenso a naranja claro
        if (ph <= 4) return ['#FFA500', '#FFD700']; // Naranja claro a amarillo dorado
        if (ph <= 5) return ['#FFD700', '#FFFF00']; // Amarillo dorado a amarillo
        if (ph <= 6) return ['#FFFF00', '#ADFF2F']; // Amarillo a verde lima
        if (ph <= 6.9) return ['#ADFF2F', '#32CD32']; // Verde lima a verde claro
        if (ph === 7) return ['#32CD32', '#32CD32']; // Verde claro (neutro fijo)
        if (ph <= 8) return ['#32CD32', '#00CED1']; // Verde claro a cian claro
        if (ph <= 9) return ['#00CED1', '#40E0D0']; // Cian claro a turquesa
        if (ph <= 10) return ['#40E0D0', '#1E90FF']; // Turquesa a azul claro
        if (ph <= 11) return ['#1E90FF', '#0000FF']; // Azul claro a azul intenso
        if (ph <= 12) return ['#0000FF', '#8A2BE2']; // Azul intenso a violeta
        if (ph <= 13) return ['#8A2BE2', '#9400D3']; // Violeta a púrpura
        if (ph === 14) return ['#9400D3', '#9400D3']; // Púrpura fijo
        return ['#D3D3D3', '#D3D3D3']; // Gris como fallback
    };

    const gradientColors = getGradientColor(value);

    // Opciones del gráfico
    const options = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c} pH',
        },
        series: [
            {
                name: 'Nivel de pH',
                type: 'gauge',
                center: ['50%', '60%'],
                radius: '80%',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 14,
                // splitNumber: 14, // Divisiones para representar valores de pH de 0 a 14
                axisLine: {
                    lineStyle: {
                        width: 30,
                        color: [
                            [scaledPHLevel / 100, { // Hasta el nivel del pH escalado
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [
                                    { offset: 0, color: gradientColors[0] },
                                    { offset: 1, color: gradientColors[1] },
                                ],
                            }],
                            [1, '#D3D3D3'],            // El resto de la elipse (gris claro)
                        ],
                    },
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 14,
                    distance: 25,
                    formatter: (value: number) => {
                        console.log(value);
                        if (value === 0) return 'Ácido';
                        if (value === 7) return 'Neutro';
                        if (value === 14) return 'Alcalino';
                        return ''; // El resto de etiquetas se omiten
                    },
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '12%',
                    width: 15,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value} pH',
                    fontSize: 16,
                    color: 'auto',
                    // offsetCenter: [0, '60%'],
                },
                data: [ { value: value },
                ],
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <ReactECharts option={options} />
        </div>
    );
};

export default PHGaugeChart;
