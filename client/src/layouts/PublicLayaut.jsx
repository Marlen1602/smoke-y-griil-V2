import PublicNavBar from "../pages/PrincipalNavBar"
import Footer from '../pages/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default PublicLayout
