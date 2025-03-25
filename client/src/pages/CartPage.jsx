import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contex/CartContext"
import { AuthContext } from "../contex/AuthContext"
import ClientLayout from "../layouts/ClientLayaut"
import { Check } from "lucide-react"

const CarritoDetalle = () => {
  const { cartItems, cartTotal, updateQuantity, clearCart, isInitialized } = useCart()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Estado para controlar la carga
  const [isLoading, setIsLoading] = useState(true)

  // Esperar a que el carrito se inicialice
  useEffect(() => {
    if (isInitialized) {
      // Dar un pequeño tiempo para asegurar que todo esté cargado
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isInitialized])

  // Calcular subtotal (sin impuestos)
  const subtotal = cartTotal

  // Función para formatear precio
  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`
  }

  // Función para incrementar cantidad con notificación
  const incrementQuantity = (index, currentQuantity) => {
    updateQuantity(index, Number.parseInt(currentQuantity) + 1)
    showQuantityNotification("Cantidad actualizada")
  }

  // Función para decrementar cantidad con notificación
  const decrementQuantity = (index, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(index, Number.parseInt(currentQuantity) - 1)
      showQuantityNotification("Cantidad actualizada")
    }
  }

  // Función para mostrar notificación de cantidad actualizada
  const showQuantityNotification = (message) => {
    // Crear notificación simple
    const notification = document.createElement("div")
    notification.className =
      "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
      <span>${message}</span>
    `
    document.body.appendChild(notification)

    // Eliminar la notificación después de 1.5 segundos
    setTimeout(() => {
      notification.classList.add("opacity-0", "transition-opacity", "duration-300")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 1500)
  }

  // Función para eliminar un producto con confirmación
  const removeFromCart = (index) => {
    // Obtener el nombre del producto para la notificación
    const productName = cartItems[index].name

    // Eliminar el producto
    updateQuantity(index, 0)

    // Mostrar notificación de producto eliminado
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-red text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      <span>${productName} eliminado del carrito</span>
    `
    document.body.appendChild(notification)

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.add("opacity-0", "transition-opacity", "duration-500")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 3000)
  }

  // Función para continuar comprando
  const handleContinueShopping = () => {
    navigate("/menuPrincipal")
  }

  const handleEmptyCart = () => {
    // Crear un modal de confirmación personalizado con Tailwind
    const confirmModal = document.createElement("div")
    confirmModal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    confirmModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-auto shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">¿Vaciar carrito?</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">¿Estás seguro de que deseas eliminar todos los productos del carrito?</p>
        <div class="flex justify-end gap-3">
          <button id="cancel-empty-cart" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Cancelar
          </button>
          <button id="confirm-empty-cart" class="px-4 py-2 bg-red text-white rounded-md hover:bg-red transition-colors">
            Vaciar carrito
          </button>
        </div>
      </div>
    `
    document.body.appendChild(confirmModal)

    // Manejar la cancelación
    document.getElementById("cancel-empty-cart").addEventListener("click", () => {
      document.body.removeChild(confirmModal)
    })

    // Manejar la confirmación
    document.getElementById("confirm-empty-cart").addEventListener("click", () => {
      clearCart()
      document.body.removeChild(confirmModal)

      // Mostrar notificación de carrito vaciado
      const notification = document.createElement("div")
      notification.className =
        "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
      notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>El carrito ha sido vaciado</span>
      `
      document.body.appendChild(notification)

      // Eliminar la notificación después de 3 segundos
      setTimeout(() => {
        notification.classList.add("opacity-0", "transition-opacity", "duration-500")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 500)
      }, 3000)
    })
  }

  // Función para proceder al pago
  const handleCheckout = () => {
    navigate("/checkout")
  }

  // Mostrar indicador de carga mientras se inicializa el carrito
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Tu Carrito</h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando carrito...</span>
          </div>
        </div>
      </ClientLayout>
    )
  }

  // Mostrar mensaje si el carrito está vacío
  if (!isLoading && (!cartItems || cartItems.length === 0)) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Tu Carrito</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Parece que aún no has agregado productos a tu carrito.
            </p>
            <button
              onClick={() => navigate("/menuPrincipal")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Explorar Menú
            </button>
          </div>
        </div>
      </ClientLayout>
    )
  }

  // Renderizar el carrito con productos
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Tu Carrito</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Productos ({cartItems.length})</h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Imagen del producto */}
                      <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg?height=80&width=80"
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span>Sin imagen</span>
                          </div>
                        )}
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{item.category || "Producto"}</p>
                        {item.selectedSize && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                            {item.selectedSize.tamaño ||
                              item.selectedSize.Tamaño ||
                              item.selectedSize.nombre ||
                              item.selectedSize.Nombre ||
                              "Tamaño seleccionado"}
                          </p>
                        )}
                      </div>

                      {/* Precio unitario */}
                      <div className="text-gray-600 dark:text-gray-300 font-medium">
                        ${(item.selectedSize ? Number(item.selectedSize.Precio) : Number(item.price)).toFixed(2)} c/u
                      </div>

                      {/* Controles de cantidad mejorados */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                        <button
                          onClick={() => decrementQuantity(index, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-l border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(index, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Precio total */}
                      <div className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                        $
                        {(item.selectedSize
                          ? Number(item.selectedSize.Precio) * Number(item.quantity)
                          : Number(item.price) * Number(item.quantity)
                        ).toFixed(2)}
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red hover:text-red transition-colors flex items-center gap-1"
                        aria-label="Eliminar producto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
                <button
                  onClick={handleContinueShopping}
                  className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Seguir comprando
                </button>
                <button
                  onClick={handleEmptyCart}
                  className="flex items-center text-red hover:text-red transition-colors mt-2 sm:mt-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>

              {/* Mensaje de envío gratis */}
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <div className="flex items-center text-green-700 dark:text-green-400">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>¡Envío gratis en todos los pedidos!</span>
                </div>
              </div>

              {/* Botón de pago */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md mt-6 transition-colors"
              >
                Proceder al pago
              </button>

              {/* Términos y condiciones */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Al proceder con el pago, aceptas nuestros{" "}
                <button
                  onClick={() => navigate("/terminos")}
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Términos y Condiciones
                </button>{" "}
                y{" "}
                <button
                  onClick={() => navigate("/privacidad")}
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Política de Privacidad
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default CarritoDetalle

