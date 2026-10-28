# Plano de Implementação: Contraste & Refinamento Visual do Portal e Kanban

## 1. Visão Geral e Objetivos
Aprimorar o contraste, legibilidade e elegância visual do **Portal do Cliente** (`ClientPortal.tsx`), do **Painel Administrativo** (`AdminPanel.tsx`) e do **Quadro Kanban** (`TaskKanban.tsx`), sem alterar conteúdos ou regras de negócio existentes.

A reformulação atende às três diretrizes selecionadas pelo cliente:
1. **Modo Noturno (Dark):** Base em grafite escuro e preto profundo (`#090a0f`), cartões em `#12141a` com bordas definidas (`border-white/12`) e tipografia primária em branco puro (`#ffffff`), eliminando qualquer sensação de texto apagado.
2. **Modo Claro (Light):** Base limpa com cartões em branco puro (`#ffffff`), divisórias nítidas e sólidas (`border-slate-300`) e textos em preto profundo (`#0f172a`), garantindo contraste rigoroso sob luz natural.
3. **Kanban Didático:** Cartões de tarefas com **linhas laterais marcadas (`border-l-4`)** indicando visualmente o status imediato (A Fazer, Em Andamento, Em Revisão, Concluído) e identificadores claros de responsável (UpSell vs. Cliente).

---

## 2. Arquitetura de Cores & Contrastes

| Elemento | Modo Noturno (Dark) | Modo Claro (Light) |
| :--- | :--- | :--- |
| **Fundo da Página** | `#090a0f` (preto mineral puro) | `#f8fafc` (ardósia neutro claro) |
| **Superfície dos Cards** | `#12141a` (grafite escuro estruturado) | `#ffffff` (branco puro) |
| **Bordas dos Cards** | `border-white/12` (divisórias nítidas) | `border-slate-300` (divisórias marcadas) |
| **Superfície Secundária** | `#181b24` (sub-cards e tabelas) | `#f1f5f9` (cinza sutil de fundo) |
| **Texto Primário** | `#ffffff` (branco puro 100%) | `#0f172a` (preto ardósia profundo) |
| **Texto Secundário** | `#94a3b8` (cinza claro legível) | `#475569` (cinza escuro nítido) |
| **Acentos / Destaques** | `#c8a97e` (ouro velho) / `#10b981` (verde) | `#9d7644` / `#059669` |

---

## 3. Linhas Laterais e Status no Kanban (`TaskKanban.tsx`)

Cada cartão de tarefa receberá uma borda lateral sólida de 4px (`border-l-4`) conforme o status:
* **A Fazer / Backlog:** Linha lateral cinza ardósia (`border-l-slate-400 dark:border-l-slate-500`)
* **Em Andamento:** Linha lateral âmbar nítida (`border-l-amber-500`)
* **Em Revisão / Validação:** Linha lateral azul celeste (`border-l-sky-500`)
* **Concluído:** Linha lateral verde esmeralda (`border-l-emerald-500`)

Além da borda lateral, os cartões terão tipografia contrastada para o título da tarefa, prazo e etiquetas de responsável:
* **UpSell:** Badge sóbrio com texto em alto contraste (`UpSell · Mídia`)
* **Cliente:** Badge contrastante para validações pendentes (`Você · Aprovação`)

---

## 4. Etapas de Modificação nos Arquivos

### Fase 1: `components/TaskKanban.tsx`
* Atualizar o objeto `COLUMNS` para incluir a classe de borda lateral `border-l-4` e a nova paleta de alto contraste.
* Refatorar os cartões de tarefas nos modos Grid e Lista para aplicar a borda lateral marcada.
* Aumentar o contraste de todos os textos (títulos em `#0f172a` / `#ffffff`, detalhes em `#475569` / `#94a3b8`).
* Garantir que as barras de busca, filtros de responsável e cabeçalhos de coluna tenham leitura nítida.

### Fase 2: `components/ClientPortal.tsx`
* Refatorar as classes de base `cardBg` e `innerBg` para refletir a nova paleta.
* Atualizar a barra superior com contraste acentuado entre o logo UPSELL e o seletor de cliente.
* Atualizar os 4 blocos de métricas financeiras e operacionais com números em branco puro no modo noturno e preto profundo no modo claro.
* Elevar o contraste das seções de Pastas de Criativos, Documentação do Contrato e Histórico de Otimizações.

### Fase 3: `components/AdminPanel.tsx`
* Refatorar a barra lateral e a área de navegação administrativa com cartões em alto contraste.
* Ajustar os formulários de edição de métricas, links e prazos para campos com fundos contrastantes e bordas visíveis ao foco.
* Alinhar a exibição do Kanban interno do administrador com as mesmas bordas laterais marcadas.

---

## 5. Validação & Verificação
* Executar `lint_applet` para garantir zero erros de TypeScript e ESLint.
* Executar `compile_applet` (`npm run build`) para assegurar compilação completa.
* Testar alternância entre Modo Noturno e Modo Claro tanto no Portal quanto no Admin.
