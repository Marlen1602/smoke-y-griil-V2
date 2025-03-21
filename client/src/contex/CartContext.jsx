import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { AuthContext } from "./AuthContext"

// Crear el contexto
export const CartContext = createContext()

// Función auxiliar para obtener la clave del carrito
const getCartKey = (user) => {
  if (user && (user.id || user.email)) {
    return `cart_${user.id || user.email}`
  }
  return "guest_cart"
}

// Función auxiliar para obtener la clave del carrito preservado
const getPreservedCartKey = (user) => {
  if (user && (user.id || user.email)) {
    return `preserved_cart_${user.id || user.email}`
  }
  return null
}

// Función auxiliar para cargar el carrito desde localStorage
const loadCartFromStorage = (key) => {
  try {
    const storedCart = localStorage.getItem(key)
    if (storedCart) {
      console.log(`Carrito cargado con clave: ${key}`, JSON.parse(storedCart))
      return JSON.parse(storedCart)
    }
  } catch (error) {
    console.error(`Error al cargar carrito con clave ${key}:`, error)
    localStorage.removeItem(key)
  }
  return []
}

// Función auxiliar para guardar el carrito en localStorage
const saveCartToStorage = (key, cart) => {
  try {
    if (cart && cart.length > 0) {
      localStorage.setItem(key, JSON.stringify(cart))
      console.log(`Carrito guardado con clave: ${key}`, cart)
    } else {
      localStorage.removeItem(key)
      console.log(`Carrito vacío, clave eliminada: ${key}`)
    }
  } catch (error) {
    console.error(`Error al guardar carrito con clave ${key}:`, error)
  }
}

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Función para calcular el total y el conteo
  const calculateCartMetrics = useCallback((items) => {
    const count = items.reduce((total, item) => total + (Number.parseInt(item.quantity) || 0), 0)

    const total = items.reduce((sum, item) => {
      let itemPrice = 0

      if (item.selectedSize && item.selectedSize.Precio) {
        itemPrice = Math.abs(Number(item.selectedSize.Precio)) * (Number.parseInt(item.quantity) || 1)
      } else {
        itemPrice = Math.abs(Number(item.price || 0)) * (Number.parseInt(item.quantity) || 1)
      }

      if (item.selectedComplements && item.selectedComplements.length > 0) {
        const complementsTotal = item.selectedComplements.reduce(
          (total, comp) => total + Math.abs(Number(comp.Precio || 0)),
          0,
        )
        itemPrice += complementsTotal * (Number.parseInt(item.quantity) || 1)
      }

      return sum + itemPrice
    }, 0)

    return { count, total }
  }, [])

  // Cargar carrito al iniciar o cuando cambia el usuario
  useEffect(() => {
    const cartKey = getCartKey(user)
    console.log(
      `Inicializando carrito para ${isAuthenticated ? "usuario autenticado" : "invitado"} con clave: ${cartKey}`,
    )

    let loadedCart = []

    // Si el usuario está autenticado, intentar cargar el carrito preservado primero
    if (isAuthenticated && user) {
      const preservedCartKey = getPreservedCartKey(user)
      const preservedCart = loadCartFromStorage(preservedCartKey)

      if (preservedCart && preservedCart.length > 0) {
        console.log(`Restaurando carrito preservado para el usuario: ${user.id || user.email}`)
        loadedCart = preservedCart

        // Guardar el carrito preservado en la clave normal del carrito
        saveCartToStorage(cartKey, preservedCart)

        // Eliminar el carrito preservado después de restaurarlo
        localStorage.removeItem(preservedCartKey)
      } else {
        // Si no hay carrito preservado, cargar el carrito normal
        loadedCart = loadCartFromStorage(cartKey)
      }
    } else {
      // Si no está autenticado, cargar el carrito de invitado
      loadedCart = loadCartFromStorage(cartKey)
    }

    setCartItems(loadedCart)

    const { count, total } = calculateCartMetrics(loadedCart)
    setCartCount(count)
    setCartTotal(total)

    setIsInitialized(true)

    // Función para manejar cambios en localStorage de otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === cartKey) {
        console.log(`Detectado cambio en localStorage para clave: ${cartKey}`)
        const updatedCart = e.newValue ? JSON.parse(e.newValue) : []
        setCartItems(updatedCart)

        const { count, total } = calculateCartMetrics(updatedCart)
        setCartCount(count)
        setCartTotal(total)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [user, isAuthenticated, calculateCartMetrics])

  // Función para añadir al carrito
  const addToCart = useCallback(
    (product) => {
      if (!product || !product.id) {
        console.error("Intento de añadir producto inválido al carrito:", product)
        return
      }

      console.log("Añadiendo producto al carrito:", product)

      // Normalizar el producto
      const productToAdd = {
        id: product.id,
        name: product.name || product.nombre || "Producto sin nombre",
        price: Number(product.price || product.precio || 0),
        image: product.image || product.imagen,
        quantity: Number.parseInt(product.quantity || 1),
        selectedSize: product.selectedSize || product.tamano,
        selectedComplements: product.selectedComplements || product.complementos || [],
        category: product.category || "Sin categoría",
      }

      setCartItems((prevItems) => {
        // Buscar si el producto ya existe en el carrito
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.id === productToAdd.id &&
            JSON.stringify(item.selectedSize) === JSON.stringify(productToAdd.selectedSize) &&
            JSON.stringify(item.selectedComplements) === JSON.stringify(productToAdd.selectedComplements),
        )

        let updatedItems
        if (existingItemIndex !== -1) {
          // Actualizar cantidad si ya existe
          updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity =
            (Number.parseInt(updatedItems[existingItemIndex].quantity) || 0) + Number.parseInt(productToAdd.quantity)
        } else {
          // Añadir nuevo producto
          updatedItems = [...prevItems, productToAdd]
        }

        // Guardar en localStorage
        const cartKey = getCartKey(user)
        saveCartToStorage(cartKey, updatedItems)

        // Actualizar métricas
        const { count, total } = calculateCartMetrics(updatedItems)
        setCartCount(count)
        setCartTotal(total)

        return updatedItems
      })
    },
    [user, calculateCartMetrics],
  )

  // Función para eliminar del carrito
  const removeFromCart = useCallback(
    (index) => {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((_, i) => i !== index)

        // Guardar en localStorage
        const cartKey = getCartKey(user)
        saveCartToStorage(cartKey, updatedItems)

        // Actualizar métricas
        const { count, total } = calculateCartMetrics(updatedItems)
        setCartCount(count)
        setCartTotal(total)

        return updatedItems
      })
    },
    [user, calculateCartMetrics],
  )

  // Función para actualizar cantidad
  const updateQuantity = useCallback(
    (index, quantity) => {
      const parsedQuantity = Number.parseInt(quantity)
      if (parsedQuantity <= 0) {
        removeFromCart(index)
        return
      }

      setCartItems((prevItems) => {
        const updatedItems = [...prevItems]
        updatedItems[index].quantity = parsedQuantity

        // Guardar en localStorage
        const cartKey = getCartKey(user)
        saveCartToStorage(cartKey, updatedItems)

        // Actualizar métricas
        const { count, total } = calculateCartMetrics(updatedItems)
        setCartCount(count)
        setCartTotal(total)

        return updatedItems
      })
    },
    [user, removeFromCart, calculateCartMetrics],
  )

  // Función para limpiar carrito
  const clearCart = useCallback(() => {
    setCartItems([])
    setCartCount(0)
    setCartTotal(0)

    // Limpiar localStorage
    const cartKey = getCartKey(user)
    localStorage.removeItem(cartKey)
    console.log(`Carrito limpiado con clave: ${cartKey}`)
  }, [user])

  // Valor del contexto
  const contextValue = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInitialized,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider")
  }
  return context
}

