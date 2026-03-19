import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import RegisterFlow from "@/components/RegisterFlow";

const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Features />
      <HowItWorks />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App" data-testid="app-root">
      <div className="grain-overlay" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterFlow />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
