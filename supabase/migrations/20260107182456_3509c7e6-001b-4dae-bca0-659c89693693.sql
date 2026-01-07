-- Create enum for demand priority
CREATE TYPE public.demand_priority AS ENUM ('low', 'medium', 'high');

-- Add priority column to demands table with default 'medium'
ALTER TABLE public.demands 
ADD COLUMN priority public.demand_priority NOT NULL DEFAULT 'medium';