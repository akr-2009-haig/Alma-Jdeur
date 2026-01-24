import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "من هو المؤهل للحصول على المساعدة؟",
    answer: "الخدمة متاحة حصريًا لسكان قطاع غزة الموجودين داخل القطاع، الذين يواجهون ظروفًا صعبة بسبب الحرب والنزاع. نحن نقدم الدعم للأفراد والعائلات الذين يحتاجون إلى المساعدة في الإجلاء والانتقال إلى أماكن آمنة.",
  },
  {
    question: "كم يستغرق معالجة الطلب؟",
    answer: "بعد تقديم طلبك، سيقوم فريقنا بمراجعته خلال 3-5 أيام عمل. سنتواصل معك عبر الهاتف أو البريد الإلكتروني الذي قدمته لإعلامك بالخطوات التالية. نحن نعمل بجد لضمان معالجة سريعة وفعالة لجميع الطلبات.",
  },
  {
    question: "هل هناك رسوم للخدمة؟",
    answer: "نحن نعمل على توفير المساعدة بأقل التكاليف الممكنة. قد تكون هناك رسوم إدارية بسيطة لتغطية تكاليف المعالجة والإجراءات القانونية. سنوضح لك جميع التفاصيل المالية قبل المضي قدمًا في أي إجراء. الدفع يتم فقط عبر القنوات الرسمية المعتمدة.",
  },
  {
    question: "ما المستندات المطلوبة؟",
    answer: "ستحتاج إلى تقديم: نسخة من الهوية الفلسطينية، جواز السفر (إن وجد)، وصورة شخصية واضحة. في حال عدم توفر بعض المستندات، يمكننا مساعدتك في الحصول عليها أو إيجاد بدائل مناسبة. سنقوم بإرشادك خلال العملية بالكامل.",
  },
  {
    question: "كيف يمكنني التأكد من أن الخدمة موثوقة؟",
    answer: "المجد أوروبا هي منظمة إنسانية مسجلة رسميًا في ألمانيا منذ 2010، ولدينا مكتب رئيسي في القدس. نحن نعمل وفق أعلى معايير الشفافية والمهنية. يرجى التواصل معنا فقط عبر القنوات الرسمية الموجودة على موقعنا، والحذر من أي أرقام أو جهات غير معتمدة.",
  },
  {
    question: "هل يمكن تقديم طلب لعائلة كاملة؟",
    answer: "نعم، يمكنك تقديم طلب واحد يتضمن جميع أفراد عائلتك. في النموذج، يرجى ذكر عدد أفراد الأسرة في حقل الملاحظات. سيتواصل معك فريقنا لجمع المعلومات الإضافية اللازمة لجميع أفراد العائلة.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
              الأسئلة الشائعة
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg">
              إجابات على أكثر الأسئلة شيوعًا حول خدماتنا وكيفية المساعدة
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-5 text-right hover:no-underline hover:bg-slate-100 transition-colors">
                  <span className="text-lg font-bold text-slate-800 text-right">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              لديك سؤال آخر؟
            </h3>
            <p className="text-gray-600 mb-6">
              لا تتردد في التواصل معنا عبر البريد الإلكتروني أو نموذج التسجيل
            </p>
            <a
              href="#register"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              سجل الآن للحصول على المساعدة
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
