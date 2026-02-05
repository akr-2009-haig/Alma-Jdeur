import { useState } from 'react';
import {
  useAnnouncementsList,
  useAnnouncementPublishing,
  useAnnouncementModification,
  useAnnouncementRemoval,
  useDiscussionsList,
  useDiscussionPosting,
  useAuthenticatedSurgeon
} from '@/lib/hospitalAPI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Plus, Edit, Trash2, Send, ChevronDown, AlertTriangle, User, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formatPostTimestamp = (timestamp: string) => {
  const dateObj = new Date(timestamp);
  return `${dateObj.toLocaleDateString('ar-EG')} - ${dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
};

const createEmptyAnnouncementForm = () => ({ title: '', content: '' });

export default function BulletinBoardPage() {
  const { toast } = useToast();
  const { data: currentUserInfo } = useAuthenticatedSurgeon();
  const { data: announcementsList, isLoading: announcementsLoadFlag, error: announcementsError } = useAnnouncementsList();
  
  const publishAnnouncementMutation = useAnnouncementPublishing();
  const modifyAnnouncementMutation = useAnnouncementModification();
  const removeAnnouncementMutation = useAnnouncementRemoval();
  const postDiscussionMutation = useDiscussionPosting();

  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [announcementFormData, setAnnouncementFormData] = useState(createEmptyAnnouncementForm());
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<number | null>(null);
  const [commentInputTexts, setCommentInputTexts] = useState<{ [key: number]: string }>({});

  const { data: expandedAnnouncementComments } = useDiscussionsList(expandedAnnouncementId);

  const canUserModifyAnnouncement = (announcementAuthorId: number) => {
    return currentUserInfo?.id === announcementAuthorId || currentUserInfo?.role === 'head_of_department';
  };

  const handleAnnouncementCreation = async () => {
    if (!announcementFormData.title.trim() || !announcementFormData.content.trim()) {
      toast({ title: 'خطأ', description: 'يرجى ملء جميع الحقول', variant: 'destructive' });
      return;
    }

    try {
      await publishAnnouncementMutation.mutateAsync({
        title: announcementFormData.title,
        content: announcementFormData.content,
        authorId: currentUserInfo?.id,
        authorName: currentUserInfo?.name
      });
      toast({ title: 'تم النشر', description: 'تم نشر الإعلان بنجاح' });
      setIsCreateDialogVisible(false);
      setAnnouncementFormData(createEmptyAnnouncementForm());
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const handleAnnouncementUpdate = async () => {
    if (!editingAnnouncementId || !announcementFormData.title.trim() || !announcementFormData.content.trim()) {
      toast({ title: 'خطأ', description: 'يرجى ملء جميع الحقول', variant: 'destructive' });
      return;
    }

    try {
      await modifyAnnouncementMutation.mutateAsync({
        id: editingAnnouncementId,
        updates: {
          title: announcementFormData.title,
          content: announcementFormData.content
        }
      });
      toast({ title: 'تم التحديث', description: 'تم تحديث الإعلان بنجاح' });
      setIsEditDialogVisible(false);
      setAnnouncementFormData(createEmptyAnnouncementForm());
      setEditingAnnouncementId(null);
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const handleAnnouncementDeletion = async (announcementId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      await removeAnnouncementMutation.mutateAsync(announcementId);
      toast({ title: 'تم الحذف', description: 'تم حذف الإعلان بنجاح' });
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const handleCommentSubmission = async (newsId: number) => {
    const commentText = commentInputTexts[newsId];
    if (!commentText?.trim()) {
      toast({ title: 'خطأ', description: 'يرجى كتابة تعليق', variant: 'destructive' });
      return;
    }

    try {
      await postDiscussionMutation.mutateAsync({
        newsId,
        content: commentText,
        authorId: currentUserInfo?.id,
        authorName: currentUserInfo?.name
      });
      toast({ title: 'تم النشر', description: 'تم نشر التعليق بنجاح' });
      setCommentInputTexts(prev => ({ ...prev, [newsId]: '' }));
    } catch (error: any) {
      toast({ title: 'فشلت العملية', description: error.message, variant: 'destructive' });
    }
  };

  const openEditDialog = (announcement: any) => {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementFormData({ title: announcement.title, content: announcement.content });
    setIsEditDialogVisible(true);
  };

  if (announcementsError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" dir="rtl">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>فشل تحميل النشرات. يرجى المحاولة مرة أخرى.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderAnnouncementCard = (announcement: any) => {
    const isExpanded = expandedAnnouncementId === announcement.id;
    const commentsForAnnouncement = isExpanded ? expandedAnnouncementComments : [];

    return (
      <Card key={announcement.id} className="rounded-2xl border-2 shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2">{announcement.title}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">{announcement.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatPostTimestamp(announcement.createdAt)}</span>
                </div>
              </div>
            </div>
            {canUserModifyAnnouncement(announcement.authorId) && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(announcement)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleAnnouncementDeletion(announcement.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{announcement.content}</p>
          </div>

          <Collapsible
            open={isExpanded}
            onOpenChange={() => setExpandedAnnouncementId(isExpanded ? null : announcement.id)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                التعليقات
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                {/* Comment Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="اكتب تعليقك..."
                    value={commentInputTexts[announcement.id] || ''}
                    onChange={(e) =>
                      setCommentInputTexts(prev => ({ ...prev, [announcement.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmission(announcement.id);
                      }
                    }}
                  />
                  <Button onClick={() => handleCommentSubmission(announcement.id)} className="gap-2">
                    <Send className="w-4 h-4" />
                    إرسال
                  </Button>
                </div>

                {/* Comments List */}
                <ScrollArea className="max-h-96">
                  <div className="space-y-3">
                    {(commentsForAnnouncement || []).length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-40" />
                        <p>لا توجد تعليقات بعد</p>
                      </div>
                    ) : (
                      (commentsForAnnouncement || []).map((comment: any) => (
                        <div
                          key={comment.id}
                          className="p-4 rounded-xl bg-white dark:bg-slate-800 border-2"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-900 dark:text-slate-50">{comment.authorName}</span>
                            <span className="text-xs text-slate-500">{formatPostTimestamp(comment.createdAt)}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-pink-600" />
              لوحة النشرات والإعلانات
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              آخر التحديثات والأخبار من فريق المستشفى
            </p>
          </div>
          
          <Dialog open={isCreateDialogVisible} onOpenChange={setIsCreateDialogVisible}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold gap-2 shadow-xl">
                <Plus className="w-5 h-5" />
                إعلان جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">نشر إعلان جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>عنوان الإعلان</Label>
                  <Input
                    value={announcementFormData.title}
                    onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="عنوان واضح ومختصر"
                  />
                </div>
                <div>
                  <Label>محتوى الإعلان</Label>
                  <Textarea
                    value={announcementFormData.content}
                    onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="اكتب محتوى الإعلان..."
                    rows={8}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleAnnouncementCreation}
                  className="flex-1 bg-pink-600"
                  disabled={publishAnnouncementMutation.isPending}
                >
                  {publishAnnouncementMutation.isPending ? 'جاري النشر...' : 'نشر الإعلان'}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogVisible(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogVisible} onOpenChange={setIsEditDialogVisible}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">تعديل الإعلان</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>عنوان الإعلان</Label>
                <Input
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان واضح ومختصر"
                />
              </div>
              <div>
                <Label>محتوى الإعلان</Label>
                <Textarea
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="اكتب محتوى الإعلان..."
                  rows={8}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleAnnouncementUpdate}
                className="flex-1 bg-pink-600"
                disabled={modifyAnnouncementMutation.isPending}
              >
                {modifyAnnouncementMutation.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogVisible(false)} className="flex-1">
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcementsLoadFlag ? (
            Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} className="h-64 rounded-2xl" />)
          ) : (announcementsList || []).length === 0 ? (
            <Card className="rounded-2xl border-2 p-16 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-20 h-20 mb-4 opacity-30" />
              <p className="text-xl font-semibold">لا توجد نشرات حالياً</p>
            </Card>
          ) : (
            (announcementsList || []).map(renderAnnouncementCard)
          )}
        </div>
      </div>
    </div>
  );
}
