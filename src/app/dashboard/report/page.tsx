"use client";
import React, { useState } from "react";
import "@/reports/style/form.css";
import { ComparisonChart, Filters, Table } from "@/reports/components";
import { ChartsTab } from "@/reports/components/Charts";


export default function ReportPage() {

  const [view, setView] = useState<"table" | "charts">("table");
  const [filters, setFilters] = useState({
    humedal: "0",
    nodo: "",
    sensor: "",
  });
  const [filters2, setFilters2] = useState({
    humedal: "0",
    nodo: "",
    sensor: "",
  });
  const [compareMode, setCompareMode] = useState(false);
  const [secondHumedal, setSecondHumedal] = useState("Humedal 2");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Reportes</h1>
          <div className="space-x-2">
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded ${
                view === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Vista Tabla
            </button>
            <button
              onClick={() => setView("charts")}
              className={`px-4 py-2 rounded ${
                view === "charts"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Vista Gráficos
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r min-h-[calc(100vh-64px)] p-4 scrollbar  overflow-y-auto ">
          {/* <WetlandCard title="Humedal 1" /> */}
          {/* <WetlandCard title="Humedal 2" /> */}
          <Filters 
            filters={filters}
            title="Humedal 1"
            onFilterChange={setFilters}
            compareMode={compareMode}
            secondHumedal={secondHumedal}
            onSecondHumedalChange={setSecondHumedal}
            view={view}

          />
          {compareMode &&
          <Filters 
          filters={filters2}
          title="Humedal 2" 
          onFilterChange={setFilters2}
          compareMode={compareMode}
          secondHumedal={secondHumedal}
          onSecondHumedalChange={setSecondHumedal}
          view={view}
        />
          }
          
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {view === "table" ? (
            <Table filters={filters} />
          ):(
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
              
             { compareMode ? (
                <ComparisonChart 
                  filters={filters}
                  filters2={filters2}
                  secondHumedal={secondHumedal}
                />
              ) : 
                <ChartsTab filters={filters} />
                // null
              }
            
            </div>

            )}

            
        </div>
      </div>
    </div>
  );
}

// export default App;
