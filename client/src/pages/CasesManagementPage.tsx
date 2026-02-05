import { useState, useMemo } from 'react';
import { useNavigate } from 'wouter';
import { useActiveCasesList, usePatientAdmission, useAuthenticatedSurgeon } from '@/lib/hospitalAPI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Filter, User, Phone, Calendar, MapPin, Stethoscope, AlertTriangle, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const hospitalDepartmentsConfig = [
  { identifier: 'general_surgery', displayName: 'الجراحة العامة' },
  { identifier: 'orthopedics', displayName: 'جراحة العظام' },
  { identifier: 'neurosurgery', displayName: 'جراحة المخ والأعصاب' },
  { identifier: 'cardiology', displayName: 'القلب والأوعية' },
  { identifier: 'pediatrics', displayName: 'طب الأطفال' },
  { identifier: 'emergency', displayName: 'الطوارئ' },
];

const createEmptyPatientForm = () => ({
  fullName: '', age: '', gender: 'male', idNumber: '', phone: '', address: '', emergencyContact: '',
  admissionType: 'emergency', diagnosis: '', operation: '', surgeon: '', department: 'general_surgery',
  bedNumber: '', notes: ''
});

const applySearchFilter = (patientsList: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return patientsList;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return patientsList.filter(patient =>
    patient.fullName?.toLowerCase().includes(lowerSearchTerm) ||
    patient.idNumber?.toLowerCase().includes(lowerSearchTerm) ||
    patient.diagnosis?.toLowerCase().includes(lowerSearchTerm)
  );
};

const applyDepartmentFilter = (patientsList: any[], departmentCode: string) => {
  if (departmentCode === 'all') return patientsList;
  return patientsList.filter(patient => patient.department === departmentCode);
};

const applyAdmissionTypeFilter = (patientsList: any[], admissionType: string) => {
  if (admissionType === 'all') return patientsList;
  return patientsList.filter(patient => patient.admissionType === admissionType);
};

const sortPatientsByDateDescending = (patientsList: any[]) => {
  return [...patientsList].sort((patientA, patientB) =>
    new Date(patientB.admissionDate).getTime() - new Date(patientA.admissionDate).getTime()
  );
};

export default function CasesManagementPage() {
  const routerNavigate = useNavigate();
  const { toast } = useToast();
  const { data: currentUserData } = useAuthenticatedSurgeon();
  const { data: allActivePatients, isLoading: patientsLoadingState, error: patientsLoadError } = useActiveCasesList();
  const patientAdmissionMutation = usePatientAdmission();

  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('all');
  const [selectedAdmissionTypeFilter, setSelectedAdmissionTypeFilter] = useState('all');
  const [isPatientDialogVisible, setIsPatientDialogVisible] = useState(false);
  const [patientFormState, setPatientFormState] = useState(createEmptyPatientForm());

  const filteredPatientsList = useMemo(() => {
    if (!allActivePatients) return [];
    
    let processingList = [...allActivePatients];
    processingList = applySearchFilter(processingList, searchInputValue);
    processingList = applyDepartmentFilter(processingList, selectedDepartmentFilter);
    processingList = applyAdmissionTypeFilter(processingList, selectedAdmissionTypeFilter);
    processingList = sortPatientsByDateDescending(processingList);
    
    return processingList;
  }, [allActivePatients, searchInputValue, selectedDepartmentFilter, selectedAdmissionTypeFilter]);

  const updateFormField = (fieldKey: string, fieldValue: string) => {
    setPatientFormState(previousState => ({ ...previousState, [fieldKey]: fieldValue }));
  };

  const handlePatientFormSubmission = async () => {
    if (!patientFormState.fullName || !patientFormState.age || !patientFormState.diagnosis) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    try {
      await patientAdmissionMutation.mutateAsync({
        ...patientFormState,
        age: parseInt(patientFormState.age),
        createdBy: currentUserData?.id
      });
      
      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة المريض إلى النظام'
      });
      
      setIsPatientDialogVisible(false);
      setPatientFormState(createEmptyPatientForm());
    } catch (errorObject: any) {
      toast({
        title: 'فشلت العملية',
        description: errorObject.message || 'حدث خطأ أثناء إضافة المريض',
        variant: 'destructive'
      });
    }
  };

  if (patientsLoadError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" dir="rtl">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>فشل تحميل قائمة المرضى. يرجى المحاولة مرة أخرى.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderPatientFormFields = () => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <Label htmlFor="fullName">الاسم الكامل *</Label>
        <Input
          id="fullName"
          value={patientFormState.fullName}
          onChange={(e) => updateFormField('fullName', e.target.value)}
          placeholder="أدخل الاسم الكامل"
        />
      </div>
      <div>
        <Label htmlFor="age">العمر *</Label>
        <Input
          id="age"
          type="number"
          value={patientFormState.age}
          onChange={(e) => updateFormField('age', e.target.value)}
          placeholder="السنوات"
        />
      </div>
      <div>
        <Label htmlFor="gender">الجنس</Label>
        <Select value={patientFormState.gender} onValueChange={(val) => updateFormField('gender', val)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">ذكر</SelectItem>
            <SelectItem value="female">أنثى</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="idNumber">رقم الهوية</Label>
        <Input
          id="idNumber"
          value={patientFormState.idNumber}
          onChange={(e) => updateFormField('idNumber', e.target.value)}
          placeholder="رقم الهوية الوطنية"
        />
      </div>
      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          id="phone"
          value={patientFormState.phone}
          onChange={(e) => updateFormField('phone', e.target.value)}
          placeholder="رقم التواصل"
        />
      </div>
      <div>
        <Label htmlFor="emergencyContact">جهة الاتصال الطارئة</Label>
        <Input
          id="emergencyContact"
          value={patientFormState.emergencyContact}
          onChange={(e) => updateFormField('emergencyContact', e.target.value)}
          placeholder="رقم الطوارئ"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="address">العنوان</Label>
        <Input
          id="address"
          value={patientFormState.address}
          onChange={(e) => updateFormField('address', e.target.value)}
          placeholder="عنوان السكن"
        />
      </div>
      <div>
        <Label htmlFor="admissionType">نوع الدخول</Label>
        <Select value={patientFormState.admissionType} onValueChange={(val) => updateFormField('admissionType', val)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="emergency">طوارئ</SelectItem>
            <SelectItem value="operation">عملية جراحية</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="department">القسم</Label>
        <Select value={patientFormState.department} onValueChange={(val) => updateFormField('department', val)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {hospitalDepartmentsConfig.map(dept => (
              <SelectItem key={dept.identifier} value={dept.identifier}>{dept.displayName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2">
        <Label htmlFor="diagnosis">التشخيص *</Label>
        <Textarea
          id="diagnosis"
          value={patientFormState.diagnosis}
          onChange={(e) => updateFormField('diagnosis', e.target.value)}
          placeholder="التشخيص الطبي"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="operation">اسم العملية</Label>
        <Input
          id="operation"
          value={patientFormState.operation}
          onChange={(e) => updateFormField('operation', e.target.value)}
          placeholder="نوع العملية"
        />
      </div>
      <div>
        <Label htmlFor="surgeon">الطبيب الجراح</Label>
        <Input
          id="surgeon"
          value={patientFormState.surgeon}
          onChange={(e) => updateFormField('surgeon', e.target.value)}
          placeholder="اسم الجراح"
        />
      </div>
      <div>
        <Label htmlFor="bedNumber">رقم السرير</Label>
        <Input
          id="bedNumber"
          value={patientFormState.bedNumber}
          onChange={(e) => updateFormField('bedNumber', e.target.value)}
          placeholder="رقم السرير"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          value={patientFormState.notes}
          onChange={(e) => updateFormField('notes', e.target.value)}
          placeholder="ملاحظات إضافية"
          rows={3}
        />
      </div>
    </div>
  );

  const renderPatientCard = (patientRecord: any) => (
    <Card
      key={patientRecord.id}
      className="rounded-2xl border-2 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer p-6"
      onClick={() => routerNavigate(`/case/${patientRecord.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2">{patientRecord.fullName}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="font-semibold">{patientRecord.age} سنة</Badge>
              <Badge variant="outline" className="font-semibold">
                {patientRecord.gender === 'male' ? 'ذكر' : 'أنثى'}
              </Badge>
              <Badge className={patientRecord.admissionType === 'emergency' ? 'bg-red-500' : 'bg-blue-500'}>
                {patientRecord.admissionType === 'emergency' ? 'طوارئ' : 'عملية'}
              </Badge>
            </div>
          </div>
        </div>
        <ChevronLeft className="w-6 h-6 text-slate-400" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Stethoscope className="w-4 h-4" />
          <span className="font-semibold">
            {hospitalDepartmentsConfig.find(d => d.identifier === patientRecord.department)?.displayName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(patientRecord.admissionDate).toLocaleDateString('ar-EG')}</span>
        </div>
        {patientRecord.phone && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Phone className="w-4 h-4" />
            <span dir="ltr">{patientRecord.phone}</span>
          </div>
        )}
        {patientRecord.bedNumber && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>سرير {patientRecord.bedNumber}</span>
          </div>
        )}
      </div>
      <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          التشخيص: <span className="font-normal">{patientRecord.diagnosis}</span>
        </p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-2">إدارة الحالات النشطة</h1>
            <p className="text-slate-600 dark:text-slate-400">
              إجمالي الحالات: <span className="font-bold text-indigo-600">{filteredPatientsList.length}</span>
            </p>
          </div>
          
          <Dialog open={isPatientDialogVisible} onOpenChange={setIsPatientDialogVisible}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold gap-2 shadow-xl"
              >
                <Plus className="w-5 h-5" />
                تسجيل مريض جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">إضافة مريض جديد</DialogTitle>
              </DialogHeader>
              {renderPatientFormFields()}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handlePatientFormSubmission}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={patientAdmissionMutation.isPending}
                >
                  {patientAdmissionMutation.isPending ? 'جاري الحفظ...' : 'حفظ المريض'}
                </Button>
                <Button variant="outline" onClick={() => setIsPatientDialogVisible(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="rounded-2xl border-2 shadow-lg p-6">
          <h2 className="flex items-center gap-2 text-xl font-black mb-4">
            <Filter className="w-5 h-5" />
            البحث والتصفية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="بحث بالاسم، رقم الهوية، أو التشخيص..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
              <SelectTrigger><SelectValue placeholder="جميع الأقسام" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {hospitalDepartmentsConfig.map(dept => (
                  <SelectItem key={dept.identifier} value={dept.identifier}>{dept.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedAdmissionTypeFilter} onValueChange={setSelectedAdmissionTypeFilter}>
              <SelectTrigger><SelectValue placeholder="جميع أنواع الدخول" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="emergency">طوارئ</SelectItem>
                <SelectItem value="operation">عملية جراحية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {patientsLoadingState ? (
            Array.from({ length: 5 }).map((_, idx) => <Skeleton key={idx} className="h-40 rounded-2xl" />)
          ) : filteredPatientsList.length === 0 ? (
            <Card className="rounded-2xl border-2 p-16 flex flex-col items-center justify-center text-slate-400">
              <User className="w-20 h-20 mb-4 opacity-30" />
              <p className="text-xl font-semibold">لا توجد حالات مطابقة</p>
            </Card>
          ) : (
            filteredPatientsList.map(renderPatientCard)
          )}
        </div>
      </div>
    </div>
  );
}
