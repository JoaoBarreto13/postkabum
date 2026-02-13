-- Adiciona restrições de tamanho na tabela demands usando triggers de validação
-- Utilizando triggers ao invés de CHECK constraints para maior flexibilidade

-- Adiciona restrições de tamanho em:
-- title (1 a 500 caracteres),
-- description (máximo 5000 caracteres),
-- category (máximo 100 caracteres)
CREATE OR REPLACE FUNCTION public.validate_demand_inputs()
RETURNS TRIGGER AS $$
BEGIN
  -- Validação do título: obrigatório, entre 1 e 500 caracteres
  IF NEW.title IS NULL OR length(trim(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  IF length(NEW.title) > 500 THEN
    RAISE EXCEPTION 'Title must be 500 characters or less';
  END IF;
  
  -- Validação da descrição: máximo de 5000 caracteres
  IF NEW.description IS NOT NULL AND length(NEW.description) > 5000 THEN
    RAISE EXCEPTION 'Description must be 5000 characters or less';
  END IF;
  
  -- Validação da categoria: máximo de 100 caracteres
  IF NEW.category IS NOT NULL AND length(NEW.category) > 100 THEN
    RAISE EXCEPTION 'Category must be 100 characters or less';
  END IF;
  
  -- Remove espaços em branco no início e fim dos campos de texto
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

-- Cria trigger para validar dados da tabela demands
DROP TRIGGER IF EXISTS validate_demand_inputs_trigger ON public.demands;
CREATE TRIGGER validate_demand_inputs_trigger
  BEFORE INSERT OR UPDATE ON public.demands
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_demand_inputs();

-- Adiciona restrição de tamanho na descrição da tabela subtasks usando trigger de validação
CREATE OR REPLACE FUNCTION public.validate_subtask_inputs()
RETURNS TRIGGER AS $$
BEGIN
  -- Validação da descrição: obrigatória, entre 1 e 1000 caracteres
  IF NEW.description IS NULL OR length(trim(NEW.description)) = 0 THEN
    RAISE EXCEPTION 'Subtask description is required';
  END IF;
  IF length(NEW.description) > 1000 THEN
    RAISE EXCEPTION 'Subtask description must be 1000 characters or less';
  END IF;
  
  -- Remove espaços em branco no início e fim
  NEW.description := trim(NEW.description);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Cria trigger para validar dados da tabela subtasks
DROP TRIGGER IF EXISTS validate_subtask_inputs_trigger ON public.subtasks;
CREATE TRIGGER validate_subtask_inputs_trigger
  BEFORE INSERT OR UPDATE ON public.subtasks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_subtask_inputs();