import {BrowserRouter,Router,Routes,Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/registerPage'
import Home from './pages/Home'
import AuthModal from './pages/AuthModal'
import { AuthProvider } from './contex/AuthContext'
import ClientPage from './pages/ClientPage'

function App() {
  return(
   <AuthProvider>
     <BrowserRouter>
    <Routes>
    <Route path='/' element= {<Home/>} />
    <Route path='/login' element= {<LoginPage/>} />
    <Route path='/registrar' element= {<RegisterPage/>} />
    <Route path='/paginaCliente' element= {<ClientPage/>} />
    <Route path='/authModal' element= {<AuthModal/>} />
    <Route path='/politicas' element= {<h1>politicas</h1>} />
    <Route path='/add-politicas' element= {<h1>Nueva politica</h1>} />
    <Route path='/politicas/:id' element= {<h1>Modificar politica</h1>} />
    <Route path='/profile' element= {<h1>Profile</h1>} />
    </Routes>
    </BrowserRouter>
   </AuthProvider>
    
  );
}

export default App
