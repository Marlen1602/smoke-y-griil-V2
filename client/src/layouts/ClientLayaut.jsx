import { useContext } from "react"
import { AuthContext } from "../contex/AuthContext"
import ClientNavBar from "../pages/ClientBar"
import Footer from "../pages/Footer.jsx"
import Breadcrumbs from "../pages/Breadcrumbs.jsx"

const ClientLayout = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext)

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen flex flex-col">
      <ClientNavBar />

          {/* Contenido principal */}
      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  )
}

export default ClientLayout

