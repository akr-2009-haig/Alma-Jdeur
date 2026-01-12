import { motion } from "framer-motion";
import { HandHeart, Plane, Smile } from "lucide-react";

const services = [
  {
    icon: <HandHeart className="w-10 h-10" />,
    title: "الدعم الإنساني",
    description: "إحنا بنساعد الأفراد والعائلات على الإجلاء الآمن من مناطق الحرب والنزاع، ونضمن الكرامة والحماية طوال الطريق.",
    color: "bg-blue-500",
  },
  {
    icon: <Plane className="w-10 h-10" />,
    title: "فرص جديدة",
    description: "إحنا بنوفر طرق وفرص للناس يسافروا، ويستقروا بدول آمنة، ويبنو مستقبل مستقر.",
    color: "bg-teal-500",
  },
  {
    icon: <Smile className="w-10 h-10" />,
    title: "الاستقرار والراحة",
    description: "إحنا بنساعد الناس اللي تهجروا يوصلوا للرعاية الصحية، والدعم النفسي، والخدمات الأساسية بفترة الانتقال.",
    color: "bg-indigo-500",
  },
];

export function Services() {
  return (
    <section id="services" className="section-padding bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">خدماتنا</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg">
            نعمل على مدار الساعة لتقديم الدعم الشامل والمساعدة الحقيقية لمن يحتاجها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 group"
            >
              <div className={`w-16 h-16 ${service.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`${service.color} text-white p-3 rounded-xl shadow-md`}>
                  {service.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Additional Note */}
        <div className="mt-16 bg-blue-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">خدمة حصرية</h3>
            <p className="text-blue-100">
              الخدمة التي نقدمها متاحة فقط لسكان غزة الموجودين داخل قطاع غزة فقط!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
