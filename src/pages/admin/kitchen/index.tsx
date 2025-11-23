import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Package, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function KitchenAdmin() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Add Kitchen Appliance",
      description: "Add new kitchen appliances to the store",
      icon: Plus,
      href: "/admin/kitchen/add",
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "Manage Kitchen Appliances",
      description: "View and manage all kitchen appliances",
      icon: Package,
      href: "/admin/kitchen/manage",
      color: "from-blue-600 to-cyan-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kitchen Appliances</h1>
            <p className="text-gray-500 mt-1">Manage your kitchen appliances inventory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-8 cursor-pointer transition-all hover:shadow-xl border-2 hover:border-green-500 group"
                  onClick={() => navigate(option.href)}
                >
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {option.title}
                  </h2>
                  <p className="text-gray-600">{option.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
