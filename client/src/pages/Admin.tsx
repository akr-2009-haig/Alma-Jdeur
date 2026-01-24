import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Registration } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Phone, Mail, Calendar, IdCard } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Admin() {
  const { data: registrations, isLoading, error } = useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await fetch(api.registrations.list.path);
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return res.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["registration-stats"],
    queryFn: async () => {
      const res = await fetch("/api/registrations/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">خطأ في التحميل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-6 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">لوحة التحكم</h1>
              <p className="text-gray-600 mt-1">إدارة طلبات التسجيل</p>
            </div>
            <a
              href="/"
              className="text-primary hover:text-primary/80 font-medium"
            >
              العودة للموقع
            </a>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium opacity-90">
                إجمالي الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <Users className="w-8 h-8 opacity-80" />
                <p className="text-4xl font-bold">{stats?.total || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium opacity-90">
                طلبات جديدة اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <Calendar className="w-8 h-8 opacity-80" />
                <p className="text-4xl font-bold">
                  {registrations?.filter(r => {
                    const createdAt = r.createdAt ? new Date(r.createdAt) : null;
                    if (!createdAt) return false;
                    const today = new Date();
                    return createdAt.toDateString() === today.toDateString();
                  }).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium opacity-90">
                معدل الاستجابة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <IdCard className="w-8 h-8 opacity-80" />
                <p className="text-4xl font-bold">100%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">قائمة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {!registrations || registrations.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد طلبات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {registration.fullName}
                        </h3>
                        <div className="flex gap-2">
                          <Badge
                            variant={registration.gender === "male" ? "default" : "secondary"}
                          >
                            {registration.gender === "male" ? "ذكر" : "أنثى"}
                          </Badge>
                          <Badge
                            variant={
                              registration.passportStatus === "yes"
                                ? "default"
                                : registration.passportStatus === "expired"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            جواز السفر:{" "}
                            {registration.passportStatus === "yes"
                              ? "متاح"
                              : registration.passportStatus === "expired"
                              ? "منتهي"
                              : "غير متاح"}
                          </Badge>
                        </div>
                      </div>
                      {registration.createdAt && (
                        <span className="text-sm text-gray-500">
                          {format(new Date(registration.createdAt), "PPP", {
                            locale: ar,
                          })}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <span>رقم الهوية: {registration.idNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>تاريخ الميلاد: {registration.dateOfBirth}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700" dir="ltr">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{registration.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700" dir="ltr">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{registration.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
