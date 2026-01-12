import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Descriptive alt for accessibility/fallback */}
        {/* Using a humanitarian aid related image */}
        <img 
          src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop" 
          alt="Humanitarian aid worker holding hands with child" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/75 to-blue-900/40" />
      </div>

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 font-medium mb-6 backdrop-blur-sm">
              مبادرة الإجلاء الإنساني
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              لأهل غزة الصامدين... <br />
              <span className="text-blue-400">لستم وحدكم</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
              في ظل القصف، وتحت الأنقاض، هناك من ما زال يؤمن أن الحياة تستحق فرصة أخرى. جئنا لمدّ يد العون، ونفتح لكم بابًا نحو الأمان.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 h-14 rounded-full shadow-lg shadow-blue-500/25"
                onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span>سجل الآن للحصول على المساعدة</span>
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-lg px-8 h-14 rounded-full backdrop-blur-sm"
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              >
                اعرف المزيد
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
