import { useMutation } from "@tanstack/react-query";
import { api, type InsertRegistration } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateRegistration() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await fetch(api.registrations.create.path, {
        method: api.registrations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit registration");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم استلام طلبكم بنجاح", // Request received successfully
        description: "سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.", // Our team will review and contact you
        variant: "default",
        className: "bg-green-600 text-white border-none",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في الإرسال", // Error sending
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
