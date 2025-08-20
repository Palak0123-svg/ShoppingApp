//import logo from './logo.svg';
//import './App.css';
import { Routes,Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Page404 from "./pages/Page404";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Layout/Routes/private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Layout/Routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

// style import
import './style/Auth.css'
import'./style/spinner.css'
import CreateCatrgory from "./pages/admin/CreateCatrgory";
import CreateProduct from "./pages/admin/CreateProduct"
import User from "./pages/admin/User";
import Profile from "./pages/user/Profile";
import Orders from "./pages/user/Orders";
import Products from "./pages/admin/Products";
import UpdateProduct from "./pages/admin/UpdateProduct";
import SerachInput from "./components/form/SerachInput";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/user/Categories";
import CategoryProduct from "./pages/user/CategoryProduct";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/admin/AdminOrders";


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      
      <Route path="/categories" element={<Categories/>}></Route>

      <Route path="/category/:slug" element={<CategoryProduct/>}></Route>

      <Route path="/cart" element={<Cart/>}></Route>

      <Route path="/product/:slug" element={<ProductDetails/>}></Route>

      <Route path="/about" element={<About></About>}></Route>
      
      <Route path="/contact" element={<Contact></Contact>}></Route>

      <Route path="/policy" element={<Policy></Policy>}></Route>

      <Route path="/register" element={<Register></Register>}></Route>

      <Route path="/login" element={<Login></Login>}></Route>
      
      <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>

      <Route path="/search" element={<Search></Search>}></Route>

      <Route path="/dashboard" element={<PrivateRoute></PrivateRoute>}>
        <Route path="user" element={<Dashboard></Dashboard>}></Route>
        <Route path="user/profile" element={<Profile/>}></Route>
        <Route path="user/orders" element={<Orders/>}></Route>
      </Route>  

      <Route path="/dashboard" element={<AdminRoute/>}>
        <Route path="admin" element={<AdminDashboard/>}></Route>
        <Route path="admin/create-category" element={<CreateCatrgory/>}></Route>
        <Route path="admin/create-product" element={<CreateProduct/>}></Route>
        <Route path="admin/products" element={<Products/>}></Route>
        <Route path="admin/product/:slug" element={<UpdateProduct/>}></Route>
        <Route path="admin/user" element={<User/>}></Route>
        <Route path="admin/orders" element={<AdminOrders/>}></Route>
      </Route> 

      
      <Route path="/*" element={<Page404></Page404>}></Route>

      
    </Routes>
    </>
  );
}

export default App;
