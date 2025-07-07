import { useCart } from "../contex/CartContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contex/ThemeContext";

const CartPreview = ({ isOpen, onClose }) => {
  const { cartItems, cartCount, cartTotal } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div 
        className={`w-full max-w-md h-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-xl overflow-y-auto`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Tu Carrito ({cartCount})</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {cartCount === 0 ? (
          <div className="p-4 text-center">
            <p>Tu carrito está vacío</p>
            <button
              onClick={() => {
                onClose();
                navigate("/menu");
              }}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded"
            >
              Ver Menú
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex border-b pb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <span>No image</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-500">Tamaño: {item.selectedSize.Nombre}</p>
                    )}
                    <p className="text-orange-600 font-bold">
                      ${item.selectedSize?.Precio 
                        ? (item.selectedSize.Precio * item.quantity).toFixed(2)
                        : (item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm">Cantidad: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPreview;