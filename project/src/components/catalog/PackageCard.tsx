import React from 'react';
import { MapPin, Clock, Star, ShoppingCart } from 'lucide-react';
import { TravelPackage } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface PackageCardProps {
  package: TravelPackage;
  onNavigate: (page: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onNavigate }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    addToCart(pkg);
  };

  const getTypeColor = (type: string) => {
    return type === 'international' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-green-100 text-green-800';
  };

  const getTypeLabel = (type: string) => {
    return type === 'international' ? 'Internacional' : 'Nacional';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={pkg.imageUrl}
          alt={pkg.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(pkg.type)}`}>
            {getTypeLabel(pkg.type)}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">4.8</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 font-medium">{pkg.code}</span>
          <span className="text-2xl font-bold text-blue-600">${pkg.price.toLocaleString()}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{pkg.location}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{pkg.duration}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Destacados:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {pkg.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default PackageCard;