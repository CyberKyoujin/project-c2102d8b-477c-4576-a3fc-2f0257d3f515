import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyOTP = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    
    setIsLoading(true);
    // TODO: Implement OTP verification with Supabase
    console.log("Verifying code:", code);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/profile");
    }, 1500);
  };

  const handleResend = () => {
    // TODO: Implement resend OTP
    console.log("Resending code...");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              Сестра<span className="text-primary">24</span>
            </span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Підтвердження email
          </h1>
          <p className="text-muted-foreground mb-8">
            Введіть 6-значний код, який ми надіслали на вашу електронну пошту
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? "Перевірка..." : "Підтвердити"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground mb-2">
              Не отримали код?
            </p>
            <button
              type="button"
              className="text-primary font-medium hover:underline transition-colors"
              onClick={handleResend}
            >
              Надіслати повторно
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-md">
          <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8">
            <Heart className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Майже готово!
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Підтвердіть свою електронну пошту, щоб завершити реєстрацію та отримати доступ до всіх функцій.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
