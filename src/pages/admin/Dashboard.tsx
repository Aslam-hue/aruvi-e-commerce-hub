import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Tv, Sofa, UtensilsCrossed, TrendingUp, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { productService } from "@/lib/supabase-utils";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    electronics: 0,
    furniture: 0,
    kitchen: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const allProducts = await productService.getProducts();
    const electronics = await productService.getProducts("electronics");
    const furniture = await productService.getProducts("furniture");

    setStats({
      totalProducts: allProducts.length,
      electronics: electronics.length,
      furniture: furniture.length,
      kitchen: 0, // Will be updated when kitchen section is added
    });
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      href: null,
    },
    {
      title: "Electronics",
      value: stats.electronics,
      icon: Tv,
      color: "bg-purple-500",
      href: "/admin/electronics/manage",
    },
    {
      title: "Furniture",
      value: stats.furniture,
      icon: Sofa,
      color: "bg-amber-500",
      href: "/admin/furniture/manage",
    },
    {
      title: "Kitchen Appliances",
      value: stats.kitchen,
      icon: UtensilsCrossed,
      color: "bg-green-500",
      href: "/admin/kitchen/manage",
    },
  ];

  const quickActions = [
    {
      title: "Add Electronics",
      icon: Tv,
      href: "/admin/electronics/add",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "Add Furniture",
      icon: Sofa,
      href: "/admin/furniture/add",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Add Kitchen Item",
      icon: UtensilsCrossed,
      href: "/admin/kitchen/add",
      color: "bg-green-50 text-green-700 border-green-200",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome to Sri Aruvi Agencies Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={cn(
                  "p-6 cursor-pointer transition-all hover:shadow-lg",
                  stat.href && "hover:scale-105"
                )}
                onClick={() => stat.href && navigate(stat.href)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.color)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className={cn(
                    "p-6 border-2 cursor-pointer transition-all hover:shadow-md",
                    action.color
                  )}
                  onClick={() => navigate(action.href)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{action.title}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No recent activity to display</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
