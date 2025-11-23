import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Tv, Sofa, Star, Zap, Sparkles, Gift, TrendingUp, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const [emiBadge, setEmiBadge] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

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
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
    },
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-32 h-32 bg-electronics-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-20 w-40 h-40 bg-furniture-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-electronics-bg via-background to-furniture-bg py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--gradient-hero))] opacity-50" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4 md:space-y-6"
            >
              <motion.div variants={item} className="inline-flex">
                <Badge className="bg-gradient-electronics text-white px-4 py-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 mr-2 inline" />
                  Premium Quality Guaranteed
                </Badge>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
              >
                Premium Electronics
                <br />
                <span className="text-gradient-furniture inline-block mt-2">& Furniture</span>
              </motion.h1>
              
              <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Transform your home with our curated collection of top-brand electronics and luxury furniture
              </motion.p>

              <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <Button size="lg" asChild className="hover-scale group text-base">
                  <Link to="/electronics">
                    <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Shop Electronics
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hover-scale group text-base border-2">
                  <Link to="/furniture">
                    <Sofa className="mr-2 h-5 w-5 group-hover:-rotate-12 transition-transform" />
                    Shop Furniture
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={item} className="flex flex-wrap gap-4 md:gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <span className="font-semibold">1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Truck className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <span className="font-semibold">Free Delivery</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mt-8 md:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Electronics and Furniture"
                  className="w-full h-auto object-cover"
                />
                
                {/* Animated Gradient Overlay */}
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
                      'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                      'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute inset-0 pointer-events-none"
                />
              </div>
              
              {/* Floating EMI Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -top-4 -right-4 md:top-4 md:right-4"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`
                    px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-white shadow-lg text-sm md:text-base
                    ${emiBadge === 0 ? 'bg-green-500' : 'bg-electronics-primary'}
                    transition-colors duration-500
                  `}
                >
                  {emiBadge === 0 ? (
                    <span className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      0% Interest
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      No Cost EMI
                    </span>
                  )}
                </motion.div>
              </motion.div>

              {/* Floating Star */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -left-6 md:-top-8 md:-left-8 text-amber-400"
              >
                <Star className="h-12 w-12 md:h-16 md:w-16 fill-current drop-shadow-lg" />
              </motion.div>

              {/* Decorative Circles */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-furniture-primary/20 rounded-full blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 md:py-16 bg-background relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-electronics-primary/5 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-furniture-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Explore our carefully curated collections designed to elevate your lifestyle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Electronics Card */}
            <Link to="/electronics" className="group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-2xl shadow-lg h-80 md:h-96 cursor-pointer"
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-electronics"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
                
                <div className="relative h-full flex flex-col items-center justify-center text-white p-6 md:p-8 text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Tv className="h-16 w-16 md:h-20 md:w-20 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Electronics</h3>
                  <p className="text-base md:text-lg mb-6 opacity-90">
                    Latest TVs, Refrigerators, ACs & More
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="group-hover:translate-x-2 transition-all duration-300 shadow-lg"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  {/* Floating Icons */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 right-4 opacity-20"
                  >
                    <Zap className="h-12 w-12" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>

            {/* Furniture Card */}
            <Link to="/furniture" className="group">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-2xl shadow-lg h-80 md:h-96 cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-furniture"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
                
                <div className="relative h-full flex flex-col items-center justify-center text-white p-6 md:p-8 text-center font-['Playfair_Display']">
                  <motion.div
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sofa className="h-16 w-16 md:h-20 md:w-20 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Furniture</h3>
                  <p className="text-base md:text-lg mb-6 opacity-90 font-['Inter']">
                    Premium Sofas, Beds, Dining Sets & More
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="group-hover:translate-x-2 transition-all duration-300 font-['Inter'] shadow-lg"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  {/* Floating Icons */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-4 left-4 opacity-20"
                  >
                    <Sparkles className="h-12 w-12" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted to-background relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose Us</h2>
            <p className="text-muted-foreground text-base md:text-lg">Experience the best in quality and service</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow"
              >
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">0% Interest EMI</h3>
              <p className="text-sm md:text-base text-muted-foreground">Easy payment plans with zero interest</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-electronics w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow"
              >
                <Star className="h-8 w-8 md:h-10 md:w-10 text-white fill-current" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Top Brands</h3>
              <p className="text-sm md:text-base text-muted-foreground">Authorized dealers of premium brands</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-furniture w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow"
              >
                <Shield className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-sm md:text-base text-muted-foreground">100% genuine products with warranty</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
