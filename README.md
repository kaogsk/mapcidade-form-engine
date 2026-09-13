# mapcidade-form-engine

> Anonymized, from-scratch reconstruction of a real internal tool's architecture, built for a portfolio. Fictional data only — no real company, city, or client form is represented here.

## English

### Problem

A data-entry team constantly needs new intake forms (a new attribute, a new inspection checklist, a new registration type) but shouldn't need a new hand-built page and a new hand-built validator every time. Hard-coding each form's HTML and validation logic in application code makes every new form a code change and a deploy.

### Solution

A form is a JSON schema (id, title, an ordered list of typed fields with `required`/`options`). One renderer turns any schema into an HTML page; one validator checks any submission against the same schema (required fields, numeric fields, and select fields restricted to their declared options); one Express app wires schema + renderer + validator + a small SQLite-backed submission store together. Adding a new form is adding a new JSON file — no new route, no new template.

### Stack

TypeScript, Node.js (built-in `node:sqlite`), Express 5, `vitest`, `supertest`.

### How to run

```bash
npm install
npm run dev
# open http://localhost:3000/forms/urban_tree
```

Submit the form, then visit `/forms/urban_tree/entries` to see it stored.

### Demo

Screenshot/GIF of the form + entries list will be linked here.

### What I learned / engineering decisions

Keeping the schema, the renderer, and the validator as three separate pure functions (`loadFormSchema`, `renderFormPage`, `validateSubmission`) — none of which know about Express or SQLite — meant the whole rendering and validation logic could be tested without an HTTP server or a database at all; the Express layer (`app.ts`) only wires them together and is the one piece that needs `supertest` to exercise end to end.

Validation intentionally returns a structured result (`{valid, errors, data}`) instead of throwing, because "the form has 3 validation errors" is an expected, displayable outcome for this kind of app — not an exceptional one.

## Português

### Problema

Um time de entrada de dados precisa constantemente de formulários novos (um atributo novo, um checklist de vistoria novo, um tipo de cadastro novo), mas não devia precisar de uma página nova feita à mão e um validador novo feito à mão toda vez. Fixar o HTML e a validação de cada formulário no código da aplicação transforma todo formulário novo numa mudança de código e um deploy.

### Solução

Um formulário é um schema JSON (id, título, lista ordenada de campos tipados com `required`/`options`). Um renderizador transforma qualquer schema numa página HTML; um validador confere qualquer envio contra o mesmo schema (campos obrigatórios, campos numéricos, campos de seleção restritos às opções declaradas); um app Express liga schema + renderizador + validador + um pequeno armazenamento de envios em SQLite. Adicionar um formulário novo é adicionar um arquivo JSON novo — sem rota nova, sem template novo.

### Stack

TypeScript, Node.js (`node:sqlite` nativo), Express 5, `vitest`, `supertest`.

### Como rodar

```bash
npm install
npm run dev
# abrir http://localhost:3000/forms/urban_tree
```

Envie o formulário, depois visite `/forms/urban_tree/entries` pra ver o registro salvo.

### Demo

Screenshot/GIF do formulário + lista de entradas será linkado aqui.

### O que aprendi / decisões de engenharia

Manter o schema, o renderizador e o validador como três funções puras separadas (`loadFormSchema`, `renderFormPage`, `validateSubmission`) — nenhuma delas sabendo de Express ou SQLite — fez com que toda a lógica de renderização e validação pudesse ser testada sem servidor HTTP nem banco nenhum; a camada Express (`app.ts`) só liga elas e é a única peça que precisa de `supertest` pra testar ponta a ponta.

A validação retorna um resultado estruturado (`{valid, errors, data}`) em vez de lançar exceção de propósito, porque "o formulário tem 3 erros de validação" é um resultado esperado e exibível pra esse tipo de app — não uma exceção.

## License

MIT
