"use client"


import { Table, Filters,Charts } from "@/reports/components";
import { useState } from "react";

 export default function ReportPage () {

    const [view, setView] = useState<'table' | 'charts'>('table');
    const [filters, setFilters] = useState({
      humedal: '0',
      nodo: '',
      sensor: ''
    });
    const [compareMode, setCompareMode] = useState(false);
    const [secondHumedal, setSecondHumedal] = useState('Humedal 2');
    // const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
    // const data = await response.json();
    // console.log({data});

    return (
        <section className="container mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded ${
                view === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Vista Tabla
            </button>
            <button
              onClick={() => setView('charts')}
              className={`px-4 py-2 rounded ${
                view === 'charts' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Vista Gráficos
            </button>
          </div>
        </div>

       <div className="bg-white rounded-lg shadow-md p-7 mb-6  w-auto">
          <Filters 
            filters={filters} 
            onFilterChange={setFilters}
            compareMode={compareMode}
            secondHumedal={secondHumedal}
            onSecondHumedalChange={setSecondHumedal}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {view === 'table' ? (
            <Table filters={filters} />
  
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Visualización de datos</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={compareMode}
                      onChange={(e) => setCompareMode(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Comparar humedales</span>
                  </label>
                </div>
              </div>
              
              {/* compareMode ? (
                <ComparisonChart 
                  filters={filters}
                  secondHumedal={secondHumedal}
                />
              ) : ( */
                <Charts filters={filters} />
              // )
              }
            </div>
          )}
        </div> 
      </section>
    );
};
