import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from './components/Navbar'
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <ScrollToTop/>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
