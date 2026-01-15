-- Add length constraints on demands table using validation triggers
-- Using triggers instead of CHECK constraints for flexibility

-- Add length constraints on title (1-500 chars), description (max 5000 chars), category (max 100 chars)
CREATE OR REPLACE FUNCTION public.validate_demand_inputs()
RETURNS TRIGGER AS $$
BEGIN
  -- Title validation: required, 1-500 characters
  IF NEW.title IS NULL OR length(trim(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  IF length(NEW.title) > 500 THEN
    RAISE EXCEPTION 'Title must be 500 characters or less';
  END IF;
  
  -- Description validation: max 5000 characters
  IF NEW.description IS NOT NULL AND length(NEW.description) > 5000 THEN
    RAISE EXCEPTION 'Description must be 5000 characters or less';
  END IF;
  
  -- Category validation: max 100 characters
  IF NEW.category IS NOT NULL AND length(NEW.category) > 100 THEN
    RAISE EXCEPTION 'Category must be 100 characters or less';
  END IF;
  
  -- Trim whitespace from text fields
  NEW.title := trim(NEW.title);
  IF NEW.description IS NOT NULL THEN
    NEW.description := trim(NEW.description);
  END IF;
  IF NEW.category IS NOT NULL THEN
    NEW.category := trim(NEW.category);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for demand validation
DROP TRIGGER IF EXISTS validate_demand_inputs_trigger ON public.demands;
CREATE TRIGGER validate_demand_inputs_trigger
  BEFORE INSERT OR UPDATE ON public.demands
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_demand_inputs();

-- Add length constraint on subtasks description using validation trigger
CREATE OR REPLACE FUNCTION public.validate_subtask_inputs()
RETURNS TRIGGER AS $$
BEGIN
  -- Description validation: required, 1-1000 characters
  IF NEW.description IS NULL OR length(trim(NEW.description)) = 0 THEN
    RAISE EXCEPTION 'Subtask description is required';
  END IF;
  IF length(NEW.description) > 1000 THEN
    RAISE EXCEPTION 'Subtask description must be 1000 characters or less';
  END IF;
  
  -- Trim whitespace
  NEW.description := trim(NEW.description);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for subtask validation
DROP TRIGGER IF EXISTS validate_subtask_inputs_trigger ON public.subtasks;
CREATE TRIGGER validate_subtask_inputs_trigger
  BEFORE INSERT OR UPDATE ON public.subtasks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_subtask_inputs();