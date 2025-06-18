import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import PackageCatalog from './components/catalog/PackageCatalog';
import ShoppingCart from './components/cart/ShoppingCart';
import ClientDashboard from './components/dashboard/ClientDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('catalog');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterForm onNavigate={setCurrentPage} />;
      case 'catalog':
        return <PackageCatalog onNavigate={setCurrentPage} />;
      case 'cart':
        return <ShoppingCart onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <ClientDashboard onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'offers':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Ofertas Especiales</h1>
              <p className="text-gray-600">¡Próximamente ofertas increíbles!</p>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Sobre Nosotros</h1>
              <p className="text-gray-600 mb-6">
                Travel Portal es tu agencia de viajes de confianza, especializada en crear experiencias 
                únicas e inolvidables. Con más de 10 años de experiencia en el sector turístico, 
                ofrecemos los mejores destinos nacionales e internacionales.
              </p>
              <p className="text-gray-600">
                Nuestro equipo de expertos trabaja día a día para brindarte el mejor servicio 
                y hacer realidad el viaje de tus sueños.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Contacto</h1>
              <div className="space-y-4 text-gray-600">
                <p><strong>Teléfono:</strong> +54 11 4567-8900</p>
                <p><strong>Email:</strong> info@travelportal.com</p>
                <p><strong>Dirección:</strong> Av. Corrientes 1234, CABA</p>
                <p><strong>Horarios:</strong> Lunes a Viernes 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        );
      default:
        return <PackageCatalog onNavigate={setCurrentPage} />;
    }
  };

  const showHeaderFooter = !['login', 'register'].includes(currentPage);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          {showHeaderFooter && (
            <Header onNavigate={setCurrentPage} currentPage={currentPage} />
          )}
          
          <main>
            {renderPage()}
          </main>
          
          {showHeaderFooter && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;