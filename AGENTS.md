# Plataforma cívica — regras do repositório

Leia integralmente, antes de mudanças relevantes:
- `docs/PLANEJAMENTO-FEATURES.md`
- `docs/PLANEJAMENTO-TECNICO.md`
- `docs/RECURSOS.md`

O planejamento descreve o produto completo; README e `docs/VALIDACAO.md` descrevem o que está implementado e verificado. Preserve os documentos completos; não reorganize por MVP, fases ou sprints. Registre decisões novas em `docs/decisions/` e atualize documentação quando comportamento, produto ou arquitetura mudar.

Cada feature deve ser implementada em branch própria e entregue em pull request contra `main`. Não envie mudanças de features diretamente para `main` nem faça merge automático.

## Runtime e verificação

- Bun **1.4.2** é o runtime da web/worker e único gerenciador. Use Bun workspaces, `workspace:*`, `bun.lock` e `bun install --frozen-lockfile`. Nunca gere lockfiles concorrentes.
- Vite roda explicitamente com Bun: `bun --bun vite dev/build`. Produção local usa `apps/web/server.ts` com Bun. Não substitua o build por bundler Bun.
- `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:e2e`. O build gera as rotas antes do typecheck em checkout limpo. `bun run test` chama Vitest, não `bun test`.
- Banco local: `bun run db:start`, `bun run db:env`, `bun run db:seed`, `bun run test:integration`. Leia README antes de `db:reset`, que apaga dados locais. Não use produção como fallback.
- Testes da API oficial e worker online são opt-in. CI usa fixtures pequenas e versionadas. Nunca declare uma integração concluída sem executar seus checks e registre bloqueios reais.

## Arquitetura e segurança

- Monólito modular: `apps/web` e `apps/worker`. Sem API/Hono separado por padrão. Não acrescente microserviços, Kafka, Kubernetes, GraphQL, Elasticsearch ou Redis sem necessidade concreta.
- Domínio não depende de React, Start, banco nem fornecedores. Rotas/handlers finos; server functions e REST `/api/v1` chamam os mesmos casos de uso, sem HTTP interno.
- Valide entradas. Autentique e autorize cada operação privada no servidor. Identidade vem de `getUser()` verificado, nunca de body, `getSession()` isolado ou `user_metadata`.
- Loaders podem rodar no navegador. Banco/env/Auth ficam em `.server.ts`, com marcador `@tanstack/react-start/server-only`. Proteção de imports cobre os pacotes do workspace; execute `check:boundaries` e inspecione bundle no build.
- SQL em `supabase/migrations` é a única cadeia. Drizzle representa schema e consultas, sem histórico paralelo. Não use Drizzle para dados pessoais: Supabase com JWT do usuário e RLS para follows. Uma URL SQL não carrega identidade Supabase.
- `civic` é catálogo; `internal` é RAW/observações/sync, não exposto; `public.followed_people` tem grants explícitos e RLS. Leitura usa `civica_reader`, ingestão `civica_ingest`; roles sem bypassrls.
- Segredos nunca em browser, Git ou logs. Não imprimir saída bruta de `supabase status/start`. `.env` local com permissão 0600. Nunca enviar follows/feed/preferências a analytics ou logs.
- QueryClient por requisição SSR. Respostas pessoais `private, no-store`; limpe cache pessoal no logout/troca de conta. Mutações por cookies exigem Origin permitido. REST suporta bearer verificado.

## Dados e produto

- Cobertura federal Câmara/Senado; TSE eleitoral. Outras esferas são extensão do modelo, não promessa de importação municipal. Nome provisório configurável, sem ranking, nota política, classificação ideológica ou recomendação de voto.
- Pessoa, mandato, filiação e candidatura são distintos. IDs têm namespace de fonte/recurso. Nunca una pessoas só por nome.
- Preserve origem, ID externo, URL oficial, coleta, conteúdo da fonte e versão de normalização. Retenha apenas dados necessários: Câmara CPF é removido antes de persistir; registre campos removidos e hashes. Não altere outro campo oficial para completar lacunas.
- Zero, não informado, não coletado e não se aplica são diferentes. Coleta não é data de ocorrência nem atualização oficial. Amostra parcial nunca significa cobertura completa nem remoção de registros ausentes.
- Votação e voto individual são distintos. Preserve objeto e versão do texto. Requerimento não é mérito integral da proposta; votação simbólica não recebe votos individuais inventados.
- Demo é explícita, com pessoas fictícias e sem contatos falsos atribuídos a pessoas reais. Fixture oficial de teste não é dado fictício.
- Participação direciona ao canal oficial verificado. Não automatize apoio oficial nem mensagens em massa. Não armazene senha gov.br ou atue em nome de cidadão sem autorização. Abertura de link não prova participação concluída.
- Não incluir canal, YouTube, estratégia de conteúdo ou blog editorial.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
