# Revisão e rebase do PR #7 — 21/10/2026

PR: https://github.com/apsr-dev/modo-cidadao/pull/7.
Rebase sobre `ba9f04b` de `main`; head original: `104848e`.

## Resultado

Resolvidos por rebase os conflitos de README, histórico de validação e
`skills-lock.json`. As quatro skills já estavam em `main`, com os mesmos
arquivos; foram preservadas byte a byte, assim como o lock existente.
O diff final fica restrito à documentação e à atualização do seu caminho
em `AGENTS.md`.

A revisão corrigiu a documentação antiga que exigia Bun 1.4.2 e ainda
apresentava propostas como indisponíveis. O README usa Bun 1.4.3 e resume
o estado atual. O guia recebe o conteúdo operacional completo do README
atual de `main`, incluindo `dev:real`, fotos, propostas, tema, arquitetura,
REST, limites de cobertura, segurança e links das validações anteriores.

As instruções para outra máquina distinguem clone, seed fictício, recoleta
e backup privado de contas/follows. Os links foram ajustados ao diretório
`docs/`; a orientação de `AGENTS.md` aponta para o guia antes de `db:reset`.
Os três planejamentos completos permanecem inalterados.

Não restam achados bloqueadores após as correções. Nenhuma mudança de
aplicação, migration, dependência, skill ou comportamento foi introduzida.

## Verificação local

| Verificação | Resultado |
| --- | --- |
| Runtime | Bun 1.4.3 (`c6da4a4d3`), coerente com os requisitos documentados. |
| `bun install --frozen-lockfile` | Passou, incluindo o verificador de runtime, sem alteração de `bun.lock`. |
| `bun run lint` | Passou; resta uma sugestão informativa preexistente em `scripts/local-env.ts`. |
| `bun run worker -- --help` | Passou, confirmando os recursos e limites documentados, sem coleta online. |
| Links locais e âncoras | 34 conferidos em README, guia e histórico de validação. |
| Comandos documentados | Nomes de scripts `bun run` conferidos contra `package.json`. |
| Portabilidade | README/guia sem Bun 1.4.2, `.tools/` ou caminhos `/Users/`; exceções históricas permanecem nos registros originais. |
| Preservação | Skills, ambos os lockfiles, aplicação, migrations e os três planejamentos idênticos a `main`. |
| Git | Rebase concluído sem commit de merge; diff sem erros de whitespace. |

A suíte da aplicação, banco local e consultas oficiais não foram
reexecutados localmente por esta mudança exclusivamente documental.
O CI remoto executa seus jobs completos; consulte os checks do commit
atual para o resultado. Não houve reset, importação, deploy ou merge em
`main`. O checkout original e suas alterações pendentes foram preservados.
