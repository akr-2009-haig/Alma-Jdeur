import { HeartHandshake, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg text-primary-400">
                <HeartHandshake size={32} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl">المجد أوروبا</h3>
                <p className="text-xs text-gray-400">للإغاثة الإنسانية</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              منظمة إنسانية تسعى لتقديم العون والمساعدة للمجتمعات المتضررة في مناطق النزاع، مع التركيز الخاص على دعم أهلنا في غزة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-r-4 border-blue-500 pr-3">روابط سريعة</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#hero" className="hover:text-blue-400 transition-colors">الرئيسية</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">من نحن</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">خدماتنا</a></li>
              <li><a href="#register" className="hover:text-blue-400 transition-colors">التسجيل</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-r-4 border-blue-500 pr-3">سياساتنا</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">حماية البيانات</a></li>
            </ul>
          </div>

          {/* Contact - General Only */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-r-4 border-blue-500 pr-3">تواصل معنا</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                <span>ألمانيا، أوروبا</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500 shrink-0" size={18} />
                <span dir="ltr">info@almajdeurape.com</span>
              </li>
              <li className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs">
                تحذير: يرجى الحذر من أرقام الاحتيال. تواصل فقط عبر القنوات الرسمية.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} مؤسسة المجد للإغاثة الإنسانية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
