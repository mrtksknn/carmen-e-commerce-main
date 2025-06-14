
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const SubscriptionArea = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    setIsLoading(true);

    // Simulate subscription process
    setTimeout(() => {
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-red-500/25">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-900/50 p-4 rounded-full">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-white mb-4">
          Stay Updated with New Artworks
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
          Subscribe to our newsletter and be the first to know about new collections,
          exclusive pieces, and upcoming exhibitions.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} class="text-black inline-block bg-white text-accent-foreground px-8 py-2 rounded-lg font-semibold">
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-4" style={{ color: '#94a3b8' }}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionArea;
