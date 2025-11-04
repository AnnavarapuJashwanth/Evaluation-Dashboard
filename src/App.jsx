import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";   
import Hero from "./components/Hero";
import Feature from "./components/Feature";
import About from "./components/About";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Assignments from "./pages/Assignments";
import Mentor from "./pages/Mentor";
import Quizzes from "./pages/Quizzes";
import Quiz from "./components/Quiz";
import QuizResults from "./components/QuizResults";
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
        <Route path="/assignments"element={<Assignments/>}/>
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz-results" element={<QuizResults />} />
      </Routes>
    </Router>
  );
}

export default App;
