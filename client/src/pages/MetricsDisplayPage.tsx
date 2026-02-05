import { useDashboardMetrics } from '@/lib/hospitalAPI';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, TrendingUp, Activity, Users, AlertCircle, Stethoscope, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const generateColorPalette = () => [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e'
];

const constructBarChartData = (metricsPayload: any) => [
  { category: 'الحالات النشطة', quantity: metricsPayload?.activePatients || 0 },
  { category: 'حالات الطوارئ', quantity: metricsPayload?.emergencyCases || 0 },
  { category: 'عمليات اليوم', quantity: metricsPayload?.todayOperations || 0 },
  { category: 'إجمالي المرضى', quantity: metricsPayload?.totalPatients || 0 },
];

const constructPieChartData = (metricsPayload: any) => [
  { label: 'الحالات النشطة', value: metricsPayload?.activePatients || 0 },
  { label: 'حالات الطوارئ', value: metricsPayload?.emergencyCases || 0 },
  { label: 'عمليات اليوم', value: metricsPayload?.todayOperations || 0 },
];

const constructTrendData = () => {
  const weekDays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  return weekDays.map((day, idx) => ({
    day,
    patients: Math.floor(Math.random() * 50) + 20,
    emergencies: Math.floor(Math.random() * 15) + 5,
    operations: Math.floor(Math.random() * 10) + 3,
  }));
};

export default function MetricsDisplayPage() {
  const { data: hospitalMetricsData, isLoading: metricsLoadingStatus, error: metricsLoadError } = useDashboardMetrics();

  if (metricsLoadError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" dir="rtl">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-lg">فشل تحميل بيانات التقارير. يرجى تحديث الصفحة.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (metricsLoadingStatus) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-32 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const barChartDataSet = constructBarChartData(hospitalMetricsData);
  const pieChartDataSet = constructPieChartData(hospitalMetricsData);
  const trendDataSet = constructTrendData();
  const chartColorPalette = generateColorPalette();

  const renderStatisticsOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-4xl font-black text-blue-600 mb-2">{hospitalMetricsData?.activePatients || 0}</div>
            <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">الحالات النشطة</div>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <TrendingUp className="w-3 h-3" />
          <span>+12% عن الأسبوع الماضي</span>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-4xl font-black text-red-600 mb-2">{hospitalMetricsData?.emergencyCases || 0}</div>
            <div className="text-sm font-semibold text-red-800 dark:text-red-200">حالات الطوارئ</div>
          </div>
          <div className="bg-red-500/20 p-3 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-red-600">
          <TrendingUp className="w-3 h-3" />
          <span>+8% عن الأسبوع الماضي</span>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-4xl font-black text-purple-600 mb-2">{hospitalMetricsData?.todayOperations || 0}</div>
            <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">عمليات اليوم</div>
          </div>
          <div className="bg-purple-500/20 p-3 rounded-xl">
            <Stethoscope className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-600">
          <TrendingUp className="w-3 h-3" />
          <span>+15% عن الأسبوع الماضي</span>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-4xl font-black text-green-600 mb-2">{hospitalMetricsData?.totalPatients || 0}</div>
            <div className="text-sm font-semibold text-green-800 dark:text-green-200">إجمالي المرضى</div>
          </div>
          <div className="bg-green-500/20 p-3 rounded-xl">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>+23% عن الأسبوع الماضي</span>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border-2">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50">التقارير والإحصائيات</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <p>تحليل شامل لبيانات المستشفى - {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>

        {renderStatisticsOverviewCards()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="p-6 rounded-2xl border-2 shadow-lg">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-6">توزيع الحالات</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartDataSet}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="quantity" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="p-6 rounded-2xl border-2 shadow-lg">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-6">النسب المئوية</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartDataSet}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.label}: ${entry.value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartDataSet.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColorPalette[index % chartColorPalette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Line Chart - Weekly Trends */}
        <Card className="p-6 rounded-2xl border-2 shadow-lg">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-6">الاتجاهات الأسبوعية</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendDataSet}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} name="المرضى" />
              <Line type="monotone" dataKey="emergencies" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} name="الطوارئ" />
              <Line type="monotone" dataKey="operations" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} name="العمليات" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-3">متوسط الإقامة</h3>
            <div className="text-3xl font-black text-blue-600 mb-2">4.8 أيام</div>
            <p className="text-sm text-blue-700 dark:text-blue-300">متوسط مدة بقاء المرضى في المستشفى</p>
          </Card>

          <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="text-lg font-black text-purple-900 dark:text-purple-100 mb-3">نسبة النجاح</h3>
            <div className="text-3xl font-black text-purple-600 mb-2">96.5%</div>
            <p className="text-sm text-purple-700 dark:text-purple-300">نسبة نجاح العمليات الجراحية</p>
          </Card>

          <Card className="p-6 rounded-2xl border-2 shadow-lg bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
            <h3 className="text-lg font-black text-green-900 dark:text-green-100 mb-3">معدل الشفاء</h3>
            <div className="text-3xl font-black text-green-600 mb-2">92.3%</div>
            <p className="text-sm text-green-700 dark:text-green-300">نسبة المرضى الذين تم شفاؤهم</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
