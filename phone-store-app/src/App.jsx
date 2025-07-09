import { useState, useEffect } from 'react';
import './App.css';

const products = [
  { id: 1, name: 'iPhone 14 Pro', price: 1199, image: '/phones/iphone-14-pro.webp' },
  { id: 2, name: 'Samsung Galaxy S23', price: 1099, image: '/phones/samsung-galaxy-s23.webp' },
  { id: 3, name: 'AirPods Pro', price: 249, image: '/accessories/airPods-pro.webp' },
  { id: 4, name: 'Wireless Charger', price: 59, image: '/accessories/Wireless-Charger.webp' },
  { id: 5, name: 'Google Pixel 7', price: 599, image: '/phones/google-pixel-7.webp' },
  { id: 6, name: 'OnePlus 11', price: 699, image: '/phones/oneplus-11.webp' },
  { id: 7, name: 'Sony WH-1000XM5', price: 349, image: '/accessories/Sony-wh-1000xm5.webp' },
  { id: 8, name: 'Fitbit Charge 5', price: 149, image: '/accessories/Fitbit-Charge-5.webp' },
  { id: 9, name: 'Google Nest Hub', price: 99, image: '/accessories/Google-Nest-Hub.webp' },
  { id: 10, name: 'Apple Watch Series 8', price: 399, image: '/accessories/Apple-Watch-Series-8.webp' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [viewOrders, setViewOrders] = useState(false);
  const [orders, setOrders] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const newOrder = { name, email, phone, cart, total, time: new Date().toLocaleString() };
    const updatedOrders = [...orders, newOrder];

    // Save locally
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    // Send to Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbw1TPP77KLzICGiCH43Wzjw3lIQ5VwtuY2pObNl-NA/dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Order submitted successfully!');
        setCart([]);
        setShowCheckout(false);
      })
      .catch((err) => {
        console.error('Order error:', err);
        alert('There was a problem submitting your order.');
      });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <header className="sticky-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="flex items-center gap-4 text-2xl font-bold text-blue-700">
          <img src="/logos/store-logo.webp" alt="Logo" style={{ height: '70px' }} />
          Phone & Accessories Store
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setViewOrders(!viewOrders)}>
            {viewOrders ? 'Back to Shop' : 'View Orders'}
          </button>
          <button onClick={() => setShowCheckout(!showCheckout)}>
            <img src="/logos/cart-icon.webp" alt="Cart" style={{ height: '24px' }} /> Cart ({cart.length})
          </button>
        </div>
      </header>

      {viewOrders ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">📦 Orders Dashboard</h2>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <ul className="list-none p-0">
              {orders.map((order, i) => (
                <li key={i} className="mb-6 border-b pb-4">
                  <h3 className="font-bold">Order #{i + 1}</h3>
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Time:</strong> {order.time}</p>
                  <ul className="ml-4 list-disc">
                    {order.cart.map((item, idx) => (
                      <li key={idx}>{item.name} - ${item.price}</li>
                    ))}
                  </ul>
                  <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : showCheckout ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">🧾 Checkout</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left">Product</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p><strong>Total:</strong> ${total.toFixed(2)}</p>

              <form onSubmit={handleOrderSubmit} className="mt-6">
                <h3 className="font-semibold mb-2">Customer Info</h3>
                <input name="name" placeholder="Full Name" required className="block mb-2 p-2 w-full border" />
                <input name="email" type="email" placeholder="Email" required className="block mb-2 p-2 w-full border" />
                <input name="phone" placeholder="Phone Number" required className="block mb-2 p-2 w-full border" />
                <button type="submit" className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
                  Place Order
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 mt-8">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg w-48">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-gray-700">${product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
