# Revisão e integração do PR #5 — 20/10/2026

PR: https://github.com/apsr-dev/modo-cidadao/pull/5.
Base integrada: `cf48607` de `main`. Head original: `47b93f2`.

## Resultado da revisão

O conflito do README foi resolvido preservando o catálogo, as rotas e as
instruções atuais de `main`, junto ao comando `dev:real` do PR. O início
não depende mais de um caminho específico da máquina anterior. O README
explica que os dados importados anteriormente não acompanham um clone novo.

O responsável confirmou incluir Bun 1.4.3 neste PR. A exigência foi alinhada
em manifest, verificador, CI, Dockerfile e documentação, conforme
[ADR 006](decisions/006-bun-1-4-3.md). Não houve atualização da instalação
da máquina, das bibliotecas ou do lockfile em relação a `main`.

Revisados todos os arquivos do diff, a passagem de ambiente pelo Turborepo
e a precedência de `DEMO_MODE` no carregamento do Vite. `dev:real` apenas
define o modo integrado e reutiliza `dev`; não inicia banco nem coleta.
Não foram encontrados defeitos de código bloqueadores no diff final.

## Verificações locais

Ambiente: checkout isolado, Bun **1.4.3** (`c6da4a4d3`), PostgreSQL **17.11**.
O Supabase usou o projeto temporário `modo-cidadao-pr5-review`; a alteração
de configuração usada para isolar os contêineres não faz parte do PR.
O `.env` temporário tem permissão 0600 e permaneceu fora do Git.

| Verificação | Resultado |
| --- | --- |
| `bun install --frozen-lockfile` | Passou, incluindo a verificação da versão exata; `bun.lock` sem alteração em relação a `main`. |
| `bun run check:boundaries` | Passou; import de banco por pacote de UI bloqueou o build. Arquivos de prova removidos. |
| `bun run build` | Passou após o teste negativo; 25 arquivos públicos inspecionados sem marcadores de servidor. |
| `bun run typecheck` | Passou nos sete workspaces com tarefa e na raiz. |
| `bun run lint` | Passou; uma sugestão informativa preexistente em `scripts/local-env.ts`. |
| `bun run test` | 30 passaram; cinco testes de integração opt-in foram executados separadamente. |
| `bun run db:start`, `db:env`, `db:seed`, `db:check` | Passaram no projeto isolado, com a cadeia SQL e seed fictício. |
| `bun run test:integration` | Cinco passaram: idempotência, versões, permissões e Auth/RLS entre usuários. |
| `E2E_PRODUCTION=1 bun run test:e2e` | 36 passaram em desktop/mobile; dois de Auth ignorados intencionalmente na demo. |
| `E2E_INTEGRATION=1 E2E_PRODUCTION=1 bun run test:e2e` | 38 passaram em desktop/mobile, incluindo login/follows, isolamento e logout. |
| E2E contra `bun run dev:real` | Dez passaram em desktop/mobile (Auth, catálogo, propostas e navegação), com `.env` mantendo `DEMO_MODE=true`: a opção do comando prevaleceu. |
| `bun run dev:real -- --dry=json` | Passou em modo estrito; `DEMO_MODE=false` incluído no ambiente global do Turborepo. |

Os testes integrados usam fixtures oficiais reduzidas e versionadas; não
executam coleta online nem representam cobertura completa da Câmara.
O build da imagem Docker e um deploy remoto não foram executados.
Os checks do commit atual no GitHub são a referência para o CI remoto.

A revisão preservou as alterações pendentes no checkout original e não
executou merge do PR em `main`.
