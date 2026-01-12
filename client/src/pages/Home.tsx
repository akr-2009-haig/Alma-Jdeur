import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { RegistrationForm } from "@/components/home/RegistrationForm";
import { AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Important Notice Banner */}
        <div className="bg-amber-50 border-y border-amber-200 py-3">
          <div className="container-custom flex items-center justify-center gap-2 text-amber-800 text-sm md:text-base font-medium">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              تنويه هام: يرجى عدم التعامل مع أي أرقام غير رسمية. التواصل لدفع الرسوم يتم فقط عبر القنوات المعتمدة.
            </p>
          </div>
        </div>

        <About />
        <Services />
        <RegistrationForm />
      </main>

      <Footer />
    </div>
  );
}
