import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getNavBg = () => {
    if (location.pathname === '/electronics') return 'bg-[hsl(199,89%,38%)]';
    if (location.pathname === '/furniture') return 'bg-[hsl(32,95%,34%)]';
    return 'bg-primary';
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/electronics", label: "Electronics" },
    { to: "/furniture", label: "Furniture" },
  ];

  // Only show Admin link on home page
  if (location.pathname === '/') {
    navLinks.push({ to: "/admin", label: "Admin" });
  }

  return (
    <>
      <nav className={`sticky top-0 z-[1000] ${getNavBg()} text-white shadow-lg transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition-opacity">
              <Store className="h-6 w-6" />
              Sri Aruvi Agencies
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:opacity-80 transition-opacity font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100] md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl z-[1200] md:hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-foreground">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
