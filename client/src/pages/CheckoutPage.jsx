import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contex/CartContext"
import { AuthContext } from "../contex/AuthContext"
import ClientLayout from "../layouts/ClientLayaut" // Importamos el layout de cliente

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: user?.nombre || "",
    email: user?.email || "",
    phone: user?.telefono || "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Calcular impuestos y total
    const subtotal = cartTotal
  const totalWithTax = subtotal

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

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Validaciones básicas
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida"
    if (!formData.city.trim()) newErrors.city = "La ciudad es requerida"
    if (!formData.zipCode.trim()) newErrors.zipCode = "El código postal es requerido"

    // Validaciones para tarjeta si el método de pago es tarjeta
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "El número de tarjeta es requerido"
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Número de tarjeta inválido"
      }
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "La fecha de expiración es requerida"
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "Formato inválido (MM/YY)"
      }
      if (!formData.cardCVC.trim()) newErrors.cardCVC = "El CVC es requerido"
      if (!/^\d{3,4}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = "CVC inválido"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulación de procesamiento de pago y creación de orden
    setTimeout(() => {
      // Generar número de orden aleatorio
      const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString()
      setOrderNumber(randomOrderNumber)
      setOrderComplete(true)
      clearCart() // Limpiar carrito después de completar la orden
      setIsSubmitting(false)
    }, 2000)
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
            Tu pedido ha sido procesado correctamente. Hemos enviado un correo electrónico con los detalles de tu
            compra.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              Número de Orden: <span className="font-bold">{orderNumber}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Total: <span className="font-bold">{formatPrice(totalWithTax)}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate("/menu")}
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Información de Pago</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Información personal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.name ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.name && <p className="text-red text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.email ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.email && <p className="text-red text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.phone ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.phone && <p className="text-red text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dirección de entrega
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.address ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.address && <p className="text-red text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.city ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.city && <p className="text-red text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.zipCode ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.zipCode && <p className="text-red text-xs mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                {/* Método de pago */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Método de pago</h3>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <label
                      className={`flex items-center p-3 border rounded-md cursor-pointer ${formData.paymentMethod === "card" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-gray-300 dark:border-gray-600"}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Tarjeta de crédito/débito
                      </span>
                    </label>

                    <label
                      className={`flex items-center p-3 border rounded-md cursor-pointer ${formData.paymentMethod === "cash" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-gray-300 dark:border-gray-600"}`}
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
                  </div>

                  {/* Detalles de tarjeta */}
                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número de tarjeta
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-3 py-2 border ${errors.cardNumber ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.cardNumber && <p className="text-red text-xs mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha de expiración
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-3 py-2 border ${errors.cardExpiry ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                          />
                          {errors.cardExpiry && <p className="text-red text-xs mt-1">{errors.cardExpiry}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                          <input
                            type="text"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleChange}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-3 py-2 border ${errors.cardCVC ? "border-red" : "border-gray-300 dark:border-gray-600"} rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-700 dark:text-white`}
                          />
                          {errors.cardCVC && <p className="text-red text-xs mt-1">{errors.cardCVC}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
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
                      Procesando...
                    </span>
                  ) : (
                    "Completar Pedido"
                  )}
                </button>
              </form>
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

