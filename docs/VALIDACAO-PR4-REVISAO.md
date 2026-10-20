# Validação da integração e revisão do PR 4

Data: 20/10/2026. Branch: `feat/shadcn-theme`. Base integrada: `d9e55e9` de `main` (PRs 1 e 2), merge `15c65ca`.

## Resultado

Conflitos resolvidos preservando o catálogo de propostas, tramitações, autoria por ID, rótulos de cargo/esfera/UF, URLs públicas e layout sem segmento `_app`. Corrigidos os dois achados da revisão: partido oculto em telas estreitas e perda do tema manual na transição entre layouts quando o navegador bloqueia armazenamento. Os estilos incorporados das propostas foram adaptados aos tokens claros/escuros.

A revisão final conferiu fronteiras de servidor, ausência de estado React mutável compartilhado entre requisições, contratos e a combinação com `main`. Não restaram achados acionáveis no escopo revisado. Banco, domínio, fontes, worker e políticas de autenticação/RLS mantêm o código de `main`.

## Ambiente e comandos

Execução local com **Bun 1.4.3**, macOS arm64 e Chromium; a branch conserva o runtime **1.4.2** versionado e usado no CI. As alterações locais de runtime do checkout principal não foram incluídas. Dependências preparadas por `bun install --frozen-lockfile --ignore-scripts`: o único `preinstall` valida estritamente Bun 1.4.2; ele não foi executado com a versão local diferente. `bun.lock` não mudou nesta revisão. A instalação normal e a versão declarada são verificadas pelo CI do commit publicado.

```sh
bun run check:boundaries
bun run build
bun run typecheck
bun run lint
bun run test
bun run db:start
bun run db:migrate
bun run db:env
bun run test:integration
# Build servido com apps/web/server.ts em portas temporárias distintas:
E2E_BASE_URL=http://localhost:43195 bun run test:e2e
E2E_INTEGRATION=1 E2E_BASE_URL=http://localhost:43196 bun run test:e2e
bun scripts/check-client-bundle.ts
```

`check:boundaries` foi executado antes do build final, pois é um teste negativo que introduz temporariamente um import proibido. Os servidores temporários usaram `DEMO_MODE=true` e `false`, respectivamente, e `VITE_APP_URL` correspondente à porta para validar Origin nas mutações. `.env` local foi gerado pelo fluxo existente com permissão 0600; credenciais não foram impressas nem versionadas.

## Checks executados

| Verificação | Resultado |
| --- | --- |
| Proteção de imports através de pacote do workspace | Aprovada |
| Build Vite/Start e inspeção de 25 arquivos públicos | Aprovados; sem marcadores de banco ou valores de segredos configurados |
| TypeScript estrito | Aprovado |
| Lint | Sem erros ou avisos; uma sugestão informativa preexistente em `scripts/local-env.ts` |
| Vitest lógico/contrato | 30 passaram; 5 integrações opt-in ignoradas nessa execução |
| PostgreSQL/Auth/RLS e propostas | 5 passaram |
| E2E demo, desktop e celular | 36 passaram; 2 de Auth ignorados nesse modo |
| E2E integrado, desktop e celular | 38 passaram, incluindo login, follow, reload, isolamento REST, unfollow e logout |

A cobertura nova verifica partido/cargo/UF em 320, 800, 1150 e 1280 pixels; a escolha manual de tema na ida e volta entre landing e plataforma sem `localStorage`; o layout SSR dos detalhes de propostas; e contraste mínimo de 4,5:1 nas amostras de ementa/metadados dos temas claro e escuro. Permanecem os checks de Select, fallback sem JavaScript, navegação mobile, fontes, paginação, filtros, 404 e console/hidratação.

Na primeira rodada, uma asserção nova tratava o menu mobile fechado como visível. A asserção foi corrigida para verificar sua presença no layout, incluindo elementos ocultos, e as duas rodadas completas acima passaram depois disso.

## Dados e limites

Usado somente Supabase local, com fixtures oficiais pequenas e versionadas para os testes de integração e personagens fictícios no modo demo. A inspeção visual integrada usou um deputado e uma proposta da fixture; isso não comprova cobertura completa da Câmara. Contas temporárias foram removidas pelos testes. `db:migrate` não encontrou migrations pendentes; não houve reset, nova importação legislativa, chamada à API oficial, alteração de produção ou deploy remoto.

Capturas conferidas visualmente:

- [Diretório em 320px com partido visível](screenshots/pr-4-review/representantes-mobile.png).
- [Propostas no tema escuro](screenshots/pr-4-review/propostas-escuro.png).
- [Ementa, autores e tramitação no tema escuro](screenshots/pr-4-review/tramitacao-escuro.png).

As capturas contêm somente dados públicos das fixtures e nenhum dado de conta. Decisões em [ADR 005](decisions/005-integracao-e-revisao-pr-4.md). Os checks remotos devem corresponder ao commit atual do PR; seu resultado aparece no GitHub.
