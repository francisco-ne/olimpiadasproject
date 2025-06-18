import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderOperations } from '../../utils/supabaseOperations';
import { emailService } from '../../utils/emailService';

interface ShoppingCartProps {
  onNavigate: (page: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateQuantity = (packageId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(packageId);
    } else {
      updateQuantity(packageId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setShowCheckout(true);
  };

  const handleCompletePurchase = async () => {
    if (!user || cart.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create order
      const order = await orderOperations.create({
        clientId: user.id,
        items: cart.map(item => ({
          packageId: item.package.id,
          title: item.package.title,
          quantity: item.quantity,
          priceAtPurchase: item.package.price
        })),
        total: getTotalPrice(),
        status: 'pending'
      });

      // Send confirmation email
      await emailService.sendPurchaseConfirmation(user, order);

      // Clear cart
      clearCart();

      // Navigate to dashboard
      onNavigate('dashboard');
    } catch (err) {
      console.error('Error processing purchase:', err);
      setError('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Descubre nuestros increíbles paquetes turísticos</p>
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {/* Order Summary */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
              {cart.map((item) => (
                <div key={item.package.id} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">{item.package.title}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">${(item.package.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Form (Simulated) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Modo Demo:</strong> Esta es una simulación de pago. No se procesará ningún cargo real.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Expiración</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                disabled={isProcessing}
              >
                Volver al Carrito
              </button>
              <button
                onClick={handleCompletePurchase}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? (
                  'Procesando...'
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Confirmar Compra
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.package.id} className="p-6 flex items-center space-x-4">
                <img
                  src={item.package.imageUrl}
                  alt={item.package.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.package.title}</h3>
                  <p className="text-sm text-gray-600">{item.package.location}</p>
                  <p className="text-sm text-gray-600">{item.package.duration}</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    ${item.package.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.package.id, item.quantity - 1)}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  
                  <button
                    onClick={() => handleUpdateQuantity(item.package.id, item.quantity + 1)}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.package.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.package.id)}
                    className="text-red-600 hover:text-red-800 mt-2 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${getTotalPrice().toLocaleString()}
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Seguir Comprando
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;