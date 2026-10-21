# Validação MOD-47 — 21/10/2026

Branch `codex/mod-47-senadores`, baseada em `origin/main`, Bun **1.4.3**. Verificação em worktree separado, Supabase local com project ID `modo-cidadao-mod47-test` e portas próprias. Dados e alterações do checkout original foram preservados. A configuração temporária de teste não integra o PR.

## Checks executados

| Check | Resultado |
| --- | --- |
| Dependências | `bun install --frozen-lockfile` passou antes e após incluir o novo workspace; apenas `bun.lock`, sem dependência externa nova. |
| Build | `bun run build` passou com Vite sob Bun; bundle público inspecionado: 25 arquivos, sem marcadores de banco ou segredos configurados. |
| Fronteiras | `bun run check:boundaries` bloqueou imports de banco e do novo adapter Senado através do pacote UI. Probes removidos e build recomposto. |
| Tipos | `bun run typecheck` passou nos oito workspaces com tarefa e nos scripts/testes da raiz. O pacote config não possui tarefa de tipos. |
| Lint | `bun run lint` passou; uma informação preexistente de template string em `scripts/local-env.ts`, sem erros. |
| Unidade | `bun run test`: **54 passaram**, oito testes de integração ignorados intencionalmente. Inclui dez novos casos do adapter/worker Senado. |
| Banco/Auth/RLS | `bun run test:integration`: **oito passaram**, incluindo replay, snapshot deduplicado, observações distintas, instituição/participação/períodos no DTO, leitura limitada, observação antiga, preservação após falha e regressão Câmara/Auth/RLS. Sem APIs legislativas externas. |
| E2E demo | `E2E_PRODUCTION=1 bun run test:e2e`: **38 passaram**, 12 ignorados por modo, desktop e celular. |
| E2E integrado | `E2E_PRODUCTION=1 E2E_INTEGRATION=1 bun run test:e2e`: **48 passaram**, dois ignorados por modo, desktop e celular, com fixtures oficiais e retratos interceptados. |
| API oficial | `bun run test:source:senado`: JSON v4 válido, 81 pessoas observadas, sem paginação. OpenAPI e XSD consultados por HTTP. |
| Worker oficial | Duas chamadas `bun run worker -- --source=senado --resource=senators --limit=100`: cada uma persistiu 81 de 81, `coverage=observed-list`, `completed`, checkpoint 1. Banco permaneceu com 81 identidades do Senado e um deputado da fixture da Câmara; sem duplicatas no replay. |
| Cancelamento oficial | `bun run test:worker:shutdown -- --source=senado`: SIGTERM após criação da execução, status `cancelled`, pool encerrado, código 130. |
| Migrations | Cadeia completa aplicada em banco isolado vazio. SQL da migration também executado sobre cópias das tabelas anteriores populadas: JSON de pessoas e mandatos preservado integralmente; coluna nova nula nos mandatos antigos. Cópias descartadas na transação. |
| Advisor local | `bun --bun supabase db advisors --local --type security --level warn --fail-on error`: nenhuma ocorrência. |
| Inspeção visual | Diretório, perfil, Explorar e fontes da landing em desktop/celular, com dados da coleta real e retratos carregados do host oficial; sem mocks, contas ou escolhas pessoais. Sem erros de página nem overflow horizontal nos oito estados capturados. |

A primeira suíte integrada teve uma falha na expectativa do teste novo: exigia visibilidade do selo institucional que o CSS existente oculta no celular. O teste passou a verificar sua presença e o cargo visível; o perfil valida instituição e origem. O fluxo Senado foi repetido nos dois dispositivos e, depois, toda a suíte integrada passou. Nenhum erro de produto foi ocultado.

## Evidências e limites

As capturas da branch estão em [screenshots/mod-47](screenshots/mod-47), com diretório/perfil/Explorar/fontes em desktop e celular, modo integrado claro. Dados são públicos e a coleta aparece no perfil; retratos dessa inspeção vieram diretamente do Senado. A fixture versionada é uma seleção oficial de dois registros, distinta do seed fictício.

Coleta manual limitada, sem scheduler, atualização contínua ou reconciliação de ausências. `observed-list` significa apenas que aquela resposta foi persistida por inteiro; não significa cobertura histórica nem remoção segura de ausentes. Participação no mandato e exercício observado são distintos. Metadados e códigos originais permanecem no RAW privado. Recursos legislativos/administrativos adicionais, filtros da MOD-48 e histórico completo da MOD-50 continuam pendentes.

Nenhum deploy remoto, serviço pago ou merge foi executado. Os resultados acima são locais; checks do commit do PR no GitHub indicam o resultado vigente do CI. O advisor sem ocorrências não equivale a uma auditoria completa de segurança.
