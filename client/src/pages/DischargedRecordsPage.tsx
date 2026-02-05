import { useState, useMemo } from 'react';
import { useArchivedCasesList } from '@/lib/hospitalAPI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Filter, Archive, AlertTriangle, User, Stethoscope, CalendarDays } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const departmentNameMappings = {
  general_surgery: 'الجراحة العامة',
  orthopedics: 'جراحة العظام',
  neurosurgery: 'جراحة المخ والأعصاب',
  cardiology: 'القلب والأوعية',
  pediatrics: 'طب الأطفال',
  emergency: 'الطوارئ',
};

const dischargeReasonMappings = {
  improved: 'تحسن الحالة',
  by_request: 'بناءً على طلب المريض',
  escaped: 'هروب',
  died: 'وفاة',
};

const calculateStatistics = (archiveList: any[]) => {
  const totalCount = archiveList.length;
  const improvedCount = archiveList.filter(r => r.dischargeReason === 'improved').length;
  const byRequestCount = archiveList.filter(r => r.dischargeReason === 'by_request').length;
  const escapedCount = archiveList.filter(r => r.dischargeReason === 'escaped').length;
  const diedCount = archiveList.filter(r => r.dischargeReason === 'died').length;
  
  return { totalCount, improvedCount, byRequestCount, escapedCount, diedCount };
};

const filterBySearchTerm = (recordsList: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return recordsList;
  const lowerTerm = searchTerm.toLowerCase();
  return recordsList.filter(record =>
    record.fullName?.toLowerCase().includes(lowerTerm) ||
    record.diagnosis?.toLowerCase().includes(lowerTerm)
  );
};

const filterByDischargeReason = (recordsList: any[], reasonCode: string) => {
  if (reasonCode === 'all') return recordsList;
  return recordsList.filter(record => record.dischargeReason === reasonCode);
};

const filterByDateRange = (recordsList: any[], startDate: string, endDate: string) => {
  if (!startDate && !endDate) return recordsList;
  
  return recordsList.filter(record => {
    const dischargeDate = new Date(record.dischargeDate);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-12-31');
    return dischargeDate >= start && dischargeDate <= end;
  });
};

export default function DischargedRecordsPage() {
  const { data: archivedRecords, isLoading: archiveLoadingState, error: archiveLoadError } = useArchivedCasesList();

  const [searchQueryValue, setSearchQueryValue] = useState('');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState('all');
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');

  const processedAndFilteredRecords = useMemo(() => {
    if (!archivedRecords) return [];
    
    let workingList = [...archivedRecords];
    workingList = filterBySearchTerm(workingList, searchQueryValue);
    workingList = filterByDischargeReason(workingList, selectedReasonFilter);
    workingList = filterByDateRange(workingList, startDateValue, endDateValue);
    
    workingList.sort((a, b) => new Date(b.dischargeDate).getTime() - new Date(a.dischargeDate).getTime());
    
    return workingList;
  }, [archivedRecords, searchQueryValue, selectedReasonFilter, startDateValue, endDateValue]);

  const statisticsData = useMemo(() => {
    return calculateStatistics(processedAndFilteredRecords);
  }, [processedAndFilteredRecords]);

  if (archiveLoadError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" dir="rtl">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>فشل تحميل السجلات المؤرشفة. يرجى المحاولة مرة أخرى.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderStatisticsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-5 rounded-xl border-2 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="text-4xl font-black text-blue-600 mb-1">{statisticsData.totalCount}</div>
        <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">إجمالي الحالات</div>
      </Card>
      <Card className="p-5 rounded-xl border-2 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <div className="text-4xl font-black text-green-600 mb-1">{statisticsData.improvedCount}</div>
        <div className="text-sm font-semibold text-green-800 dark:text-green-200">حالات التحسن</div>
      </Card>
      <Card className="p-5 rounded-xl border-2 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
        <div className="text-4xl font-black text-amber-600 mb-1">{statisticsData.byRequestCount}</div>
        <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">بناءً على الطلب</div>
      </Card>
      <Card className="p-5 rounded-xl border-2 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
        <div className="text-4xl font-black text-orange-600 mb-1">{statisticsData.escapedCount}</div>
        <div className="text-sm font-semibold text-orange-800 dark:text-orange-200">حالات الهروب</div>
      </Card>
      <Card className="p-5 rounded-xl border-2 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800">
        <div className="text-4xl font-black text-red-600 mb-1">{statisticsData.diedCount}</div>
        <div className="text-sm font-semibold text-red-800 dark:text-red-200">حالات الوفاة</div>
      </Card>
    </div>
  );

  const renderArchivedRecordCard = (archiveRecord: any) => {
    const getReasonBadgeColor = () => {
      switch (archiveRecord.dischargeReason) {
        case 'improved': return 'bg-green-500';
        case 'by_request': return 'bg-amber-500';
        case 'escaped': return 'bg-orange-500';
        case 'died': return 'bg-red-500';
        default: return 'bg-slate-500';
      }
    };

    return (
      <Card key={archiveRecord.id} className="rounded-2xl border-2 p-6 hover:shadow-xl transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-slate-400 to-slate-600 p-4 rounded-xl text-white">
              <Archive className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2">{archiveRecord.fullName}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="font-semibold">{archiveRecord.age} سنة</Badge>
                <Badge variant="outline" className="font-semibold">
                  {archiveRecord.gender === 'male' ? 'ذكر' : 'أنثى'}
                </Badge>
                <Badge className={`${getReasonBadgeColor()} text-white`}>
                  {dischargeReasonMappings[archiveRecord.dischargeReason as keyof typeof dischargeReasonMappings]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Stethoscope className="w-4 h-4" />
            <span className="font-semibold">{archiveRecord.surgeon || 'غير محدد'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CalendarIcon className="w-4 h-4" />
            <span>دخول: {new Date(archiveRecord.admissionDate).toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CalendarDays className="w-4 h-4" />
            <span>خروج: {new Date(archiveRecord.dischargeDate).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              التشخيص: <span className="font-normal">{archiveRecord.diagnosis}</span>
            </p>
          </div>
          {archiveRecord.operation && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                العملية: <span className="font-normal">{archiveRecord.operation}</span>
              </p>
            </div>
          )}
          {archiveRecord.notes && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                ملاحظات: <span className="font-normal">{archiveRecord.notes}</span>
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-3">
            <Archive className="w-8 h-8 text-slate-600" />
            السجلات المؤرشفة
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            عرض وإدارة الحالات المؤرشفة والمخرجة من المستشفى
          </p>
        </div>

        {renderStatisticsCards()}

        <Card className="rounded-2xl border-2 shadow-lg p-6">
          <h2 className="flex items-center gap-2 text-xl font-black mb-4">
            <Filter className="w-5 h-5" />
            البحث والتصفية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="بحث بالاسم أو التشخيص..."
                value={searchQueryValue}
                onChange={(e) => setSearchQueryValue(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedReasonFilter} onValueChange={setSelectedReasonFilter}>
                <SelectTrigger><SelectValue placeholder="سبب الخروج" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسباب</SelectItem>
                  <SelectItem value="improved">تحسن الحالة</SelectItem>
                  <SelectItem value="by_request">بناءً على الطلب</SelectItem>
                  <SelectItem value="escaped">هروب</SelectItem>
                  <SelectItem value="died">وفاة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={startDateValue}
                onChange={(e) => setStartDateValue(e.target.value)}
                placeholder="من تاريخ"
              />
            </div>
            <div>
              <Input
                type="date"
                value={endDateValue}
                onChange={(e) => setEndDateValue(e.target.value)}
                placeholder="إلى تاريخ"
              />
            </div>
          </div>
          {(searchQueryValue || selectedReasonFilter !== 'all' || startDateValue || endDateValue) && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQueryValue('');
                  setSelectedReasonFilter('all');
                  setStartDateValue('');
                  setEndDateValue('');
                }}
              >
                إعادة تعيين الفلاتر
              </Button>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {archiveLoadingState ? (
            Array.from({ length: 5 }).map((_, idx) => <Skeleton key={idx} className="h-48 rounded-2xl" />)
          ) : processedAndFilteredRecords.length === 0 ? (
            <Card className="rounded-2xl border-2 p-16 flex flex-col items-center justify-center text-slate-400">
              <User className="w-20 h-20 mb-4 opacity-30" />
              <p className="text-xl font-semibold">لا توجد سجلات مطابقة</p>
            </Card>
          ) : (
            processedAndFilteredRecords.map(renderArchivedRecordCard)
          )}
        </div>
      </div>
    </div>
  );
}
