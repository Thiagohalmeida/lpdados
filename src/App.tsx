import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Reports from './components/Reports';
import Insights from './components/Insights';
import Feedback from './components/Feedback';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      <main className="pt-16"> {/* Add padding top to account for fixed header */}
        <Hero />
        <Projects />
        <Reports />
        <Insights />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
}

export default App;