import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Zap, Armchair, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "✨ Access Granted", description: "Welcome to Admin Dashboard" });
    } else {
      toast({ 
        title: "❌ Access Denied", 
        description: "Incorrect password",
        variant: "destructive" 
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-electronics-bg via-background to-furniture-bg relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          {/* Glassmorphism Card */}
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 shadow-2xl p-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-electronics-primary to-furniture-primary flex items-center justify-center shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
              <p className="text-muted-foreground">Enter password to continue</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12 bg-white/50 backdrop-blur-sm border-white/30 text-lg py-6"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-electronics-primary to-furniture-primary hover:opacity-90 transition-opacity"
              >
                <Lock className="mr-2 h-5 w-5" />
                Unlock Admin Panel
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Dashboard with 2 category cards
  const categories = [
    {
      name: "Electronics",
      icon: Zap,
      path: "/admin/electronics",
      gradient: "from-electronics-primary via-blue-600 to-cyan-500",
      glowColor: "shadow-[0_0_40px_rgba(2,132,199,0.4)]"
    },
    {
      name: "Furniture",
      icon: Armchair,
      path: "/admin/furniture",
      gradient: "from-furniture-primary via-amber-600 to-orange-500",
      glowColor: "shadow-[0_0_40px_rgba(217,119,6,0.4)]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </motion.div>
          <p className="text-gray-400 text-lg">Select a category to manage</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, type: "spring" }}
              whileHover={{ y: -10 }}
            >
              <Card
                className={`group relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer h-80 ${category.glowColor} hover:${category.glowColor}`}
                onClick={() => navigate(category.path)}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Animated border glow */}
                <motion.div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-30 blur-xl`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative h-full flex flex-col items-center justify-center p-8 z-10">
                  {/* Icon with glow */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`mb-6 p-8 rounded-3xl bg-gradient-to-br ${category.gradient} shadow-2xl`}
                  >
                    <category.icon className="h-20 w-20 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-4xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">
                    {category.name}
                  </h2>

                  {/* Animated arrow */}
                  <motion.div
                    className="text-gray-400 text-sm flex items-center gap-2"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span>Manage Products</span>
                    <span>→</span>
                  </motion.div>

                  {/* Hover effect particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        initial={{
                          x: "50%",
                          y: "50%",
                          opacity: 0,
                        }}
                        animate={{
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Logout button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
              toast({ title: "Logged out successfully" });
            }}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-xl"
          >
            ← Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
