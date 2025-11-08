import { useState, useEffect } from "react"
import { Phone, MessageCircle, Users, Calendar, Star, Sparkles, Clock } from "lucide-react"
import { getEmpresaProfile } from "../api/auth"
import Header from "./PrincipalNavBar"
import Breadcrumbs from "../pages/Breadcrumbs.jsx"
import Footer from "../pages/footer"

// Componente Button personalizado mejorado
const Button = ({ children, onClick, className = "", variant = "primary", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    whatsapp:
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary:
      "bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950",
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Componente Card mejorado
const Card = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm ${hover ? "hover:shadow-2xl hover:scale-105 transition-all duration-300" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
}

const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-2xl font-bold leading-none tracking-tight ${className}`}>{children}</h3>
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

// Componente de evento individual
const EventCard = ({ icon, title, description, gradient }) => (
  <Card
    hover
    className={`border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 overflow-hidden group`}
  >
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-black dark:text-white text-base sm:text-lg mb-1">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function EventReservationsSection() {
  const [empresa, setEmpresa] = useState(null)
  const phoneNumber = "5217715685117"
  const whatsappLink = "https://wa.me/5217715685117"

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile()
        setEmpresa(response.data)
      } catch (error) {
        console.error("Error al obtener los datos de la empresa:", error)
      }
    }
    fetchEmpresaData()
  }, [])

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, "_blank")
  }

  const eventos = [
    { icon: "🎂", title: "Cumpleaños", description: "Celebra tu día especial", gradient: "from-pink-400 to-pink-600" },
    { icon: "💕", title: "Aniversarios", description: "Momentos románticos", gradient: "from-red-400 to-red-600" },
    { icon: "🎓", title: "Graduaciones", description: "Celebra tus logros", gradient: "from-blue-400 to-blue-600" },
    {
      icon: "🎉",
      title: "Eventos Corporativos",
      description: "Reuniones de trabajo",
      gradient: "from-purple-400 to-purple-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <Header />
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-black dark:to-gray-900"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200 dark:bg-orange-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-300 dark:bg-orange-800 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header principal */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-3 bg-orange-100 dark:bg-orange-900 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-800 dark:text-orange-200 font-semibold text-sm">Eventos Exclusivos</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 mb-6 leading-tight">
              Reserva para tu Evento Especial
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Haz de tu celebración un momento inolvidable. Reservamos nuestro restaurante
              <span className="font-bold text-orange-600 dark:text-orange-400"> exclusivamente para ti</span> y tus
              invitados.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              <Star className="w-5 h-5" />
              ¡Atención personalizada solo para tu grupo!
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            {/* Tipos de eventos */}
            <div className="xl:col-span-1 order-2 xl:order-1">
              <div className="sticky top-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6 text-center xl:text-left">
                  Eventos que Celebramos
                </h2>

                <div className="space-y-4">
                  {eventos.map((evento, index) => (
                    <EventCard key={index} {...evento} />
                  ))}
                </div>
              </div>
            </div>

            {/* Reservación principal */}
            <div className="xl:col-span-2 order-1 xl:order-2">
              <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-2xl overflow-hidden">
                {/* Header con gradiente */}
                <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white p-8 sm:p-10">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative text-center">
                    <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 drop-shadow-lg" />
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2">Reserva por WhatsApp</h2>
                    <p className="text-orange-100 text-lg">Respuesta inmediata garantizada</p>
                  </div>
                </div>

                <CardContent className="p-6 sm:p-8 lg:p-10 space-y-8">
                  {/* Información de contacto */}
                  <div className="text-center bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      <span className="text-lg font-bold text-black dark:text-white">Contacto Directo</span>
                    </div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600 dark:text-orange-400 mb-6 tracking-wide">
                      +52 1 771 568 5117
                    </p>

                    <Button
                      onClick={handleWhatsAppClick}
                      variant="whatsapp"
                      className="w-full py-6 text-lg sm:text-xl font-bold"
                    >
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Reservar mi Evento Ahora
                    </Button>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                      <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                      <h4 className="font-bold text-black dark:text-white text-lg">Hasta 50</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Personas</p>
                    </Card>

                    <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                      <Star className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                      <h4 className="font-bold text-black dark:text-white text-lg">100%</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Exclusivo</p>
                    </Card>

                    <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                      <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                      <h4 className="font-bold text-black dark:text-white text-lg">24/7</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Atención</p>
                    </Card>
                  </div>

                  {/* Información para reservación */}
                  <Card className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 dark:from-orange-950 dark:via-orange-900 dark:to-orange-950 border-l-4 border-orange-500 p-6 sm:p-8">
                    <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-6 flex items-center gap-3 text-lg sm:text-xl">
                      <Calendar className="w-6 h-6" />
                      Información para tu reservación
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-orange-700 dark:text-orange-300">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Tipo de evento:</strong>
                          <br />
                          <span className="text-sm">Cumpleaños, aniversario, etc.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Fecha y hora:</strong>
                          <br />
                          <span className="text-sm">Cuándo quieres celebrar</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Número de invitados:</strong>
                          <br />
                          <span className="text-sm">¿Cuántas personas asistirán?</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Servicios especiales:</strong>
                          <br />
                          <span className="text-sm">Decoración, música, pastel</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Nota final */}
                  <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      <strong className="text-orange-600 dark:text-orange-400">Nota:</strong> Te contactaremos
                      inmediatamente para confirmar disponibilidad y coordinar todos los detalles de tu evento especial.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Beneficios adicionales */}
          <div className="mt-16 sm:mt-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-black dark:text-white mb-12">
              ¿Por qué elegirnos?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card
                hover
                className="text-center p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-2 border-orange-200 dark:border-orange-800"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl">
                  🍽️
                </div>
                <h3 className="font-bold text-black dark:text-white mb-4 text-xl">Menú Personalizado</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Adaptamos nuestro menú a tus gustos y preferencias especiales para hacer tu evento único
                </p>
              </Card>

              <Card
                hover
                className="text-center p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-2 border-orange-200 dark:border-orange-800"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl">
                  🎵
                </div>
                <h3 className="font-bold text-black dark:text-white mb-4 text-xl">Ambiente Especial</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Música, decoración y ambiente perfecto para tu celebración, todo personalizado
                </p>
              </Card>

              <Card
                hover
                className="text-center p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-2 border-orange-200 dark:border-orange-800"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl">
                  👨‍🍳
                </div>
                <h3 className="font-bold text-black dark:text-white mb-4 text-xl">Atención Exclusiva</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Nuestro equipo se dedicará completamente a tu evento para una experiencia inolvidable
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
