import AdminNavBar from "../pages/AdminNavBar.jsx";
import Footer from '../pages/Footer';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default AdminLayout

