"use client"

import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Send, 
  Smartphone, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. TOP SECTION: BRAND & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <span className="text-3xl font-black italic tracking-tighter text-white">
                QUICK<span className="text-orange-500">BITES</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Bringing the taste of home to your doorstep. We connect you with the best home-chefs in your city for fresh, healthy, and delicious meals.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><FooterLink label="About Us" /></li>
                <li><FooterLink label="Our Team" /></li>
                <li><FooterLink label="Careers" /></li>
                <li><FooterLink label="Blog" /></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">For You</h4>
              <ul className="space-y-4 text-sm">
                <li><FooterLink label="Privacy Policy" /></li>
                <li><FooterLink label="Terms of Service" /></li>
                <li><FooterLink label="Refund Policy" /></li>
                <li><FooterLink label="Help Center" /></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3"><MapPin size={16} className="text-orange-500" /> Delhi, India</li>
                <li className="flex items-center gap-3"><Phone size={16} className="text-orange-500" /> +91 7743062799</li>
                <li className="flex items-center gap-3"><Mail size={16} className="text-orange-500" /> support@quickbites.com</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: APP STORES (The "Big Player" feel) */}
        {/* <div className="border-t border-gray-800 pt-10 pb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-white text-xl font-bold mb-2">Experience QuickBites on Mobile</h3>
            <p className="text-gray-500 text-sm">Get the app for the fastest ordering experience.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <AppBadge store="App Store" />
            <AppBadge store="Google Play" />
          </div>
        </div> */}

        {/* 3. BOTTOM SECTION: COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 italic">
            "Homemade food is a love language."
          </p>
          <div className="text-gray-500 text-xs font-medium uppercase tracking-tighter">
            © {new Date().getFullYear()} QUICKBITES FOOD SERVICES PRIVATE LIMITED. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
}

// 🟢 INTERNAL HELPER COMPONENTS
function SocialIcon({ icon }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
      {icon}
    </a>
  );
}

function FooterLink({ label }) {
  return (
    <a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">
      {label}
    </a>
  );
}

function AppBadge({ store }) {
  return (
    <div className="flex items-center gap-3 bg-black border border-gray-700 px-5 py-2.5 rounded-xl cursor-pointer hover:border-gray-500 transition-all">
      <Smartphone className="text-white" size={24} />
      <div className="text-left leading-none">
        <p className="text-[10px] text-gray-400 uppercase">Download on</p>
        <p className="text-sm font-bold text-white">{store}</p>
      </div>
    </div>
  );
}