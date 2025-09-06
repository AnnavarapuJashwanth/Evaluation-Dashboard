import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";   
import Hero from "./components/Hero";
import Feature from "./components/Feature";
import About from "./components/About";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <section id="hero">
                <Hero />
              </section>
              <section id="features">
                <Feature />
              </section>
              <section id="about">
                <About />
              </section>
              <section id="contact">
                <Footer />
              </section>
            </>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
}

export default App;
