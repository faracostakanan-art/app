import "@/App.css";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <div className="App" data-testid="app-root">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />
      
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
