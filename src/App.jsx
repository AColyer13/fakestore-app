import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home'; // Importing Home component

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/fakestore-app/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        {/* More routes will be added here */}
      </Routes>
    </Router>
  );
}

export default App;
