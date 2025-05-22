import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Docs from './components/Docs';
import Dashboards from './components/Dashboards';
import Pesquisas from './components/Pesquisas';
import Insights from './components/Insights';
import Feedback from './components/Feedback';
import Footer from './components/Footer';


// use os IDs nas <section> conforme explicado antes


function App() {
  return (
    <div className="min-h-screen bg-background-light scroll-smooth">
      <Header />
      <main className="pt-20 space-y-16">
        <section id="hero">
          <Hero />
        </section>

        <section id="projects">
          <Projects />
        </section>

        <section id="Docs">
          <Docs />
        </section>
        
        <section id="dashboards">
          <Dashboards />
        </section>

        <section id="Insights">
          <Insights />
        </section>

        <section id="Pesquisas">
          <Pesquisas />
        </section>
        
        <section id="feedback">
          <Feedback />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
