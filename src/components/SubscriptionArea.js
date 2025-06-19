import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useCustomToast } from "../components/ui/toast-context";
import { db } from "../firebase"; // <- Firebase bağlantısı
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
      toast({
        type: "error",
        message: "Please enter your email address to subscribe.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // E-posta zaten kayıtlı mı kontrol et
      const q = query(collection(db, "subscribers"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({
          type: "info",
          message: "This email is already subscribed.",
        });
        setIsLoading(false);
        return;
      }

      // Yeni abone olarak ekle
      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
      });

      toast({
        type: "success",
        message: "Thank you for subscribing to our newsletter.",
      });

      setEmail("");
    } catch (error) {
      console.error("Subscription failed:", error);
      toast({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
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

        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
          Subscribe to our newsletter and be the first to know about new collections,
          exclusive pieces, and upcoming exhibitions.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-black text-white border-none px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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

        <p className="text-sm mt-4" style={{ color: "#94a3b8" }}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionArea;
