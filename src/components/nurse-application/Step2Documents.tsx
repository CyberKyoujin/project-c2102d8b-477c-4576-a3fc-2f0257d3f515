import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApplicationData } from "@/pages/NurseApplication";
import { ArrowLeft, ArrowRight, Upload, Check, Loader2, FileText, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Step2Props {
  data: ApplicationData;
  userId: string;
  onComplete: (data: Partial<ApplicationData>) => void;
  onBack: () => void;
}

interface DocumentUpload {
  id: string;
  label: string;
  field: keyof Pick<ApplicationData, "diploma_url" | "medical_book_url" | "passport_url" | "photo_url">;
  description: string;
}

const documents: DocumentUpload[] = [
  { id: "diploma", label: "Диплом медсестри", field: "diploma_url", description: "PDF або JPG, до 10MB" },
  { id: "medical_book", label: "Медична книжка", field: "medical_book_url", description: "PDF або JPG, до 10MB" },
  { id: "passport", label: "Паспорт", field: "passport_url", description: "PDF або JPG, до 10MB" },
  { id: "photo", label: "Ваше фото", field: "photo_url", description: "JPG, до 10MB" },
];

export const Step2Documents = ({ data, userId, onComplete, onBack }: Step2Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({
    diploma_url: data.diploma_url || "",
    medical_book_url: data.medical_book_url || "",
    passport_url: data.passport_url || "",
    photo_url: data.photo_url || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (doc: DocumentUpload, file: File) => {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Файл занадто великий",
        description: "Максимальний розмір файлу — 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Невірний формат",
        description: "Дозволені формати: PDF, JPG, PNG",
        variant: "destructive",
      });
      return;
    }

    setUploading(doc.id);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${doc.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("nurse-documents")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("nurse-documents")
        .getPublicUrl(fileName);

      setUploadedDocs(prev => ({
        ...prev,
        [doc.field]: fileName,
      }));

      toast({
        title: "Завантажено",
        description: `${doc.label} успішно завантажено`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Помилка завантаження",
        description: error.message || "Спробуйте ще раз",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveFile = async (doc: DocumentUpload) => {
    const filePath = uploadedDocs[doc.field];
    if (!filePath) return;

    try {
      await supabase.storage.from("nurse-documents").remove([filePath]);
      setUploadedDocs(prev => ({
        ...prev,
        [doc.field]: "",
      }));
      toast({
        title: "Видалено",
        description: `${doc.label} видалено`,
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const allDocsUploaded = documents.every(doc => uploadedDocs[doc.field]);

  const handleSubmit = async () => {
    if (!allDocsUploaded) {
      toast({
        title: "Завантажте всі документи",
        description: "Необхідно завантажити всі документи для продовження",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    onComplete({
      diploma_url: uploadedDocs.diploma_url,
      medical_book_url: uploadedDocs.medical_book_url,
      passport_url: uploadedDocs.passport_url,
      photo_url: uploadedDocs.photo_url,
      documents_submitted_at: new Date().toISOString(),
    });
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Завантаження документів</h2>
        <p className="text-muted-foreground text-sm">
          Завантажте скани або фото необхідних документів. Підтримуються формати PDF, JPG, PNG до 10MB.
        </p>
      </div>

      <div className="grid gap-4">
        {documents.map(doc => (
          <div
            key={doc.id}
            className={cn(
              "border rounded-xl p-4 transition-all",
              uploadedDocs[doc.field]
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  uploadedDocs[doc.field] ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {uploadedDocs[doc.field] ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{doc.label}</p>
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {uploadedDocs[doc.field] ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(doc)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc, file);
                      }}
                      disabled={uploading === doc.id}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading === doc.id}
                      asChild
                    >
                      <span>
                        {uploading === doc.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Завантаження...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Завантажити
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button
          type="button"
          variant="hero"
          onClick={handleSubmit}
          disabled={!allDocsUploaded || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Збереження...
            </>
          ) : (
            <>
              Далі
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
