import { useNavigate } from 'wouter';
import { useActiveCasesList, useDashboardMetrics, useAuthenticatedSurgeon, useAnnouncementsList } from '@/lib/hospitalAPI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Users, AlertCircle, UserPlus, BarChart3, Archive, MessageSquare, Stethoscope, Briefcase } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const transformMetricsToBoxes = (metricsPayload: any) => [
  { labelText: 'الحالات النشطة', valueNum: metricsPayload?.activePatients ?? 0, IconRef: Activity, gradientClasses: 'from-cyan-400 via-blue-500 to-indigo-600', descriptionText: 'مريض تحت الرعاية' },
  { labelText: 'حالات الطوارئ', valueNum: metricsPayload?.emergencyCases ?? 0, IconRef: AlertCircle, gradientClasses: 'from-rose-400 via-red-500 to-pink-600', descriptionText: 'حالة عاجلة' },
  { labelText: 'عمليات اليوم', valueNum: metricsPayload?.todayOperations ?? 0, IconRef: Stethoscope, gradientClasses: 'from-purple-400 via-violet-500 to-fuchsia-600', descriptionText: 'عملية جراحية' },
  { labelText: 'إجمالي المرضى', valueNum: metricsPayload?.totalPatients ?? 0, IconRef: Users, gradientClasses: 'from-emerald-400 via-green-500 to-teal-600', descriptionText: 'سجل كامل' },
];

const buildNavigationButtons = () => [
  { IconRef: UserPlus, textLabel: 'تسجيل مريض', routePath: '/cases', backgroundClass: 'bg-emerald-600' },
  { IconRef: Briefcase, textLabel: 'ملفات المرضى', routePath: '/cases', backgroundClass: 'bg-blue-600' },
  { IconRef: Archive, textLabel: 'الأرشيف', routePath: '/discharged', backgroundClass: 'bg-amber-600' },
  { IconRef: BarChart3, textLabel: 'التقارير', routePath: '/metrics', backgroundClass: 'bg-purple-600' },
  { IconRef: MessageSquare, textLabel: 'النشرات', routePath: '/bulletin', backgroundClass: 'bg-pink-600' },
];

const processPatientRecordsForActivity = (patientArray: any[]) => {
  return (patientArray || []).slice(0, 6).map((record: any) => {
    const admissionDateTime = new Date(record.admissionDate);
    const formattedDateTime = `${admissionDateTime.toLocaleDateString('ar-EG')} - ${admissionDateTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    
    return {
      patientIdentifier: record.id,
      patientName: record.fullName,
      admissionTypeLabel: record.admissionType === 'emergency' ? 'طوارئ' : 'عملية',
      departmentName: record.department,
      formattedTimestamp: formattedDateTime,
      isEmergencyCase: record.admissionType === 'emergency'
    };
  });
};

export default function MainControlPanel() {
  const routerNavigate = useNavigate();
  const { data: authenticatedDoctor } = useAuthenticatedSurgeon();
  const { data: dashboardMetricsData, isLoading: metricsLoadingStatus, error: metricsErrorState } = useDashboardMetrics();
  const { data: activePatientRecords, isLoading: patientsLoadingStatus } = useActiveCasesList();
  const { data: announcementRecords, isLoading: announcementsLoadingStatus } = useAnnouncementsList();

  const metricsBoxConfiguration = transformMetricsToBoxes(dashboardMetricsData);
  const navigationButtonsConfiguration = buildNavigationButtons();
  const processedActivityRecords = processPatientRecordsForActivity(activePatientRecords);

  if (metricsErrorState) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" dir="rtl">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-lg">تعذر تحميل البيانات. يرجى تحديث الصفحة.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderMetricBox = (boxConfig: any, indexKey: number) => (
    <div key={indexKey} className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className={`bg-gradient-to-tr ${boxConfig.gradientClasses} p-6 text-white`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-5xl font-black mb-2">{boxConfig.valueNum}</div>
            <div className="text-sm opacity-90">{boxConfig.descriptionText}</div>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <boxConfig.IconRef className="w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>
        <div className="text-base font-semibold">{boxConfig.labelText}</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
    </div>
  );

  const renderNavigationButton = (buttonConfig: any, indexKey: number) => (
    <Button
      key={indexKey}
      onClick={() => routerNavigate(buttonConfig.routePath)}
      className="w-full h-16 text-lg font-bold justify-start gap-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 hover:border-slate-400 hover:scale-105 transition-all shadow-md"
      variant="outline"
    >
      <div className={`${buttonConfig.backgroundClass} p-3 rounded-xl text-white`}>
        <buttonConfig.IconRef className="w-6 h-6" />
      </div>
      {buttonConfig.textLabel}
    </Button>
  );

  const renderActivityRecord = (activityRecord: any) => (
    <div
      key={activityRecord.patientIdentifier}
      onClick={() => routerNavigate(`/case/${activityRecord.patientIdentifier}`)}
      className="p-4 rounded-xl border-2 bg-white dark:bg-slate-800 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-lg"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">{activityRecord.patientName}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            القسم: <span className="font-semibold">{activityRecord.departmentName}</span>
          </div>
        </div>
        <Badge className={activityRecord.isEmergencyCase ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>
          {activityRecord.admissionTypeLabel}
        </Badge>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-2">
        <Activity className="w-3 h-3" />
        {activityRecord.formattedTimestamp}
      </div>
    </div>
  );

  const renderAnnouncementCard = (announcement: any) => (
    <div
      key={announcement.id}
      className="p-5 rounded-xl border-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-lg transition-all"
    >
      <div className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-2 line-clamp-1">{announcement.title}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{announcement.content}</div>
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span className="font-semibold">{announcement.authorName}</span>
        <span>{new Date(announcement.createdAt).toLocaleDateString('ar-EG')}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black mb-2">لوحة التحكم المركزية</h1>
              <p className="text-lg opacity-90">
                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-left">
              <div className="text-sm opacity-80">المستخدم الحالي</div>
              <div className="text-2xl font-bold">{authenticatedDoctor?.name}</div>
              <Badge className="mt-2 bg-white/20 text-white border-white/30">
                {authenticatedDoctor?.role === 'head_of_department' ? 'رئيس القسم' : authenticatedDoctor?.role === 'surgeon' ? 'طبيب جراح' : 'مقيم'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsLoadingStatus ? (
            Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-40 rounded-2xl" />)
          ) : (
            metricsBoxConfiguration.map(renderMetricBox)
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <Card className="lg:col-span-2 rounded-2xl border-2 shadow-xl p-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-4">الوصول السريع</h2>
            <div className="space-y-3">
              {navigationButtonsConfiguration.map(renderNavigationButton)}
            </div>
          </Card>

          <Card className="lg:col-span-3 rounded-2xl border-2 shadow-xl p-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-4">سجل النشاطات</h2>
            <ScrollArea className="h-[400px]">
              {patientsLoadingStatus ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-24 rounded-xl" />)}
                </div>
              ) : processedActivityRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-slate-400">
                  <Briefcase className="w-16 h-16 mb-3 opacity-40" />
                  <p className="text-xl font-semibold">لا يوجد نشاط</p>
                </div>
              ) : (
                <div className="space-y-3 pr-3">
                  {processedActivityRecords.map(renderActivityRecord)}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        <Card className="rounded-2xl border-2 shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-pink-600" />
              آخر النشرات والإعلانات
            </h2>
            <Button variant="ghost" onClick={() => routerNavigate('/bulletin')} className="font-bold">المزيد ←</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcementsLoadingStatus ? (
              Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} className="h-32 rounded-xl" />)
            ) : (announcementRecords || []).slice(0, 3).map(renderAnnouncementCard) || (
              <div className="col-span-3 text-center py-12 text-slate-400">لا توجد نشرات حالياً</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
