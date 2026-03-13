# Post it in Kabum

Um sistema de gestão de demandas, inspirado na simplicidade dos Post-its e na eficiência do Kanban. Focado em organização visual, priorização clara e acompanhamento de desempenho com relatórios mensais automáticos.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Stacks Utilizadas

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

---

## Visão Geral

Post it in Kabum é uma aplicação web projetada para maximizar a produtividade e a clareza visual. Ela permite:

* Organizar demandas em um quadro Kanban visual.
* Trabalhar com cards estilo Post-it.
* Dividir tarefas complexas em subtópicos com checklist.
* Acompanhar o progresso em tempo real.
* Medir a evolução através de relatórios mensais automáticos.

Tudo isso em uma UI limpa, Bonita com Dark/Light mode desenvolvido pensando no conforto do usuário.

---

## Principais Funcionalidades

### Kanban Visual
* **Colunas fixas e intuitivas:** Aberta, Em Andamento e Concluída.
* **Drag & Drop:** Movimentação fluida de cards entre as colunas.
* **Status Dinâmico:** Atualização automática conforme a movimentação.

### Detalhes e Checklists
* **Subtópicos:** Quebre demandas maiores em tarefas menores.
* **Visualização Rápida:** Checklist visível diretamente no card sem necessidade de abrir detalhes.
* **Cálculo de Progresso:** Porcentagem é atualizada automaticamente ao marcar itens.

### Prioridades Visuais
Identificação rápida através de cores suaves:
* **Alta:** Vermelho suave
* **Média:** Amarelo Post-it
* **Baixa:** Verde pastel

### Dashboard
* Barra de progresso visual.
* Contador de subtópicos como concluídos/total.
* Indicador de tempo em aberto.

### Relatórios Automáticos
Geração de insights sem esforço manual:
* Volume de demandas criadas vs. concluídas por mês.
* Taxa de conversão (Percentual de conclusão).
* Comparativo de desempenho mês a mês.
* Cálculo automático de melhoria em porcentagem.

---

## Como Executar o Projeto

### Pré-requisitos
* Node.js (versão 18 ou superior)
* npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/JoaoBarreto13/postkabum.git

2. **Acesse o diretório**
   ```
   cd postkabum
   ```
5. **Instale as dependências**
   ```
   npm install
   ```
6. **Configure as Variáveis de Ambiente Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Supabase**
   ```
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
   ```

7. **Inicie o servidor de desenvolvimento**
   ```
   npm run dev
   ```
   O projeto estará rodando em http://localhost:5173.

## Objetivo do Projeto

**Clareza:** Visual limpo e objetivo para evitar ruído cognitivo.

**Automação:** Métricas geradas automaticamente (zero planilhas manuais).

**Evolução:** Foco na melhoria contínua do fluxo de trabalho do usuário.

**UX/UI:** Uma experiência de uso simples, suave e elegante.

## Licença
Este projeto está licenciado sob a licença MIT.

<p align="center"> Desenvolvido com amor por <a href="https://github.com/JoaoBarreto13">João Barreto</a> </p>
