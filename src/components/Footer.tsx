import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sri Aruvi Agencies</h3>
            <p className="text-sm opacity-90">
              Your trusted partner for premium electronics and furniture with 0% interest EMI options.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:underline opacity-90">Home</a></li>
              <li><a href="/electronics" className="hover:underline opacity-90">Electronics</a></li>
              <li><a href="/furniture" className="hover:underline opacity-90">Furniture</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 opacity-90">
                <Phone className="h-4 w-4" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center gap-2 opacity-90">
                <Mail className="h-4 w-4" />
                <span>info@sriarvui.com</span>
              </div>
              <div className="flex items-center gap-2 opacity-90">
                <MapPin className="h-4 w-4" />
                <span>Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} Sri Aruvi Agencies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
