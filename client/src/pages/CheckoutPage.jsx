"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contex/CartContext"
import { AuthContext } from "../contex/AuthContext"
import ClientLayout from "../layouts/ClientLayaut"

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: user?.nombre || "",
    email: user?.email || "",
    phone: user?.telefono || "",
    address: "", // Solo este campo para la dirección completa
    paymentMethod: "cash",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [completedOrderTotal, setCompletedOrderTotal] = useState(0)

  // Calcular totales
  const subtotal = cartTotal
  const totalWithTax = subtotal

  // URL de la API - ajusta según tu configuración
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Validación mejorada del formulario
  const validateForm = () => {
    const newErrors = {}

    // Validación del nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "El nombre no puede exceder 50 caracteres"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name.trim())) {
      newErrors.name = "El nombre solo puede contener letras y espacios"
    }

    // Validación del email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Por favor ingresa un email válido"
    } else if (formData.email.trim().length > 100) {
      newErrors.email = "El email no puede exceder 100 caracteres"
    }

    // Validación del teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    } else {
      // Limpiar el teléfono de espacios y caracteres especiales para validación
      const cleanPhone = formData.phone.replace(/[\s\-$$$$+]/g, "")
      if (!/^\d{10,15}$/.test(cleanPhone)) {
        newErrors.phone = "El teléfono debe tener entre 10 y 15 dígitos"
      }
    }

    // Validación de la dirección
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida"
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "La dirección debe ser más específica (mínimo 10 caracteres)"
    } else if (formData.address.trim().length > 200) {
      newErrors.address = "La dirección no puede exceder 200 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Formatear teléfono mientras se escribe
  const formatPhoneNumber = (value) => {
    // Remover todo excepto números
    const phoneNumber = value.replace(/[^\d]/g, "")

    // Formatear según la longitud
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
    } else if (phoneNumber.length <= 10) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
    } else {
      // Para números internacionales
      return `+${phoneNumber.slice(0, phoneNumber.length - 10)} ${phoneNumber.slice(-10, -7)}-${phoneNumber.slice(-7, -4)}-${phoneNumber.slice(-4)}`
    }
  }

  // Manejar cambio en teléfono con formato
  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    setFormData((prev) => ({
      ...prev,
      phone: formattedValue,
    }))

    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }))
    }
  }

  // Registrar pedido para efectivo al entregar
  const handleCompletarPedido = async () => {
    // Validar formulario primero
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    // Validaciones adicionales antes de enviar
    if (!user || !user.id) {
      alert("Error: No se pudo identificar al usuario. Por favor inicia sesión nuevamente.")
      return
    }

    if (totalWithTax <= 0) {
      alert("Error: El total del pedido debe ser mayor a $0.00")
      return
    }

    // Validar que los productos tengan precios válidos
    const invalidProducts = cartItems.filter((item) => {
      const price = item.selectedSize ? item.selectedSize.Precio : item.price
      return !price || price <= 0
    })

    if (invalidProducts.length > 0) {
      alert("Error: Algunos productos no tienen un precio válido. Por favor actualiza tu carrito.")
      return
    }

    // Verificar que hay productos en el carrito
    if (!cartItems || cartItems.length === 0) {
      alert("No hay productos en el carrito")
      return
    }

    // Verificar método de pago
    if (formData.paymentMethod === "card") {
      alert("Los pagos con tarjeta no están disponibles por el momento. Por favor selecciona 'Efectivo al entregar'.")
      return
    }

    setIsSubmitting(true)

    try {
      // Formatear productos para el backend
      const productosFormateados = cartItems.map((item) => ({
        id: item.id,
        cantidad: item.quantity,
      }))

      // Datos para enviar al backend - INCLUIR DATOS DEL USUARIO
      const pedidoData = {
        usuarioId: user.id,
        direccionEnvio: formData.address,
        productos: productosFormateados,
        total: totalWithTax,
        datosUsuario: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      }

      console.log("=== DEBUG INFO ===")
      console.log("API_URL:", API_URL)
      console.log("User:", user)
      console.log("Cart Items:", cartItems)
      console.log("Productos Formateados:", productosFormateados)
      console.log("Pedido Data:", pedidoData)
      console.log("Token:", localStorage.getItem("token"))
      console.log("==================")

      // Realizar petición al backend
      const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(pedidoData),
      })

      console.log("Response status:", response.status)

      // Intentar obtener el texto de la respuesta para debugging
      const responseText = await response.text()
      console.log("Response text:", responseText)

      if (!response.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch (e) {
          errorData = { message: responseText || "Error del servidor" }
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      // Intentar parsear como JSON
      let pedidoCreado
      try {
        pedidoCreado = JSON.parse(responseText)
      } catch (e) {
        throw new Error("Respuesta del servidor no es JSON válido")
      }

      console.log("Pedido creado:", pedidoCreado)

      // Guardar el total antes de limpiar el carrito
      setCompletedOrderTotal(totalWithTax)

      // Generar número de orden
      const randomOrderNumber = pedidoCreado.id || Math.floor(100000 + Math.random() * 900000).toString()
      setOrderNumber(randomOrderNumber)

      // Marcar como completado
      setOrderComplete(true)
      clearCart() // Limpiar carrito DESPUÉS de guardar el total

      alert("¡Pedido registrado exitosamente!")
    } catch (error) {
      console.error("Error completo:", error)
      console.error("Error stack:", error.stack)
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Formatear fecha de expiración
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Manejar cambio en número de tarjeta
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    setFormData((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }))

    if (errors.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }))
    }
  }

  // Manejar cambio en fecha de expiración
  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiry(e.target.value)
    setFormData((prev) => ({
      ...prev,
      cardExpiry: formattedValue,
    }))

    if (errors.cardExpiry) {
      setErrors((prev) => ({
        ...prev,
        cardExpiry: "",
      }))
    }
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Si no hay productos en el carrito y no es una orden completada, redirigir al carrito
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No puedes proceder al pago sin productos en tu carrito.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Ir al Menú
            </button>
          </div>
        </div>
      </ClientLayout>
    )
  }

  // Contenido principal del checkout
  const checkoutContent = (
    <div className="container mx-auto px-4 py-8 flex-grow">
      {orderComplete ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">¡Pedido Completado!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Tu pedido ha sido registrado correctamente. Nuestro equipo comenzará a prepararlo de inmediato.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              Número de Pedido: <span className="font-bold">#{orderNumber}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Total: <span className="font-bold">{formatPrice(completedOrderTotal)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Método de pago: <span className="font-bold">Efectivo al entregar</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/inicioCliente")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate("/MenuPrincipal")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario de pago */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Información de Entrega</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Información personal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    maxLength="50"
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    maxLength="100"
                    className={`w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="555-123-4567"
                    maxLength="20"
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1">Formato: 555-123-4567 o +52 555-123-4567</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dirección completa de entrega *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Calle Principal #123, Colonia Centro, Ciudad, Estado, C.P. 12345"
                    rows={3}
                    maxLength="200"
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.address.length}/200 caracteres - Incluye calle, número, colonia, ciudad y código postal
                  </p>
                </div>
              </div>

              {/* Método de pago */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Método de pago</h3>

                <div className="flex flex-wrap gap-4 mb-4">
                  <label
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      formData.paymentMethod === "cash"
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      Efectivo al entregar
                    </span>
                  </label>

                  <label
                    className={`flex items-center p-3 border rounded-md cursor-not-allowed opacity-50 ${
                      formData.paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleChange}
                      className="sr-only"
                      disabled
                    />
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <div>
                        <div>Tarjeta de crédito/débito</div>
                        <div className="text-xs text-red-500">No disponible por el momento</div>
                      </div>
                    </span>
                  </label>
                </div>

                {/* Mensaje informativo para tarjetas */}
                {formData.paymentMethod === "card" && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Pagos con tarjeta no disponibles
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                          Por el momento solo aceptamos pagos en efectivo al momento de la entrega. Estamos trabajando
                          para habilitar los pagos con tarjeta pronto.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCompletarPedido}
                disabled={isSubmitting || formData.paymentMethod === "card"}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
                  isSubmitting || formData.paymentMethod === "card"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                    Procesando pedido...
                  </span>
                ) : formData.paymentMethod === "card" ? (
                  "Método de pago no disponible"
                ) : (
                  "Completar Pedido"
                )}
              </button>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Resumen del pedido</h2>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item, index) => (
                  <div key={index} className="py-3 flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tamaño: {item.selectedSize.Nombre}</p>
                      )}
                      <div className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.selectedSize
                          ? formatPrice(item.selectedSize.Precio * item.quantity)
                          : formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-gray-800 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(totalWithTax)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  * Pago en efectivo al momento de la entrega
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Usar el layout de cliente para mantener la sesión y la navegación consistente
  return <ClientLayout>{checkoutContent}</ClientLayout>
}

export default CheckoutPage
