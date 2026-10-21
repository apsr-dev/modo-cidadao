# Revisão e integração do PR #6 — 21/10/2026

PR: https://github.com/apsr-dev/modo-cidadao/pull/6.
Base integrada: `3cbfd18` de `main`. Head original: `834c42a`.

## Resultado

Conflitos resolvidos preservando o layout em listas, tema claro/escuro,
rótulos de cargo/UF e as propostas do perfil. Fotos oficiais e iniciais
acessíveis ocupam o mesmo espaço do Avatar atual; as rotas usam o layout
`_app`. Mantidos Bun 1.4.3, `dev:real`, os componentes de formulário e os
registros completos de documentação e validação de `main`.

O lockfile foi reconciliado com Bun e validado por instalação congelada.
As versões existentes continuam presentes, com as dependências do Avatar
fixadas conforme o PR. Mudanças de posição no lockfile refletem as versões
distintas de dependências Radix, sem substituir Select/Label/Separator.

A revisão encontrou uma lacuna de isolamento: somente `photos.spec.ts`
interceptava retratos, embora as demais páginas integradas também os
carreguem. Uma fixture compartilhada agora intercepta fotos em toda a suíte,
mantendo os testes independentes da rede oficial. A cobertura inclui imagem
válida, 404, bytes inválidos e iniciais enquanto a resposta está pendente.

Revisados normalização/validação de URL e ID, demo, persistência,
proveniência, contrato REST, migration e componentes React. Não restam
achados de código bloqueadores após as correções.

## Verificações executadas

Bun **1.4.3** (`c6da4a4d3`), PostgreSQL **17.11**, Supabase isolado no projeto
`modo-cidadao-pr6-review`. O banco de desenvolvimento e o checkout original
não foram alterados. A configuração de isolamento e o `.env` temporário,
com permissão 0600, não fazem parte do PR.

| Verificação | Resultado |
| --- | --- |
| `bun install --frozen-lockfile` | Passou após a reconciliação do lockfile; nenhum lockfile concorrente. |
| `bun run check:boundaries` | Passou: import de banco através do pacote UI foi bloqueado; probes removidos. |
| `bun run build` | Passou com Vite/Start e inspeção de 25 arquivos do bundle público. |
| `bun run typecheck` | Passou nos sete workspaces com tarefa e na raiz. |
| `bun run lint` | Passou; permanece uma sugestão informativa anterior em `scripts/local-env.ts`. |
| `bun run test` | 44 passaram; seis testes opt-in de integração executados separadamente. |
| `db:start`, `db:env`, `db:seed`, `db:check` | Passaram no projeto isolado, com a cadeia SQL completa. |
| `bun run test:integration` | Seis passaram, incluindo foto/proveniência, replay, observações e isolamento Auth/RLS. |
| Migration sobre registros existentes | SQL real aplicado em simulação transacional sobre 13 pessoas: demais campos preservados, `photo=not_collected` inicializado. Rollback integral ao terminar; sem reset. |
| `E2E_PRODUCTION=1 bun run test:e2e` | 38 passaram em desktop/mobile; dez ignorados pelo modo demo. |
| `E2E_INTEGRATION=1 E2E_PRODUCTION=1 bun run test:e2e` | 46 passaram em desktop/mobile; dois ignorados por serem exclusivos da demo. Fotos interceptadas em toda a suíte. |
| Inspeção visual | Diretório e perfil com foto real carregada diretamente da URL oficial, em desktop e celular, claro/escuro; crédito e link presentes, sem erros no console da inspeção. |

O processo do servidor de testes registrou um `AbortError` de conexão
encerrada durante a suíte integrada; os testes e as verificações de console
das páginas passaram. Não houve alteração no servidor para suprimir o log.

## Evidências e limites

Capturas atuais em `docs/screenshots/pr-6-review`: diretório claro desktop,
perfil claro/escuro desktop e diretório/perfil escuros em celular. Os dados
são uma fixture oficial reduzida persistida no banco local, com a coleta
histórica indicada no perfil. A imagem da inspeção manual veio do host
oficial; não há novo crawling ou importação online da API nesta revisão.

A demo continua fictícia e sem retratos. Não há garantia de cobertura de
fotos nem atualização automática. Indisponibilidade da imagem mantém as
iniciais. Não foram executados build da imagem Docker ou deploy remoto.
Os checks do commit atual no GitHub são a referência para o CI remoto.

A revisão não fez merge do PR em `main`.
