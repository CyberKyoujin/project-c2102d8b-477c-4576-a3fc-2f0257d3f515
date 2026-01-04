import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StepIndicator } from "@/components/nurse-application/StepIndicator";
import { Step1Questionnaire } from "@/components/nurse-application/Step1Questionnaire";
import { Step2Documents } from "@/components/nurse-application/Step2Documents";
import { Step3Test } from "@/components/nurse-application/Step3Test";
import { Step4Interview } from "@/components/nurse-application/Step4Interview";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type NurseSpecialization = Database["public"]["Enums"]["nurse_specialization"];

export interface ApplicationData {
  id?: string;
  full_name: string;
  phone: string;
  phone_verified: boolean;
  email: string;
  city: string;
  districts: string[];
  has_transport: boolean;
  experience_years: number;
  specializations: NurseSpecialization[];
  night_shifts_available: boolean;
  diploma_url?: string;
  medical_book_url?: string;
  passport_url?: string;
  photo_url?: string;
  documents_submitted_at?: string;
  current_step: number;
  status: string;
  test_score?: number;
  test_passed?: boolean;
  interview_scheduled_at?: string;
}

const NurseApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    full_name: "",
    phone: "",
    phone_verified: false,
    email: "",
    city: "",
    districts: [],
    has_transport: false,
    experience_years: 0,
    specializations: [],
    night_shifts_available: false,
    current_step: 1,
    status: "new",
  });

  useEffect(() => {
    checkAuthAndLoadApplication();
  }, []);

  const checkAuthAndLoadApplication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Потрібна авторизація",
          description: "Будь ласка, увійдіть або зареєструйтесь",
          variant: "destructive",
        });
        navigate("/auth?redirect=/nurse-application");
        return;
      }

      setUser(session.user);

      // Check for existing application
      const { data: existingApp, error } = await supabase
        .from("nurse_applications")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading application:", error);
      }

      if (existingApp) {
        setApplicationData({
          id: existingApp.id,
          full_name: existingApp.full_name,
          phone: existingApp.phone,
          phone_verified: existingApp.phone_verified || false,
          email: existingApp.email,
          city: existingApp.city,
          districts: existingApp.districts || [],
          has_transport: existingApp.has_transport || false,
          experience_years: existingApp.experience_years || 0,
          specializations: existingApp.specializations || [],
          night_shifts_available: existingApp.night_shifts_available || false,
          diploma_url: existingApp.diploma_url,
          medical_book_url: existingApp.medical_book_url,
          passport_url: existingApp.passport_url,
          photo_url: existingApp.photo_url,
          current_step: existingApp.current_step || 1,
          status: existingApp.status || "new",
          test_score: existingApp.test_score,
          test_passed: existingApp.test_passed,
          interview_scheduled_at: existingApp.interview_scheduled_at,
        });
        setCurrentStep(existingApp.current_step || 1);
      } else {
        // Pre-fill email from auth
        setApplicationData(prev => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async (stepData: Partial<ApplicationData>, nextStep: number) => {
    const updatedData = { ...applicationData, ...stepData, current_step: nextStep };
    setApplicationData(updatedData);

    // Prepare data for Supabase (cast specializations to proper type)
    const supabaseData: Record<string, any> = { ...stepData };
    if (supabaseData.specializations) {
      supabaseData.specializations = supabaseData.specializations as NurseSpecialization[];
    }

    try {
      if (applicationData.id) {
        // Update existing application
        const { error } = await supabase
          .from("nurse_applications")
          .update({
            ...supabaseData,
            current_step: nextStep,
          })
          .eq("id", applicationData.id);

        if (error) throw error;
      } else {
        // Create new application
        const insertData = {
          user_id: user.id,
          full_name: updatedData.full_name,
          phone: updatedData.phone,
          email: updatedData.email,
          city: updatedData.city,
          districts: updatedData.districts,
          has_transport: updatedData.has_transport,
          experience_years: updatedData.experience_years,
          specializations: updatedData.specializations as NurseSpecialization[],
          night_shifts_available: updatedData.night_shifts_available,
          current_step: nextStep,
        };
        
        const { data, error } = await supabase
          .from("nurse_applications")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        setApplicationData(prev => ({ ...prev, id: data.id }));
      }

      setCurrentStep(nextStep);
      
      toast({
        title: "Збережено",
        description: "Ваші дані успішно збережено",
      });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти дані",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Станьте частиною команди Сестра24
            </h1>
            <p className="text-muted-foreground">
              Заповніть форму, щоб приєднатися до нашої команди професійних медсестер
            </p>
          </div>

          <StepIndicator currentStep={currentStep} applicationStatus={applicationData.status} />

          <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mt-8">
            {currentStep === 1 && (
              <Step1Questionnaire
                data={applicationData}
                onComplete={(data) => handleStepComplete(data, 2)}
              />
            )}

            {currentStep === 2 && (
              <Step2Documents
                data={applicationData}
                userId={user?.id}
                onComplete={(data) => handleStepComplete(data, 3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <Step3Test
                applicationId={applicationData.id!}
                onComplete={(data) => handleStepComplete(data, 4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <Step4Interview
                data={applicationData}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NurseApplication;
