import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Tv, Sofa, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const [emiBadge, setEmiBadge] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmiBadge((prev) => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-electronics-bg to-furniture-bg py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--gradient-hero))] opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.h1
                variants={item}
                className="text-5xl md:text-6xl font-bold leading-tight"
              >
                Premium Electronics
                <br />
                <span className="text-gradient-furniture">& Furniture</span>
              </motion.h1>
              
              <motion.p variants={item} className="text-xl text-muted-foreground">
                Transform your home with our curated collection of top-brand electronics and luxury furniture
              </motion.p>

              <motion.div variants={item} className="flex gap-4">
                <Button size="lg" asChild>
                  <Link to="/electronics">
                    Shop Electronics
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/furniture">
                    Shop Furniture
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Electronics and Furniture"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Floating EMI Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-4 right-4"
              >
                <div className={`
                  px-6 py-3 rounded-full font-semibold text-white shadow-lg
                  ${emiBadge === 0 ? 'bg-green-500' : 'bg-electronics-primary'}
                  transition-colors duration-500
                `}>
                  {emiBadge === 0 ? '0% Interest' : 'No Cost EMI'}
                </div>
              </motion.div>

              {/* Floating Star */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -left-8 text-amber-400"
              >
                <Star className="h-16 w-16 fill-current" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Shop by Category
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Electronics Card */}
            <Link to="/electronics">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group overflow-hidden rounded-2xl shadow-lg h-96 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-electronics" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                
                <div className="relative h-full flex flex-col items-center justify-center text-white p-8 text-center">
                  <Tv className="h-20 w-20 mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="text-3xl font-bold mb-3">Electronics</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Latest TVs, Refrigerators, ACs & More
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="group-hover:translate-x-2 transition-transform"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </Link>

            {/* Furniture Card */}
            <Link to="/furniture">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group overflow-hidden rounded-2xl shadow-lg h-96 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-furniture" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                
                <div className="relative h-full flex flex-col items-center justify-center text-white p-8 text-center font-['Playfair_Display']">
                  <Sofa className="h-20 w-20 mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="text-3xl font-bold mb-3">Furniture</h3>
                  <p className="text-lg mb-6 opacity-90 font-['Inter']">
                    Premium Sofas, Beds, Dining Sets & More
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="group-hover:translate-x-2 transition-transform font-['Inter']"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="text-center"
            >
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">0% Interest EMI</h3>
              <p className="text-muted-foreground">Easy payment plans with zero interest</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-electronics-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white fill-current" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Brands</h3>
              <p className="text-muted-foreground">Authorized dealers of premium brands</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-furniture-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sofa className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">100% genuine products with warranty</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
