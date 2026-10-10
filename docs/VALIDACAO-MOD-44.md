# Validação — MOD-44

Data: 10/10/2026. Bun **1.4.2**. Implementação na branch `feat/shadcn-theme`, PR #4 para `main`.

## Critérios de aceite verificados

- Home institucional em `/`, com propósito, ação **Explorar a plataforma**, fontes oficiais e cobertura específica do modo ativo.
- `/app`, `/representantes`, perfis, `/propostas`, `/votacoes`, `/participe` e `/eleicoes` continuam públicos, com layout de consulta e URLs preservadas.
- `/meu-brasil` pede conta para salvar acompanhamentos e oferece continuar sem conta. Na demo, conta e persistência permanecem indisponíveis.

## Checks executados

| Check | Resultado |
| --- | --- |
| `bun install --frozen-lockfile` | Aprovado; lockfile sem alteração. |
| `bun run build` | Aprovado; 20 arquivos públicos inspecionados sem marcadores de servidor ou segredos configurados. |
| `bun run typecheck` | Aprovado; workspaces e raiz. |
| `bun run lint` | Aprovado; somente a sugestão preexistente de template string em `scripts/local-env.ts`. |
| `bun run test` | 9 testes passaram; 2 integrações opt-in ignoradas. |
| `bun run test:e2e` contra build, demo | 22 passaram em desktop/mobile; 2 testes de conta ignorados nesse modo. |
| `bun run test:e2e` contra build, integração local | 24 passaram em desktop/mobile, incluindo login, follow, reload, isolamento REST e logout. |
| `bun run db:check` | PostgreSQL 17.11, papel `civica_reader`, catálogo local com 513 registros. |
| `bun run check:boundaries` + build recomposto | Import de banco via workspace bloqueado como exigido; build final aprovado. |
| Revisão visual | Seção de fontes inspecionada em desktop/celular. Sem overflow em 320, 390, 768 e 1024 pixels. |

As suítes verificam SSR, metadados, layouts, acesso público, fonte/cobertura, navegação sem JavaScript, teclado, tema e contraste. Contas temporárias foram removidas pela suíte, que não grava traces autenticados. Não foi consultada uma API legislativa online.

O worktree não possuía `.env`: a primeira tentativa de `db:check` informou `DATABASE_READ_URL_REQUIRED`. O teste integrado reutilizou a configuração local do checkout original somente em memória, sem copiar ou imprimir credenciais. O servidor existente na porta 3000 foi preservado. Servidores temporários de produção usaram 3100 (demo) e 3101 (integração), com Origin correspondente, e foram encerrados após as suítes.

## Limites

A branch do PR #4 não incorpora o PR #1 de propostas. A home informa esse limite: propostas, votações, Senado, despesas e eleições ainda não estão integrados nesta entrega. Não houve mudança de banco, ingestão, autorização ou publicação remota. O PR permanece para revisão, sem merge automático.

## Evidências visuais

Capturas reais da demonstração, sem dados de contas:

![Fontes e cobertura em desktop](screenshots/mod-44/fontes-demo-desktop.jpg)

![Fontes e cobertura no celular](screenshots/mod-44/fontes-demo-mobile.jpg)
