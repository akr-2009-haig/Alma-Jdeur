import { motion } from "framer-motion";
import { ShieldCheck, Globe, Users } from "lucide-react";

export function About() {
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
            >
              {/* Image of diverse group of people or community support */}
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop" 
                alt="Community support and unity" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-60 z-0" />
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 relative inline-block">
                من نحن
                <span className="absolute bottom-0 right-0 w-1/2 h-2 bg-primary/30 -z-10 transform translate-y-1"></span>
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                الـمجد أوروبا هي منظمة إنسانية تأسست في عام 2010 في ألمانيا. نحن متخصصون في تقديم المساعدات وجهود الإنقاذ للمجتمعات المسلمة في مناطق النزاع والحروب.
              </p>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                جذورنا متأصلة في قيم وتراث الإسلام، ويقع مقرنا الرئيسي في القدس الشريف. منذ البداية، التزمنا بدعم المجتمعات المسلمة حول العالم، حيث نعمل في عدة دول لتقديم المساعدات والإغاثة لمن هم أكثر تضررًا.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">حماية وأمان</h4>
                    <p className="text-sm text-gray-500">نلتزم بأعلى معايير الحماية للمستفيدين.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-primary">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">وصول عالمي</h4>
                    <p className="text-sm text-gray-500">نعمل عبر الحدود لتقديم المساعدة.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
