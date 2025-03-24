import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import { registrarVentas, obtenerVentas, obtenerCarneUsada, obtenerPredicciones } from "../api/auth.js";
import AdminLayout from "../layouts/AdminLayout.jsx";

// Registramos los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// Constantes para el cálculo de carne por platillo (en kg)
const CONSUMO_POR_PLATILLO = {
  hamburguesa: 0.15, // 150g
  taco: 0.1, // 100g
  bolillo: 0.12, // 120g
  burrito: 0.25, // 250g
  gringa: 0.2, // 200g
  baguette: 0.2, // 200g
}

// Mapeo de nombres de columnas de la BD a nombres de platillos en la aplicación
const COLUMNAS_A_PLATILLOS = {
  hamburguesas: "hamburguesa",
  tacos: "taco",
  bolillos: "bolillo",
  burritos: "burrito",
  gringas: "gringa",
  baguettes: "baguette",
}

// Nombres de platillos para mostrar en la UI
const NOMBRES_PLATILLOS = {
  hamburguesa: "Hamburguesa",
  taco: "Taco",
  bolillo: "Bolillo",
  burrito: "Burrito",
  gringa: "Gringa",
  baguette: "Baguette",
}

// Colores para los diferentes platillos en las gráficas
const COLORES_PLATILLOS = {
  hamburguesa: "rgba(255, 99, 132, 0.7)",
  taco: "rgba(54, 162, 235, 0.7)",
  bolillo: "rgba(255, 206, 86, 0.7)",
  burrito: "rgba(75, 192, 192, 0.7)",
  gringa: "rgba(153, 102, 255, 0.7)",
  baguette: "rgba(255, 159, 64, 0.7)",
}

// Datos de ejemplo iniciales (se reemplazarán con datos de la API)
const initialData = []

export default function PrediccionesPage() {
  // Estado para los datos históricos
  const [historicalData, setHistoricalData] = useState(initialData)

  // Estado para el formulario de nueva entrada
  const [newEntry, setNewEntry] = useState({
    fechaInicio: "",
    fechaFin: "",
    ventas: {
      hamburguesa: 0,
      taco: 0,
      bolillo: 0,
      burrito: 0,
      gringa: 0,
      baguette: 0,
    },
  })

  // Estado para las predicciones
  const [predictions, setPredictions] = useState([])

    // Estado para indicar si está cargando
  const [isLoading, setIsLoading] = useState(false)

  // Estado para mensajes de notificación
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  // Estado para datos de depuración
  const [debugData, setDebugData] = useState({
    ventasData: null,
    carneData: null,
    prediccionesData: null,
    error: null,
  })

  // Función para mostrar notificaciones
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Cargar datos desde la API al iniciar
  useEffect(() => {
    fetchVentas()
  }, [])

  // Función para cargar datos desde la API
  const fetchVentas = async () => {
    try {
      setIsLoading(true)

      // Limpiar datos de depuración anteriores
      setDebugData({
        ventasData: null,
        carneData: null,
        prediccionesData: null,
        error: null,
      })

      // Obtener datos de ventas
      const ventasResponse = await obtenerVentas()
      const ventasData = ventasResponse.data

      // Guardar datos para depuración
      setDebugData((prev) => ({ ...prev, ventasData }))

      console.log("Datos de ventas recibidos:", ventasData)

      // Obtener datos de carne usada
      const carneResponse = await obtenerCarneUsada()
      const carneData = carneResponse.data

      // Guardar datos para depuración
      setDebugData((prev) => ({ ...prev, carneData }))

      console.log("Datos de carne usada recibidos:", carneData)

      // Obtener predicciones
      const prediccionesResponse = await obtenerPredicciones()
      const prediccionesData = prediccionesResponse.data

      // Guardar datos para depuración
      setDebugData((prev) => ({ ...prev, prediccionesData }))

      console.log("Datos de predicciones recibidos:", prediccionesData)

      // Procesar datos de ventas
      if (ventasData && ventasData.length > 0) {
        const formattedData = ventasData.map((ventaItem, index) => {
          // Buscar el registro correspondiente de carne usada por fecha
          const carneItem =
            carneData && carneData.length > 0
              ? carneData.find((item) => item.start_date === ventaItem.start_date)
              : null

          // Convertir las ventas de columnas a formato de objeto
          const ventasPorPlatillo = {}

          // Mapear las columnas de la BD a los nombres de platillos en la aplicación
          Object.keys(COLUMNAS_A_PLATILLOS).forEach((columna) => {
            if (ventaItem[columna] !== undefined) {
              const nombrePlatillo = COLUMNAS_A_PLATILLOS[columna]
              ventasPorPlatillo[nombrePlatillo] = Number(ventaItem[columna])
            }
          })

          // Calcular el número de semana basado en el índice (si no viene en los datos)
          const semana = index + 1

          return {
            id: ventaItem.id || semana,
            fechaInicio: ventaItem.start_date || "",
            fechaFin: ventaItem.end_date || "",
            semana: semana,
            ventas: ventasPorPlatillo,
            carneUsada: carneItem ? Number(carneItem.total_meat_kg) : 0,
          }
        })

        console.log("Datos formateados:", formattedData)
        setHistoricalData(formattedData)

        // Formatear las predicciones
        if (prediccionesData && prediccionesData.length > 0) {
          const formattedPredictions = prediccionesData.map((item) => {
            return {
              semana: item.week_number,
              carneUsada:
                typeof item.predicted_kg === "number"
                  ? item.predicted_kg.toFixed(2)
                  : Number(item.predicted_kg).toFixed(2),
            }
          })

          console.log("Predicciones formateadas:", formattedPredictions)
          setPredictions(formattedPredictions)
        }
      } else {
        console.warn("No se recibieron datos de ventas o el formato es incorrecto")
        showNotification("No se pudieron cargar los datos de ventas", "error")
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setDebugData((prev) => ({ ...prev, error: error.toString() }))
      showNotification("Error al cargar datos históricos: " + error.message, "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para calcular la carne usada basada en las ventas de platillos
  const calculateMeatUsed = (ventas) => {
    let total = 0

    for (const [platillo, cantidad] of Object.entries(ventas)) {
      total += cantidad * CONSUMO_POR_PLATILLO[platillo]
    }

    return total
  }

  // Función para manejar cambios en el formulario de ventas
  const handleSalesChange = (platillo, value) => {
    const ventasActualizadas = {
      ...newEntry.ventas,
      [platillo]: Number.parseInt(value) || 0,
    }

    setNewEntry({
      ...newEntry,
      ventas: ventasActualizadas,
    })
  }

  // Función para manejar cambios en las fechas
  const handleDateChange = (field, value) => {
    setNewEntry({
      ...newEntry,
      [field]: value,
    })
  }

  // Función para agregar nueva entrada
  const handleAddEntry = async (e) => {
    e.preventDefault()

    // Validación básica
    if (!newEntry.fechaInicio || !newEntry.fechaFin) {
      showNotification("Por favor ingrese las fechas de inicio y fin", "error")
      return
    }

    // Convertir el formato de ventas de la aplicación al formato de la BD
    const ventasParaAPI = {
      start_date: newEntry.fechaInicio,
      end_date: newEntry.fechaFin,
      // Convertir nombres de platillos a nombres de columnas
      hamburguesas: newEntry.ventas.hamburguesa,
      tacos: newEntry.ventas.taco,
      bolillos: newEntry.ventas.bolillo,
      burritos: newEntry.ventas.burrito,
      gringas: newEntry.ventas.gringa,
      baguettes: newEntry.ventas.baguette,
    }

    try {
      setIsLoading(true)

      console.log("Enviando datos a la API:", ventasParaAPI)

      // Enviar datos a la API
      const response = await registrarVentas(ventasParaAPI)
      console.log("Respuesta de la API:", response)

      // Actualizar datos históricos
      await fetchVentas()

      // Mostrar mensaje de éxito
      showNotification("Datos guardados correctamente")

      // Limpiar formulario
      setNewEntry({
        fechaInicio: "",
        fechaFin: "",
        ventas: {
          hamburguesa: 0,
          taco: 0,
          bolillo: 0,
          burrito: 0,
          gringa: 0,
          baguette: 0,
        },
      })
    } catch (error) {
      console.error("Error al guardar datos:", error)
      showNotification(error.response?.data?.message || "Error al guardar datos: " + error.message, "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Preparar datos para el gráfico de predicción
  const predictionChartData = {
    labels: [
      ...historicalData.map((item) => `Semana ${item.semana}`),
      ...predictions.map((item) => `Pred ${item.semana}`),
    ],
    datasets: [
      {
        label: "Datos Históricos",
        data: [...historicalData.map((item) => item.carneUsada), ...Array(predictions.length).fill(null)],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Predicciones",
        data: [
          ...Array(historicalData.length).fill(null),
          ...predictions.map((item) => Number.parseFloat(item.carneUsada)),
        ],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderDash: [5, 5],
        tension: 0.3,
      },
    ],
  }

  // Preparar datos para el gráfico de carne usada por semana
  const meatUsageChartData = {
    labels: historicalData.map((item) => `Semana ${item.semana}`),
    datasets: [
      {
        label: "Carne Usada (kg)",
        data: historicalData.map((item) => item.carneUsada),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
    ],
  }

  // Preparar datos para el gráfico de platillos vendidos por semana
  const dishesChartData = {
    labels: historicalData.map((item) => `Semana ${item.semana}`),
    datasets: Object.keys(CONSUMO_POR_PLATILLO).map((platillo) => ({
      label: NOMBRES_PLATILLOS[platillo],
      data: historicalData.map((item) => item.ventas[platillo] || 0),
      backgroundColor: COLORES_PLATILLOS[platillo],
      borderColor: COLORES_PLATILLOS[platillo].replace("0.7", "1"),
      borderWidth: 1,
    })),
  }

  // Calcular la compra recomendada (primera predicción)
  const recommendedPurchase = predictions.length > 0 ? Number.parseFloat(predictions[0].carneUsada) : 0

  // Encontrar el platillo más vendido
  const findMostPopularDish = () => {
    if (historicalData.length === 0) return null

    // Sumar todas las ventas por tipo de platillo
    const totalVentas = {}

    Object.keys(CONSUMO_POR_PLATILLO).forEach((platillo) => {
      totalVentas[platillo] = historicalData.reduce((sum, item) => sum + (item.ventas[platillo] || 0), 0)
    })

    // Encontrar el platillo con más ventas
    let maxVentas = 0
    let platilloMasVendido = ""

    Object.entries(totalVentas).forEach(([platillo, ventas]) => {
      if (ventas > maxVentas) {
        maxVentas = ventas
        platilloMasVendido = platillo
      }
    })

    return {
      nombre: NOMBRES_PLATILLOS[platilloMasVendido],
      cantidad: maxVentas,
    }
  }

  const platilloMasVendido = findMostPopularDish()

  return (
    <AdminLayout>
    <div className="container mx-auto px-4 py-8 relative">
      {/* Notificación */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "error" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Módulo Predictivo de Insumos - Smoke & Grill</h1>
        <p className="text-gray-500 mt-1">
          Predicción de compra de carne basada en modelo de crecimiento exponencial dP/dt=kP
        </p>
      </div>

      {/* Formulario para agregar datos */}
      <div className="border rounded-lg shadow-sm mb-8">
        <div className="p-4 border-b">
          <h3 className="font-medium">Registrar Ventas Semanales</h3>
          <p className="text-sm text-gray-500">Ingrese la cantidad de platillos vendidos</p>
        </div>
        <div className="p-4">
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={newEntry.fechaInicio}
                  onChange={(e) => handleDateChange("fechaInicio", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={newEntry.fechaFin}
                  onChange={(e) => handleDateChange("fechaFin", e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Platillos Vendidos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hamburguesas</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={newEntry.ventas.hamburguesa}
                    onChange={(e) => handleSalesChange("hamburguesa", e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">150g por unidad</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tacos</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={newEntry.ventas.taco}
                    onChange={(e) => handleSalesChange("taco", e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">100g por unidad</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bolillos</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={newEntry.ventas.bolillo}
                    onChange={(e) => handleSalesChange("bolillo", e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">120g por unidad</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Burritos</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={newEntry.ventas.burrito}
                    onChange={(e) => handleSalesChange("burrito", e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">250g por unidad</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gringas</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={newEntry.ventas.gringa}
                    onChange={(e) => handleSalesChange("gringa", e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">200g por unidad</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baguettes</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={newEntry.ventas.baguette}
                    onChange={(e) => handleSalesChange("baguette", e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">200g por unidad</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Carne Total Calculada:</p>
                  <p className="text-lg font-bold">{calculateMeatUsed(newEntry.ventas).toFixed(2)} kg</p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    "Registrar y Guardar en BD"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfica 1: Platillos vendidos por semana */}
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-medium">Platillos Vendidos por Semana</h3>
            <p className="text-sm text-gray-500">Comparativa de ventas por tipo de platillo</p>
          </div>
          <div className="p-4 h-[350px]">
            <Bar
              data={dishesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Ventas por Tipo de Platillo",
                  },
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Cantidad Vendida",
                    },
                  },
                },
              }}
            />
          </div>
          {platilloMasVendido && (
            <div className="p-4 border-t bg-green-50">
              <p className="font-medium">
                Platillo más vendido: <span className="text-green-700">{platilloMasVendido.nombre}</span> con{" "}
                {platilloMasVendido.cantidad} unidades en total
              </p>
            </div>
          )}
        </div>

        {/* Gráfica 2: Carne usada por semana */}
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-medium">Carne Usada por Semana</h3>
            <p className="text-sm text-gray-500">Consumo histórico de carne</p>
          </div>
          <div className="p-4 h-[350px]">
            <Line
              data={meatUsageChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Consumo Semanal de Carne de Res (kg)",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Kilogramos",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Modelo Predictivo */}
      <div className="border rounded-lg shadow-sm mb-8">
        <div className="p-4 border-b">
          <h3 className="font-medium">Modelo Predictivo</h3>
          <p className="text-sm text-gray-500">Visualización del crecimiento exponencial dP/dt=kP</p>
        </div>
        <div className="p-4 h-[300px]">
          <Line
            data={predictionChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Predicción de Consumo de Carne de Res (kg)",
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: "Kilogramos",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Tabla de datos históricos */}
        <div className="space-y-6">
          {/* Tabla de datos históricos */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-medium">Registro Histórico</h3>
              <p className="text-sm text-gray-500">Consumo semanal de carne</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Semana
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Periodo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Carne Usada (kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.semana}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.fechaInicio} - {item.fechaFin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {typeof item.carneUsada === "number" ? item.carneUsada.toFixed(2) : item.carneUsada}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detalle de ventas por semana */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-medium">Detalle de Ventas por Semana</h3>
              <p className="text-sm text-gray-500">Desglose de platillos vendidos</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Semana
                    </th>
                    <th
  scope="col"
  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
>
  Periodo
</th>


                      {Object.keys(NOMBRES_PLATILLOS).map((platillo) => (
                      <th
                        key={platillo}
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {NOMBRES_PLATILLOS[platillo]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{item.semana}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.fechaInicio} - {item.fechaFin}
</td>

                      {Object.keys(NOMBRES_PLATILLOS).map((platillo) => (
                        <td key={platillo} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.ventas[platillo] || 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna derecha: Predicciones */}
        <div className="space-y-6">
          {/* Predicciones */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-medium">Predicciones</h3>
              <p className="text-sm text-gray-500">Proyección basada en el modelo exponencial</p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-orange-50 text-orange-800 border-orange-200">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">Compra Recomendada</p>
                      <p>
                        Se recomienda comprar <span className="font-bold">{recommendedPurchase.toFixed(2)} kg</span> de
                        carne de res para la próxima semana.
                      </p>
                    </div>
                  </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Semana
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Carne Predicha (kg)
                      </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {predictions.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.semana}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {item.carneUsada} kg
                        </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
    </AdminLayout>
  )
}

