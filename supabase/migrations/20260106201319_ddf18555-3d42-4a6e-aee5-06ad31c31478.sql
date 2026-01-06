-- Create status enum for demands
CREATE TYPE public.demand_status AS ENUM ('open', 'in_progress', 'completed');

-- Create demands table
CREATE TABLE public.demands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status demand_status NOT NULL DEFAULT 'open',
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create subtasks table
CREATE TABLE public.subtasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    demand_id UUID NOT NULL REFERENCES public.demands(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly_reports table for caching report data
CREATE TABLE public.monthly_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_created INTEGER NOT NULL DEFAULT 0,
    total_completed INTEGER NOT NULL DEFAULT 0,
    total_pending INTEGER NOT NULL DEFAULT 0,
    completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, year, month)
);

-- Enable Row Level Security
ALTER TABLE public.demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for demands
CREATE POLICY "Users can view their own demands" 
ON public.demands 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own demands" 
ON public.demands 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own demands" 
ON public.demands 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own demands" 
ON public.demands 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for subtasks (via demand ownership)
CREATE POLICY "Users can view subtasks of their demands" 
ON public.subtasks 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.demands 
    WHERE demands.id = subtasks.demand_id 
    AND demands.user_id = auth.uid()
));

CREATE POLICY "Users can create subtasks for their demands" 
ON public.subtasks 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.demands 
    WHERE demands.id = subtasks.demand_id 
    AND demands.user_id = auth.uid()
));

CREATE POLICY "Users can update subtasks of their demands" 
ON public.subtasks 
FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.demands 
    WHERE demands.id = subtasks.demand_id 
    AND demands.user_id = auth.uid()
));

CREATE POLICY "Users can delete subtasks of their demands" 
ON public.subtasks 
FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM public.demands 
    WHERE demands.id = subtasks.demand_id 
    AND demands.user_id = auth.uid()
));

-- RLS policies for monthly_reports
CREATE POLICY "Users can view their own reports" 
ON public.monthly_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.monthly_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.monthly_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_demands_updated_at
BEFORE UPDATE ON public.demands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at
BEFORE UPDATE ON public.subtasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_reports_updated_at
BEFORE UPDATE ON public.monthly_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();