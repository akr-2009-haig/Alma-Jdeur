import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#hero" },
    { name: "من نحن", href: "#about" },
    { name: "خدماتنا", href: "#services" },
    { name: "الأسئلة الشائعة", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-primary p-2 rounded-lg text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <HeartHandshake size={28} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-xl leading-none",
                isScrolled ? "text-primary" : "text-white"
              )}>
                المجد أوروبا
              </span>
              <span className={cn(
                "text-xs opacity-80",
                isScrolled ? "text-gray-600" : "text-blue-50"
              )}>
                للإغاثة الإنسانية
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-accent text-sm lg:text-base",
                isScrolled ? "text-gray-700" : "text-white/90 hover:text-white"
              )}
            >
              {link.name}
            </a>
          ))}
          <Button 
            className="bg-accent hover:bg-accent/90 text-white font-bold rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
            onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
          >
            سجل الآن
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-current"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-gray-800" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-gray-800" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-xl animate-in slide-in-from-top-5">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-800 font-medium p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button 
              className="w-full bg-primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              سجل الآن
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
