import "../assets/styles/aboutMe.css";

const AboutMe = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-12">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">About the Artist</h1>
        <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl shadow-primary/20 border-2 border-primary/30">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face"
            alt="Artist Portrait"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-light text-primary">
          Capturing the World Through Art
        </h2>
      </div>

      {/* Story */}
      <div className="prose prose-lg max-w-none space-y-8 font-sans">
        <section className="bg-[#0a0a0a] border border-primary/20 p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4 font-serif">My Artistic Journey</h3>
          <p className="leading-relaxed text-slate-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse
            ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Philosophy</h3>
            <p className="leading-relaxed text-slate-400">
              Art is not just seen—it’s felt. I believe in evoking emotions that connect
              people to places, memories, and moments through brushstrokes and color.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Technique</h3>
            <p className="leading-relaxed text-slate-400">
              I blend traditional and modern mediums to create depth, texture, and meaning.
              My process includes layering, intuition, and experimentation with materials.
            </p>
          </div>
        </section>

        <section className="bg-[#0a0a0a] p-8 rounded-2xl border border-primary/20 shadow-xl text-center">
          <h3 className="text-2xl font-bold text-white mb-6 font-serif">Exhibitions</h3>
          <p className="text-primary tracking-widest text-lg font-medium">COMING SOON</p>
        </section>

        <section className="text-center pt-8">
          <h3 className="text-3xl font-bold text-white mb-4 font-serif">Let's Connect</h3>
          <p className="mb-8 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I love connecting with fellow art enthusiasts, collectors, and anyone who
            appreciates the power of visual storytelling. Whether you're interested in
            commissioning a piece or simply want to chat about art, I'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-10 py-4 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
          >
            Get in Touch
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutMe;
