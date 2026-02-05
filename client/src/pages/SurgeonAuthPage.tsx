import { useState } from "react";
import { useLocation } from "wouter";
import { useSurgeonAuthentication, useSurgeonRegistration } from "@/lib/hospitalAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Stethoscope, UserPlus, LogIn } from "lucide-react";

export default function SurgeonAuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [, navigateTo] = useLocation();
  const { toast } = useToast();
  
  const authMutation = useSurgeonAuthentication();
  const registerMutation = useSurgeonRegistration();

  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', role: 'surgeon' });

  const processSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authMutation.mutateAsync(signinForm);
      toast({ title: "تم تسجيل الدخول بنجاح" });
      navigateTo('/');
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    }
  };

  const processSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(signupForm);
      toast({ title: "تم التسجيل بنجاح" });
      navigateTo('/');
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <Stethoscope className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">سجل الجراحة العامة</h1>
          <p className="text-gray-600">مستشفى جامعة بني سويف</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'signin'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <LogIn className="inline-block w-5 h-5 ml-2" />
            تسجيل الدخول
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <UserPlus className="inline-block w-5 h-5 ml-2" />
            تسجيل جديد
          </button>
        </div>

        {activeTab === 'signin' ? (
          <form onSubmit={processSignin} className="space-y-4">
            <div>
              <Label htmlFor="signin-email" className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="signin-email"
                type="email"
                value={signinForm.email}
                onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                placeholder="surgeon@bsu.edu.eg"
                required
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="signin-password" className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                كلمة المرور
              </Label>
              <Input
                id="signin-password"
                type="password"
                value={signinForm.password}
                onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                placeholder="••••••••"
                required
                className="text-right"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              disabled={authMutation.isPending}
            >
              {authMutation.isPending ? 'جاري التحقق...' : 'دخول'}
            </Button>
          </form>
        ) : (
          <form onSubmit={processSignup} className="space-y-4">
            <div>
              <Label htmlFor="signup-name" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                الاسم الكامل
              </Label>
              <Input
                id="signup-name"
                type="text"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="د. محمد أحمد"
                required
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="signup-email" className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="signup-email"
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="surgeon@bsu.edu.eg"
                required
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="signup-password" className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                كلمة المرور
              </Label>
              <Input
                id="signup-password"
                type="password"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="signup-role" className="mb-2 block">الصلاحية</Label>
              <select
                id="signup-role"
                value={signupForm.role}
                onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                className="w-full p-3 border rounded-lg text-right bg-white"
              >
                <option value="resident">نائب / Resident</option>
                <option value="surgeon">جراح / Surgeon</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                ملاحظة: صلاحية رئيس القسم يتم تعيينها من قبل الإدارة
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'جاري التسجيل...' : 'تسجيل حساب جديد'}
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
          <p>نظام إدارة مرضى الجراحة العامة</p>
          <p className="mt-1">© 2026 مستشفى جامعة بني سويف</p>
        </div>
      </Card>
    </div>
  );
}