import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import About from '../components/landing/About'; // Import your new component

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      <div className="w-full">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-32">
        
        <section id="hero" className="pt-10 md:pt-20">
          <Hero />
        </section>

        <section id="features">
          <Features />
        </section>

        {/* Your new section */}
        <section id="about" className="pb-20">
          <About />
        </section>

      </div>

      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Gamified DSA. Built for the future of learning.</p>
        </div>
      </footer>

    </main>
  );
}