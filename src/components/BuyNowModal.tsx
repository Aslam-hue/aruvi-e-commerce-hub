import { useState } from "react";
import { Product, OrderForm } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface BuyNowModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuyNowModal = ({ product, open, onOpenChange }: BuyNowModalProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<OrderForm>({
    name: "",
    mobile: "",
    address: "",
    quantity: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!form.name || !form.mobile || !form.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Construct WhatsApp message
    const message = `Hi, I want to buy:

Product: ${product.title}
${product.model_no ? `Model: ${product.model_no}` : ''}
Price: ₹${product.price.toLocaleString()}
Quantity: ${form.quantity}

Customer Details:
Name: ${form.name}
Mobile: ${form.mobile}
Address: ${form.address}`;

    // WhatsApp number (replace with actual business number)
    const whatsappNumber = "911234567890";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Reset form and close modal
    setForm({ name: "", mobile: "", address: "", quantity: 1 });
    onOpenChange(false);

    toast({
      title: "Redirecting to WhatsApp",
      description: "Your order details have been prepared",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Fill in your details to proceed with WhatsApp order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              placeholder="9876543210"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Enter your complete address"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">Order Summary</p>
            <p className="text-sm text-muted-foreground">{product.title}</p>
            <p className="text-lg font-bold mt-1">
              Total: ₹{(product.price * form.quantity).toLocaleString()}
            </p>
          </div>

          <Button type="submit" className="w-full">
            Continue to WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
