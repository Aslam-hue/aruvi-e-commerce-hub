import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FurnitureAdmin() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Add Product",
      description: "Create new furniture listing",
      icon: Plus,
      path: "/admin/furniture/add",
      gradient: "from-green-600 to-emerald-600",
    },
    {
      title: "Manage Products",
      description: "View and edit all products",
      icon: Package,
      path: "/admin/furniture/manage",
      gradient: "from-amber-600 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-5xl font-bold text-white">Furniture</h1>
              <p className="text-gray-400 mt-2">Manage your furniture inventory</p>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  className="group cursor-pointer backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/30 transition-all duration-300 p-8 h-64 flex flex-col items-center justify-center text-center hover:shadow-2xl hover:shadow-amber-500/20"
                  onClick={() => navigate(option.path)}
                >
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${option.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                    <option.icon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{option.title}</h2>
                  <p className="text-gray-400">{option.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
