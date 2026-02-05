import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import {
  usePatientDetails,
  usePatientNotesList,
  usePatientDocumentsList,
  useMedicalNoteCreation,
  useMedicalDocumentUpload,
  usePatientModification,
  usePatientDischarge,
  useAuthenticatedSurgeon
} from '@/lib/hospitalAPI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  User, Calendar, Phone, MapPin, FileText, Upload, Edit, Archive,
  Stethoscope, Clock, MessageSquare, Image as ImageIcon, AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const departmentTranslations = {
  general_surgery: 'الجراحة العامة',
  orthopedics: 'جراحة العظام',
  neurosurgery: 'جراحة المخ والأعصاب',
  cardiology: 'القلب والأوعية',
  pediatrics: 'طب الأطفال',
  emergency: 'الطوارئ',
};

const dischargeReasonOptions = [
  { code: 'improved', label: 'تحسن الحالة' },
  { code: 'by_request', label: 'بناءً على طلب المريض' },
  { code: 'escaped', label: 'هروب' },
  { code: 'died', label: 'وفاة' },
];

const formatTimestampToArabic = (timestamp: string) => {
  const dateObj = new Date(timestamp);
  return `${dateObj.toLocaleDateString('ar-EG')} - ${dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function CaseProfilePage() {
  const { id } = useParams();
  const patientIdentifier = parseInt(id as string);
  const [, navigateRouter] = useLocation();
  const { toast } = useToast();
  const { data: authenticatedUser } = useAuthenticatedSurgeon();

  const { data: patientDetailsData, isLoading: patientLoadingFlag, error: patientLoadError } = usePatientDetails(patientIdentifier);
  const { data: medicalNotesList, isLoading: notesLoadingFlag } = usePatientNotesList(patientIdentifier);
  const { data: medicalDocumentsList, isLoading: documentsLoadingFlag } = usePatientDocumentsList(patientIdentifier);

  const noteCreationMutation = useMedicalNoteCreation();
  const documentUploadMutation = useMedicalDocumentUpload();
  const patientModificationMutation = usePatientModification();
  const patientDischargeMutation = usePatientDischarge();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isDischargeDialogOpen, setIsDischargeDialogOpen] = useState(false);

  const [noteInputText, setNoteInputText] = useState('');
  const [documentFormData, setDocumentFormData] = useState({ fileName: '', fileUrl: '', fileType: 'image', description: '' });
  const [dischargeFormData, setDischargeFormData] = useState({ dischargeReason: 'improved', notes: '' });
  const [editFormData, setEditFormData] = useState({
    diagnosis: '', operation: '', surgeon: '', bedNumber: '', notes: ''
  });

  const handleNoteSubmission = async () => {
    if (!noteInputText.trim()) {
      toast({ title: 'خطأ', description: 'يرجى كتابة الملاحظة', variant: 'destructive' });
      return;
    }

    try {
      await noteCreationMutation.mutateAsync({
        patientId: patientIdentifier,
        note: noteInputText,
        createdBy: authenticatedUser?.id,
        createdByName: authenticatedUser?.name
      });
      toast({ title: 'تم الحفظ', description: 'تمت إضافة المتابعة الطبية بنجاح' });
      setIsNoteDialogOpen(false);
      setNoteInputText('');
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const handleDocumentSubmission = async () => {
    if (!documentFormData.fileName || !documentFormData.fileUrl) {
      toast({ title: 'خطأ', description: 'يرجى إدخال بيانات الملف', variant: 'destructive' });
      return;
    }

    try {
      await documentUploadMutation.mutateAsync({
        patientId: patientIdentifier,
        ...documentFormData,
        uploadedBy: authenticatedUser?.id
      });
      toast({ title: 'تم الرفع', description: 'تم رفع المستند بنجاح' });
      setIsDocumentDialogOpen(false);
      setDocumentFormData({ fileName: '', fileUrl: '', fileType: 'image', description: '' });
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const handlePatientUpdate = async () => {
    try {
      await patientModificationMutation.mutateAsync({
        patientId: patientIdentifier,
        updates: editFormData
      });
      toast({ title: 'تم التحديث', description: 'تم تحديث بيانات المريض بنجاح' });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const handlePatientDischarge = async () => {
    try {
      await patientDischargeMutation.mutateAsync({
        patientId: patientIdentifier,
        dischargeInfo: {
          fullName: patientDetailsData?.fullName,
          age: patientDetailsData?.age,
          gender: patientDetailsData?.gender,
          diagnosis: patientDetailsData?.diagnosis,
          operation: patientDetailsData?.operation,
          surgeon: patientDetailsData?.surgeon,
          admissionDate: patientDetailsData?.admissionDate,
          ...dischargeFormData,
          dischargedBy: authenticatedUser?.id
        }
      });
      toast({ title: 'تم الخروج', description: 'تم تسجيل خروج المريض بنجاح' });
      setIsDischargeDialogOpen(false);
      navigateRouter('/discharged');
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  if (patientLoadError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" dir="rtl">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>فشل تحميل بيانات المريض. يرجى المحاولة مرة أخرى.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (patientLoadingFlag) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const renderPatientInfoSection = () => (
    <Card className="rounded-2xl border-2 shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-3">
              {patientDetailsData?.fullName}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-base font-semibold px-3 py-1">
                {patientDetailsData?.age} سنة
              </Badge>
              <Badge variant="outline" className="text-base font-semibold px-3 py-1">
                {patientDetailsData?.gender === 'male' ? 'ذكر' : 'أنثى'}
              </Badge>
              <Badge className={`text-base px-3 py-1 ${patientDetailsData?.admissionType === 'emergency' ? 'bg-red-500' : 'bg-blue-500'}`}>
                {patientDetailsData?.admissionType === 'emergency' ? 'طوارئ' : 'عملية جراحية'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" onClick={() => {
                setEditFormData({
                  diagnosis: patientDetailsData?.diagnosis || '',
                  operation: patientDetailsData?.operation || '',
                  surgeon: patientDetailsData?.surgeon || '',
                  bedNumber: patientDetailsData?.bedNumber || '',
                  notes: patientDetailsData?.notes || ''
                });
              }}>
                <Edit className="w-4 h-4" />
                تعديل
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">تعديل بيانات المريض</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>التشخيص</Label>
                  <Textarea value={editFormData.diagnosis} onChange={(e) => setEditFormData(prev => ({ ...prev, diagnosis: e.target.value }))} rows={3} />
                </div>
                <div>
                  <Label>العملية</Label>
                  <Input value={editFormData.operation} onChange={(e) => setEditFormData(prev => ({ ...prev, operation: e.target.value }))} />
                </div>
                <div>
                  <Label>الجراح</Label>
                  <Input value={editFormData.surgeon} onChange={(e) => setEditFormData(prev => ({ ...prev, surgeon: e.target.value }))} />
                </div>
                <div>
                  <Label>رقم السرير</Label>
                  <Input value={editFormData.bedNumber} onChange={(e) => setEditFormData(prev => ({ ...prev, bedNumber: e.target.value }))} />
                </div>
                <div>
                  <Label>ملاحظات</Label>
                  <Textarea value={editFormData.notes} onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))} rows={3} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handlePatientUpdate} className="flex-1 bg-indigo-600" disabled={patientModificationMutation.isPending}>
                  {patientModificationMutation.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">إلغاء</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDischargeDialogOpen} onOpenChange={setIsDischargeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Archive className="w-4 h-4" />
                إخراج المريض
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">تسجيل خروج المريض</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>سبب الخروج</Label>
                  <Select value={dischargeFormData.dischargeReason} onValueChange={(v) => setDischargeFormData(prev => ({ ...prev, dischargeReason: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {dischargeReasonOptions.map(opt => (
                        <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ملاحظات الخروج</Label>
                  <Textarea value={dischargeFormData.notes} onChange={(e) => setDischargeFormData(prev => ({ ...prev, notes: e.target.value }))} rows={4} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handlePatientDischarge} variant="destructive" className="flex-1" disabled={patientDischargeMutation.isPending}>
                  {patientDischargeMutation.isPending ? 'جاري الإخراج...' : 'تأكيد الإخراج'}
                </Button>
                <Button variant="outline" onClick={() => setIsDischargeDialogOpen(false)} className="flex-1">إلغاء</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400">القسم</div>
            <div className="font-bold text-slate-900 dark:text-slate-50">
              {departmentTranslations[patientDetailsData?.department as keyof typeof departmentTranslations]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400">تاريخ الدخول</div>
            <div className="font-bold text-slate-900 dark:text-slate-50">
              {new Date(patientDetailsData?.admissionDate).toLocaleDateString('ar-EG')}
            </div>
          </div>
        </div>
        {patientDetailsData?.phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">رقم الهاتف</div>
              <div className="font-bold text-slate-900 dark:text-slate-50" dir="ltr">{patientDetailsData.phone}</div>
            </div>
          </div>
        )}
        {patientDetailsData?.bedNumber && (
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">رقم السرير</div>
              <div className="font-bold text-slate-900 dark:text-slate-50">{patientDetailsData.bedNumber}</div>
            </div>
          </div>
        )}
        {patientDetailsData?.idNumber && (
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">رقم الهوية</div>
              <div className="font-bold text-slate-900 dark:text-slate-50">{patientDetailsData.idNumber}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <div className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-2">التشخيص</div>
          <div className="text-slate-700 dark:text-slate-300">{patientDetailsData?.diagnosis}</div>
        </div>
        {patientDetailsData?.operation && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-2">العملية الجراحية</div>
            <div className="text-slate-700 dark:text-slate-300">{patientDetailsData.operation}</div>
          </div>
        )}
        {patientDetailsData?.surgeon && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
            <div className="font-bold text-lg text-green-900 dark:text-green-100 mb-2">الطبيب الجراح</div>
            <div className="text-slate-700 dark:text-slate-300">{patientDetailsData.surgeon}</div>
          </div>
        )}
      </div>
    </Card>
  );

  const renderNotesSection = () => (
    <Card className="rounded-2xl border-2 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          المتابعات الطبية
        </h2>
        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 gap-2">
              <FileText className="w-4 h-4" />
              إضافة متابعة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">إضافة متابعة طبية جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>الملاحظة الطبية</Label>
                <Textarea value={noteInputText} onChange={(e) => setNoteInputText(e.target.value)} rows={6} placeholder="اكتب الملاحظة الطبية..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleNoteSubmission} className="flex-1 bg-indigo-600" disabled={noteCreationMutation.isPending}>
                {noteCreationMutation.isPending ? 'جاري الحفظ...' : 'حفظ المتابعة'}
              </Button>
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)} className="flex-1">إلغاء</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[500px]">
        {notesLoadingFlag ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-32 rounded-xl" />)}
          </div>
        ) : (medicalNotesList || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-slate-400">
            <MessageSquare className="w-16 h-16 mb-3 opacity-40" />
            <p className="text-xl font-semibold">لا توجد متابعات طبية</p>
          </div>
        ) : (
          <div className="space-y-4 pr-3">
            {(medicalNotesList || []).map((note: any) => (
              <div key={note.id} className="p-5 rounded-xl border-2 bg-white dark:bg-slate-800 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-bold text-lg text-slate-900 dark:text-slate-50">{note.createdByName}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {formatTimestampToArabic(note.createdAt)}
                  </div>
                </div>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.note}</div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );

  const renderDocumentsSection = () => (
    <Card className="rounded-2xl border-2 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-purple-600" />
          المستندات الطبية
        </h2>
        <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 gap-2">
              <Upload className="w-4 h-4" />
              رفع مستند
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">رفع مستند طبي جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اسم الملف</Label>
                <Input value={documentFormData.fileName} onChange={(e) => setDocumentFormData(prev => ({ ...prev, fileName: e.target.value }))} placeholder="اسم الملف" />
              </div>
              <div>
                <Label>رابط الملف (URL)</Label>
                <Input value={documentFormData.fileUrl} onChange={(e) => setDocumentFormData(prev => ({ ...prev, fileUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <Label>نوع الملف</Label>
                <Select value={documentFormData.fileType} onValueChange={(v) => setDocumentFormData(prev => ({ ...prev, fileType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">صورة</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>وصف المستند</Label>
                <Textarea value={documentFormData.description} onChange={(e) => setDocumentFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleDocumentSubmission} className="flex-1 bg-purple-600" disabled={documentUploadMutation.isPending}>
                {documentUploadMutation.isPending ? 'جاري الرفع...' : 'رفع المستند'}
              </Button>
              <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)} className="flex-1">إلغاء</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[500px]">
        {documentsLoadingFlag ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-48 rounded-xl" />)}
          </div>
        ) : (medicalDocumentsList || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-slate-400">
            <ImageIcon className="w-16 h-16 mb-3 opacity-40" />
            <p className="text-xl font-semibold">لا توجد مستندات</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-3">
            {(medicalDocumentsList || []).map((doc: any) => (
              <div key={doc.id} className="p-4 rounded-xl border-2 bg-white dark:bg-slate-800 hover:shadow-lg transition-all">
                <div className="mb-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-8 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-purple-600" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-1 truncate">{doc.fileName}</div>
                {doc.description && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{doc.description}</div>
                )}
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                  عرض المستند
                </a>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigateRouter('/cases')} className="mb-4">
          ← العودة للحالات
        </Button>

        {renderPatientInfoSection()}

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">المتابعات الطبية</TabsTrigger>
            <TabsTrigger value="documents">المستندات</TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="mt-6">
            {renderNotesSection()}
          </TabsContent>
          <TabsContent value="documents" className="mt-6">
            {renderDocumentsSection()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
