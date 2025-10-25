import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  farmName: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  healthScore: number;
  feedQuality: string;
  age: string;
  weight: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {product.badge}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
        >
          <Heart
            size={18}
            className={`${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            } transition-colors`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Essential Information - Always Visible */}
        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3">from {product.farmName}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          <span className="text-sm text-gray-400">per bird</span>
        </div>

        {/* Expandable Details Section */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showDetails ? "max-h-96 mb-4" : "max-h-0"
          }`}
        >
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-4">{product.description}</p>

            {/* Detailed Stats */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Health Score:</span>
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="text-[10px]">🏥</span>
                    {product.healthScore}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feed Quality:</span>
                <span className="font-semibold text-gray-900">
                  {product.feedQuality}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-semibold text-gray-900">
                  {product.age}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-semibold text-gray-900">
                  {product.weight}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Show More/Less Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 text-xs font-medium text-green-600 cursor-pointer hover:text-green-700 flex items-center justify-center gap-1 transition-colors mb-3"
        >
          {showDetails ? (
            <>
              Show Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              See More Details <ChevronDown size={16} />
            </>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-full font-medium transition-colors text-sm">
            + Add to Cart
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2.5 border-2 border-gray-200 hover:border-gray-300 rounded-full font-medium transition-colors text-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
