-- Enum для статусу заявки
CREATE TYPE public.nurse_application_status AS ENUM (
  'new',
  'documents_verified', 
  'test_passed',
  'interview',
  'activated',
  'rejected'
);

-- Enum для спеціалізацій
CREATE TYPE public.nurse_specialization AS ENUM (
  'injections',
  'ivs',
  'wound_care',
  'elderly_care',
  'pediatric',
  'postoperative',
  'palliative',
  'rehabilitation'
);

-- Таблиця заявок медсестер
CREATE TABLE public.nurse_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Крок 1: Анкета
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  districts TEXT[] DEFAULT '{}',
  has_transport BOOLEAN DEFAULT false,
  experience_years INTEGER DEFAULT 0,
  specializations nurse_specialization[] DEFAULT '{}',
  night_shifts_available BOOLEAN DEFAULT false,
  
  -- Крок 2: Документи (URL до файлів)
  diploma_url TEXT,
  medical_book_url TEXT,
  passport_url TEXT,
  photo_url TEXT,
  documents_submitted_at TIMESTAMPTZ,
  
  -- Крок 3: Тест
  test_started_at TIMESTAMPTZ,
  test_completed_at TIMESTAMPTZ,
  test_score INTEGER,
  test_passed BOOLEAN,
  
  -- Крок 4: Інтерв'ю
  interview_scheduled_at TIMESTAMPTZ,
  interview_notes TEXT,
  
  -- Загальне
  status nurse_application_status DEFAULT 'new',
  current_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nurse_applications ENABLE ROW LEVEL SECURITY;

-- Політики для заявок
CREATE POLICY "Users can view own applications"
ON public.nurse_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
ON public.nurse_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
ON public.nurse_applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
ON public.nurse_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all applications"
ON public.nurse_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Тригер для updated_at
CREATE TRIGGER update_nurse_applications_updated_at
BEFORE UPDATE ON public.nurse_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Таблиця тестових питань
CREATE TABLE public.nurse_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  is_case_study BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nurse_test_questions ENABLE ROW LEVEL SECURITY;

-- Політики для питань
CREATE POLICY "Anyone can view test questions"
ON public.nurse_test_questions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage test questions"
ON public.nurse_test_questions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Таблиця відповідей на тест
CREATE TABLE public.nurse_test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.nurse_applications(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.nurse_test_questions(id) ON DELETE CASCADE NOT NULL,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(application_id, question_id)
);

-- Enable RLS
ALTER TABLE public.nurse_test_answers ENABLE ROW LEVEL SECURITY;

-- Політики для відповідей
CREATE POLICY "Users can view own test answers"
ON public.nurse_test_answers
FOR SELECT
TO authenticated
USING (
  application_id IN (
    SELECT id FROM public.nurse_applications WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can submit test answers"
ON public.nurse_test_answers
FOR INSERT
TO authenticated
WITH CHECK (
  application_id IN (
    SELECT id FROM public.nurse_applications WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all answers"
ON public.nurse_test_answers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket для документів
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nurse-documents',
  'nurse-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
);

-- Storage policies
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nurse-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'nurse-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'nurse-documents' 
  AND public.has_role(auth.uid(), 'admin')
);