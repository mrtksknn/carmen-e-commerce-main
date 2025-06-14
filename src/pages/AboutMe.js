import '../assets/styles/aboutMe.css';

const AboutMe = () => {

  const avatarImage = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url("https://loremflickr.com/640/480/people")'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-12">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-6">About the Artist</h1>
        <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face"
            alt="Artist Portrait"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl text-muted-foreground font-light" style={{ color: '#94a3b8' }}>
          Capturing the World Through Art
        </h2>
      </div>

      {/* Story */}
      <div className="prose prose-lg max-w-none space-y-8">
        <div className="bg-red-500/25 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-4">My Artistic Journey</h3>
          <p className="text-muted-foreground leading-relaxed" style={{ color: '#94a3b8' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Philosophy</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ color: '#94a3b8' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Technique</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ color: '#94a3b8' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border">
          <h3 className="text-2xl font-bold text-white mb-6">Exhibitions</h3>
          <div className="space-y-4 text-white">
            <h3>COMING SOON</h3>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Let's Connect</h3>
          <p className="text-muted-foreground mb-6" style={{ color: '#94a3b8' }}>
            I love connecting with fellow art enthusiasts, collectors, and anyone who
            appreciates the power of visual storytelling. Whether you're interested in
            commissioning a piece or simply want to chat about art, I'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="text-black bg-white inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;