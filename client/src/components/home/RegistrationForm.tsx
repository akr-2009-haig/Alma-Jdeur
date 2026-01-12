import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Send } from "lucide-react";
import { motion } from "framer-motion";

export function RegistrationForm() {
  const { mutate: submitForm, isPending } = useCreateRegistration();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: "",
      gender: "male",
      idNumber: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      passportStatus: "yes",
      photoUrl: "", // Assuming empty string as placeholder
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    // In a real app, handle file upload here first
    // For now we just send the form data
    submitForm(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <section id="register" className="section-padding bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Form Header */}
            <div className="bg-primary p-8 md:p-10 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">هل تطمح للسفر وبداية حياة جديدة؟</h2>
                <p className="text-blue-100 text-lg">نحن هنا لمساعدتك! قم بتعبئة النموذج أدناه</p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel className="text-base font-semibold text-slate-700">الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input placeholder="الاسم الرباعي كما في الهوية" className="h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* ID Number */}
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-slate-700">رقم الهوية</FormLabel>
                          <FormControl>
                            <Input placeholder="رقم الهوية الفلسطينية" className="h-12 bg-slate-50 border-slate-200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-slate-700">تاريخ الميلاد</FormLabel>
                          <FormControl>
                            <Input type="date" className="h-12 bg-slate-50 border-slate-200 text-right" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-slate-700">رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input placeholder="رقم للتواصل (واتساب)" className="h-12 bg-slate-50 border-slate-200 text-right" dir="ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-slate-700">البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" className="h-12 bg-slate-50 border-slate-200 text-right" dir="ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-slate-700">الجنس</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6 mt-2"
                            >
                              <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" className="h-5 w-5 text-primary border-slate-400" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">ذكر</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" className="h-5 w-5 text-primary border-slate-400" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">أنثى</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Passport Status */}
                    <FormField
                      control={form.control}
                      name="passportStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-slate-700">هل يوجد جواز سفر؟</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">نعم</SelectItem>
                              <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                              <SelectItem value="no">لا يوجد</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Photo Upload (Visual) */}
                    <div className="col-span-1 md:col-span-2">
                      <FormLabel className="text-base font-semibold text-slate-700 mb-2 block">إرفاق صورة جواز السفر / الهوية</FormLabel>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer group">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                          <Upload className="text-primary h-8 w-8" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">اضغط هنا لرفع الصورة</p>
                        <p className="text-xs text-gray-400 mt-2">يرجى إرفاق صورة واضحة (JPEG, PNG)</p>
                        {/* Hidden input for visual completeness */}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          // Simple mock: set dummy URL if file selected
                          if(e.target.files?.[0]) {
                            form.setValue("photoUrl", "uploaded_file_placeholder.jpg");
                          }
                        }}/>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20 rounded-xl"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال الطلب
                        <Send className="mr-2 h-5 w-5 rotate-180" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-400 mt-4">
                    بإرسال هذا النموذج، أنت توافق على سياسة الخصوصية واستخدام البيانات لأغراض إنسانية فقط.
                  </p>

                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
