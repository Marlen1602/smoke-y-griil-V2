import { createContext, useState, useContext, useEffect } from "react"
import { registerRequest, loginRequest, verifyAuthRequest, logoutRequest } from "../api/auth"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const AuthContext = createContext()
const API = "http://localhost:3000/api"

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [isAuthenticated, setIsAuthenticated] = useState(!!user)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const handleRequestError = (error) => {
    console.error("Error en la solicitud:", error)

    // Redirige a error 500 si el servidor no responde o no hay conexión a Internet
    if (!error.response) {
      navigate("/error-500")
      return
    }

    setErrors([error.response?.data?.message || "Error inesperado"])
  }

  // verificar si inicio sesion
  const checkAuth = async () => {
    console.log("🔍 Ejecutando checkAuth()...");
    try {
      const res = await verifyAuthRequest();
      

      if (res && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(res.data));
      } else {
        console.warn("No hay datos de usuario en la respuesta.");
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData)
      setUser(res.data)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(res.data))
      setErrors([])
      navigate("/verificar-codigo")
    } catch (error) {
      setErrors([error.response?.data || "Error en el registro"])
    }
  }

  // Función para migrar el carrito de invitado al carrito del usuario
  const migrateGuestCartToUserCart = (userData) => {
    try {
      // Obtener el carrito de invitado
      const guestCart = localStorage.getItem("guest_cart")

      if (guestCart) {
        console.log("Migrando carrito de invitado al usuario:", userData.id || userData.email)

        // Obtener el ID o email del usuario para la clave del carrito
        const userId = userData.id || userData.email
        const userCartKey = `cart_${userId}`

        // Verificar si el usuario ya tiene un carrito
        const existingUserCart = localStorage.getItem(userCartKey)

        if (!existingUserCart) {
          // Si el usuario no tiene carrito, usar el carrito de invitado
          localStorage.setItem(userCartKey, guestCart)
          console.log(`Carrito de invitado migrado al usuario: ${userId}`)
        } else {
          // Si el usuario ya tiene carrito, fusionar los carritos
          try {
            const guestCartItems = JSON.parse(guestCart)
            const userCartItems = JSON.parse(existingUserCart)

            // Fusionar los items, sumando cantidades para productos idénticos
            guestCartItems.forEach((guestItem) => {
              const existingItemIndex = userCartItems.findIndex(
                (userItem) =>
                  userItem.id === guestItem.id &&
                  JSON.stringify(userItem.selectedSize) === JSON.stringify(guestItem.selectedSize) &&
                  JSON.stringify(userItem.selectedComplements) === JSON.stringify(guestItem.selectedComplements),
              )

              if (existingItemIndex !== -1) {
                // Si el producto ya existe en el carrito del usuario, sumar cantidades
                userCartItems[existingItemIndex].quantity =
                  (Number.parseInt(userCartItems[existingItemIndex].quantity) || 0) +
                  (Number.parseInt(guestItem.quantity) || 0)
              } else {
                // Si es un producto nuevo, añadirlo al carrito del usuario
                userCartItems.push(guestItem)
              }
            })

            // Guardar el carrito fusionado
            localStorage.setItem(userCartKey, JSON.stringify(userCartItems))
            console.log(`Carritos fusionados para el usuario: ${userId}`)
          } catch (error) {
            console.error("Error al fusionar carritos:", error)
            // En caso de error, mantener el carrito existente del usuario
          }
        }

        // Eliminar el carrito de invitado después de la migración
        localStorage.removeItem("guest_cart")
      }
    } catch (error) {
      console.error("Error al migrar el carrito de invitado:", error)
    }
  }

  const login = async (userData) => {
    try {
      const res = await loginRequest(userData)

      // Guardar el usuario en el estado y localStorage
      setUser(res.data)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(res.data))
      setErrors([])

      // Migrar carrito de invitado al carrito del usuario
      migrateGuestCartToUserCart(res.data)

      // Redireccionar según el tipo de usuario
      if (res.data.tipoUsuarioId === 1) {
        navigate("/paginaAdministrador")
      } else if (res.data.tipoUsuarioId === 2) {
        navigate("/paginaCliente")
      } else {
        navigate("/paginaCliente")
      }
    } catch (error) {
      handleRequestError(error)
    }
  }

  // Función para preservar el carrito del usuario antes de cerrar sesión
  const preserveUserCart = (user) => {
    if (!user) return

    try {
      const userId = user.id || user.email
      if (!userId) return

      const userCartKey = `cart_${userId}`
      const userCart = localStorage.getItem(userCartKey)

      if (userCart) {
        // Guardar el carrito del usuario en una clave especial para restaurarlo después
        localStorage.setItem(`preserved_cart_${userId}`, userCart)
        console.log(`Carrito preservado para el usuario: ${userId}`)
      }
    } catch (error) {
      console.error("Error al preservar el carrito del usuario:", error)
    }
  }

  const logout = async () => {
    try {
      // Preservar el carrito del usuario antes de cerrar sesión
      preserveUserCart(user)

      await logoutRequest()

      setUser(null)
      setIsAuthenticated(false)
      setErrors([])
      localStorage.removeItem("user")
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  // Función de verificación de código
  const verifyCode = async (formData) => {
    try {
      console.log("📤 Enviando código de verificación:", formData)

      const res = await axios.post(`${API}/verify-code-email`, formData, { withCredentials: true })

      console.log("✅ Respuesta del backend:", res.data)
      setErrors([])
      return res.data
    } catch (error) {
      console.error("❌ Error en verifyCode:", error.response?.data || error.message)
      setErrors([error.response?.data?.message || "Error inesperado"])
    }
  }

  const updatePassword = async (formData) => {
    try {
      const res = await axios.put(`${API}/update-password`, formData)
      setErrors([])
      return res.data
    } catch (error) {
      console.log(error.response?.data?.message)
      setErrors([error.response?.data?.message] || ["Error inesperado"])
    }
  }

  const verifyCodeForPassword = async (formData) => {
    const email = localStorage.getItem("email")
    try {
      const res = await axios.post(`${API}/verify-code-password`, {
        email: email,
        code: formData.code,
      })
      setErrors([])
      return res.data
    } catch (error) {
      console.log(error.response?.data?.message)
      setErrors([error.response?.data?.message] || ["Error inesperado"])
    }
  }

  const sendEmailResetPassword = async (formData) => {
    try {
      const res = await axios.post(`${API}/send-code-for-reset`, {
        email: formData,
      })
      setErrors([])
      localStorage.setItem("email", formData)
      return res.data
    } catch (error) {
      console.log(error.response?.data?.message)
      setErrors([error.response?.data?.message] || ["Error inesperado"])
    }
  }

  const verifyEmail = async (formData) => {
    try {
      const res = await axios.post(`${API}/verify-email`, {
        email: formData,
      })
      setErrors([])
      return res.data
    } catch (error) {
      console.log(error.response?.data?.message)
      setErrors([error.response?.data?.message] || ["Error inesperado"])
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        user,
        isAuthenticated,
        verifyCode,
        errors,
        setErrors,
        checkAuth,
        verifyEmail,
        sendEmailResetPassword,
        verifyCodeForPassword,
        updatePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

