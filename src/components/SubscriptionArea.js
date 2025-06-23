import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useCustomToast } from "../components/ui/toast-context";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const SubscriptionArea = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useCustomToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast({ type: "error", message: "Please enter your email address to subscribe." });
    }

    setIsLoading(true);

    try {
      const subscriberRef = collection(db, "subscribers");
      const q = query(subscriberRef, where("email", "==", email));
      const existing = await getDocs(q);

      if (!existing.empty) {
        toast({ type: "info", message: "This email is already subscribed." });
        return;
      }

      await addDoc(subscriberRef, {
        email,
        subscribedAt: serverTimestamp(),
      });

      toast({ type: "success", message: "Thank you for subscribing to our newsletter." });
      setEmail("");
    } catch (error) {
      console.error("Subscription failed:", error);
      toast({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-red-500/25">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-900/50 p-4 rounded-full">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Updated with New Artworks
        </h2>

        <p className="text-lg mb-8 max-w-2xl mx-auto text-slate-400">
          Subscribe to our newsletter and be the first to know about new collections,
          exclusive pieces, and upcoming exhibitions.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-md bg-black text-white px-3 py-2 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="text-black bg-white px-8 py-2 rounded-lg font-semibold"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        <p className="text-sm mt-4 text-slate-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionArea;
