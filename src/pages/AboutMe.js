import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Brush, Eye, Mail, ArrowRight } from "lucide-react";

const AboutMe = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#030303] min-h-screen text-white font-sans overflow-hidden">

      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[-20%] w-[60vw] h-[60vw] bg-primary/10 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Editorial Split Hero Section */}
      <section className="relative z-10 w-full min-h-[80vh] flex flex-col lg:flex-row items-center pt-8">

        {/* Left Side: Photography */}
        <div className="lg:w-5/12 relative min-h-[50vh] lg:min-h-[75vh] w-full p-6 lg:p-12 group flex items-center justify-center">
          <div className="w-full h-[60vh] lg:h-full relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 bg-black/20 z-10 mix-blend-multiply transition-opacity duration-700 group-hover:bg-transparent"></div>
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=1600&fit=crop"
              alt="The Artist Studio"
              className="w-full h-full object-cover object-center transition-transform duration-[20s] group-hover:scale-110"
            />
            {/* Vertical Text overlay for desktop */}
            <div className="absolute bottom-10 left-8 z-20 hidden lg:block opacity-40">
              <p className="writing-vertical-rl rotate-180 uppercase tracking-[0.5em] text-sm font-semibold">Behind the Canvas</p>
            </div>
          </div>
        </div>

        {/* Right Side: Manifesto & Bio */}
        <div className="lg:w-7/12 flex flex-col justify-center px-8 sm:px-12 py-12 animate-fade-in relative">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block opacity-80">
            The Mastermind
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 font-serif leading-[1.1] tracking-tight">
            I don't paint things.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-primary">I paint feelings.</span>
          </h1>

          <div className="w-16 h-1 bg-primary mb-10"></div>

          <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg max-w-xl">
            <p>
              Every stroke of the brush is a whisper of my soul on a silent canvas. I started
              my journey looking for a way to freeze moments that words could never accurately describe.
            </p>
            <p>
              My artworks are born from the chaotic yet beautiful intersections of human emotion,
              nature's raw power, and the memories we leave behind. The canvas is not just a surface;
              it's an archive of emotional states.
            </p>
          </div>

          {/* Social Proof / Stats Area */}
          <div className="grid grid-cols-2 gap-8 mt-16 border-t border-white/10 pt-10">
            <div>
              <p className="text-4xl font-serif text-white mb-2">12+</p>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Years Creating</p>
            </div>
            <div>
              <p className="text-4xl font-serif text-white mb-2">300+</p>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Original Pieces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Method & Philosophy Matrix */}
      <section className="relative z-10 py-16 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">The Doctrine</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            My creative process is a delicate balance between meticulous technique and
            raw, unbridled intuition. This is how the magic happens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="group bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-white group-hover:scale-150 transition-transform duration-700">
              <Eye size={100} />
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <Eye size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Observation</h3>
            <p className="text-gray-400 font-light leading-relaxed">
              Before the brush touches the canvas, I spend days absorbing the subject. It's about
              seeing beyond the physical form and capturing the essence of the atmosphere.
            </p>
          </div>

          <div className="group bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-sm hover:bg-primary/20 transition-colors duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-white group-hover:scale-150 transition-transform duration-700">
              <Palette size={100} />
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <Palette size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Color Mapping</h3>
            <p className="text-gray-400 font-light leading-relaxed">
              Colors possess their own vocabulary. I curate specific palettes that resonate
              with the mood, treating dark and cold tones with the same reverence as vibrant highlights.
            </p>
          </div>

          <div className="group bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-white group-hover:scale-150 transition-transform duration-700">
              <Brush size={100} />
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <Brush size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Execution</h3>
            <p className="text-gray-400 font-light leading-relaxed">
              The final stage is deeply physical. Layers of texture are built up, scraped away,
              and reimagined until the canvas perfectly mirrors the emotion I set out to portray.
            </p>
          </div>

        </div>
      </section>

      {/* Connect & Contact Glass Card */}
      <section className="relative z-10 py-8 px-6 lg:px-20 mb-20 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-[#0a0a0a] backdrop-blur-xl z-0"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay z-0"></div>

          <div className="relative z-10 p-12 md:p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-8 shadow-inner ring-2 ring-white/10 text-white">
              <Mail size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Commission a Legacy</h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed mb-10">
              Whether you are a collector looking to acquire an original piece or interested
              in commissioning a custom masterwork tailored to your space, my studio is open for dialogue.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(120,34,34,0.6)] hover:scale-105"
            >
              Reach out to the Studio <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutMe;
