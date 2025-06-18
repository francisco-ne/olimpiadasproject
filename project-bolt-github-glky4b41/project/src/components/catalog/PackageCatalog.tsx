import React, { useState, useEffect } from 'react';
import { Search, Filter, Globe, MapPin } from 'lucide-react';
import { TravelPackage } from '../../types';
import { packageOperations } from '../../utils/supabaseOperations';
import PackageCard from './PackageCard';

interface PackageCatalogProps {
  onNavigate: (page: string) => void;
}

const PackageCatalog: React.FC<PackageCatalogProps> = ({ onNavigate }) => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'national' | 'international'>('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'none'>('none');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const allPackages = await packageOperations.getAll();
      setPackages(allPackages);
      setFilteredPackages(allPackages);
    } catch (err) {
      console.error('Error loading packages:', err);
      setError('Error al cargar los paquetes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || pkg.type === typeFilter;
      return matchesSearch && matchesType;
    });

    if (priceSort !== 'none') {
      filtered.sort((a, b) => {
        return priceSort === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, typeFilter, priceSort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPackages}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Descubre el Mundo con Nosotros
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Encuentra el paquete turístico perfecto para ti. Desde aventuras nacionales hasta destinos exóticos internacionales.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar destinos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'national' | 'international')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los destinos</option>
                <option value="national">Nacionales</option>
                <option value="international">Internacionales</option>
              </select>
            </div>

            {/* Price Sort */}
            <div>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as 'asc' | 'desc' | 'none')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="none">Ordenar por precio</option>
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mx-auto mb-2">
                <Globe className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {packages.filter(p => p.type === 'international').length}
              </div>
              <div className="text-sm text-gray-600">Destinos Internacionales</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mx-auto mb-2">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {packages.filter(p => p.type === 'national').length}
              </div>
              <div className="text-sm text-gray-600">Destinos Nacionales</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto mb-2">
                <Search className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{filteredPackages.length}</div>
              <div className="text-sm text-gray-600">Paquetes Disponibles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron paquetes
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCatalog;