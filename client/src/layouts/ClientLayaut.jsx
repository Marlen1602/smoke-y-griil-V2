import UserNavBar from "../pages/"
import Footer from "../components/Footer"

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default UserLayout