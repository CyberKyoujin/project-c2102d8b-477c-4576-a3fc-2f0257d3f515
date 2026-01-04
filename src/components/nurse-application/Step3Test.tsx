import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Step3Props {
  applicationId: string;
  onComplete: (data: { test_score: number; test_passed: boolean }) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  is_case_study: boolean;
  order_index: number;
}

const PASSING_SCORE = 70;
const TEST_TIME_MINUTES = 10;

export const Step3Test = ({ applicationId, onComplete, onBack }: Step3Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TEST_TIME_MINUTES * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeRemaining]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("nurse_test_questions")
        .select("*")
        .order("order_index");

      if (error) throw error;

      const formattedQuestions = data.map(q => ({
        ...q,
        options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      }));

      setQuestions(formattedQuestions);
    } catch (error: any) {
      console.error("Error loading questions:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити питання тесту",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    setTestStarted(true);
    
    // Mark test as started in database
    await supabase
      .from("nurse_applications")
      .update({ test_started_at: new Date().toISOString() })
      .eq("id", applicationId);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Calculate score
      let correctCount = 0;
      const answersToSave = questions.map(q => {
        const selectedAnswer = answers[q.id] || "";
        const isCorrect = selectedAnswer === q.correct_answer;
        if (isCorrect) correctCount++;
        return {
          application_id: applicationId,
          question_id: q.id,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
        };
      });

      // Save answers
      const { error: answersError } = await supabase
        .from("nurse_test_answers")
        .insert(answersToSave);

      if (answersError) throw answersError;

      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= PASSING_SCORE;

      setResult({ score, passed });
      setTestCompleted(true);

      // Update application
      await supabase
        .from("nurse_applications")
        .update({
          test_completed_at: new Date().toISOString(),
          test_score: score,
          test_passed: passed,
          status: passed ? "test_passed" : "rejected",
        })
        .eq("id", applicationId);

      if (passed) {
        toast({
          title: "Вітаємо! 🎉",
          description: `Ви успішно пройшли тест з результатом ${score}%`,
        });
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти результати тесту",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (testCompleted && result) {
    return (
      <div className="text-center py-8">
        <div className={cn(
          "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6",
          result.passed ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
        )}>
          {result.passed ? (
            <CheckCircle className="w-10 h-10" />
          ) : (
            <AlertCircle className="w-10 h-10" />
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          {result.passed ? "Вітаємо! Тест пройдено!" : "На жаль, тест не пройдено"}
        </h2>
        <p className="text-muted-foreground mb-4">
          Ваш результат: <span className="font-bold text-foreground">{result.score}%</span>
          <br />
          Прохідний бал: {PASSING_SCORE}%
        </p>

        {result.passed ? (
          <Button variant="hero" onClick={() => onComplete({ test_score: result.score, test_passed: true })}>
            Перейти до інтерв'ю
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Ви можете спробувати ще раз через 24 години.
          </p>
        )}
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Кваліфікаційний тест</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Тест містить {questions.length} питань, включаючи один практичний кейс. 
          На виконання дається {TEST_TIME_MINUTES} хвилин. Прохідний бал — {PASSING_SCORE}%.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Button variant="hero" onClick={startTest}>
            Розпочати тест
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">
            Питання {currentQuestionIndex + 1} з {questions.length}
          </span>
          <Progress value={progress} className="mt-2 w-32" />
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          timeRemaining < 60 ? "bg-destructive/20 text-destructive" : "bg-muted"
        )}>
          <Clock className="w-4 h-4" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        {currentQuestion.is_case_study && (
          <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded mb-3">
            Практичний кейс
          </span>
        )}
        <h3 className="text-lg font-medium mb-6">{currentQuestion.question_text}</h3>

        <RadioGroup
          value={answers[currentQuestion.id] || ""}
          onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                answers[currentQuestion.id] === option
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value={option} id={`option-${idx}`} />
              <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Попереднє
        </Button>

        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            variant="hero"
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            disabled={!answers[currentQuestion.id]}
          >
            Наступне
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            variant="hero"
            onClick={handleSubmitTest}
            disabled={Object.keys(answers).length < questions.length || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Перевірка...
              </>
            ) : (
              "Завершити тест"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
