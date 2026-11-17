import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './components/CartContext.jsx'
import CarritoCompras from './pages/CarritoCompras.jsx'
import CatalogoCompleto from './pages/CatalogoCompleto.jsx'
import HistorialCompras from './pages/HistorialCompras.jsx'
import Login from './pages/Login.jsx'
import PaginaPrincipal from './pages/PaginaPrincipal.jsx'
import PanelAdmin from './pages/PanelAdmin.jsx'
import RegistroUsuarios from './pages/RegistroUsuarios.jsx'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PaginaPrincipal />} path="/" />
          <Route element={<CatalogoCompleto />} path="/catalogo" />
          <Route element={<Login />} path="/login" />
          <Route element={<RegistroUsuarios />} path="/registro" />
          <Route element={<CarritoCompras />} path="/carrito" />
          <Route element={<HistorialCompras />} path="/historial" />
          <Route element={<PanelAdmin />} path="/admin" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
