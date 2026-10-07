# Validação local — 07/10/2026

Executada nesta máquina, com Bun **1.4.2**, PostgreSQL **17.11** no Supabase local e Chromium via Playwright. Os comandos da web, do worker, do Vitest e do Playwright usaram Bun. Nenhum projeto remoto, serviço pago, deploy ou agendamento foi criado.

## Resultados executados

| Verificação | Resultado observado |
| --- | --- |
| Instalação | `bun --version` confirmou 1.4.2; `bun install --frozen-lockfile` concluiu sem modificar o lockfile. |
| Desenvolvimento | Vite iniciado explicitamente com Bun; páginas e server functions funcionaram em demo e com banco/Auth locais. |
| Build | Build Vite/Start concluído; inspeção de 16 arquivos públicos não encontrou imports de servidor nem valores de segredos configurados. |
| Fronteira de imports | Import proibido de banco através de `packages/ui` causou falha de build, como exigido. Arquivos temporários removidos e build recomposto. |
| TypeScript | Sete workspaces e scripts/testes da raiz passaram com configuração estrita e `tsc --noEmit`. |
| Lint | Biome passou sem erros; sete avisos CSS de ordem de especificidade e uma sugestão de template string permaneceram. |
| Lógica | Vitest: **9 testes passaram**. Integração local é opt-in e fica fora da execução padrão. |
| PostgreSQL/Auth/RLS | **2 testes de integração passaram**, incluindo duas contas temporárias, grants, isolamento, leitura limitada e rejeição de alteração do proprietário. |
| E2E demo | **4 testes passaram**, desktop e mobile; **2 testes de Auth foram ignorados intencionalmente** nesse modo. |
| E2E integração | **6 testes passaram**, desktop e mobile, em desenvolvimento e no servidor de produção Bun. |
| Produção local | `apps/web/server.ts` serviu o build Start com Bun; SSR, API, arquivos estáticos, login, follows e logout verificados por Playwright. |
| Migrations | Cadeia inicial aplicada em banco local; migration aditiva de evidência aplicada preservando o catálogo importado. |
| Ingestão real | Worker manual limitado importou **3 representantes da Câmara** por lista/detalhe oficiais, com RAW minimizado, observações, proveniência e normalização. |
| Idempotência | Reexecução preservou a identidade das pessoas; replay com filiação inalterada não criou histórico adicional. Snapshots iguais foram deduplicados e novas observações preservadas. |
| Cancelamento real | SIGTERM encerrou worker com código 130, registrou execução cancelada no banco e fechou o pool. |
| Advisor local | `supabase db advisors --local --type security --level warn --fail-on error`: nenhuma ocorrência. |
| Git local | Repositório inicializado, `bun.lock` incluído e `git diff --cached --check` sem ocorrências; 100 arquivos inspecionados sem credenciais configuradas. `.env`, runtime local e builds ficam ignorados. |

Os testes públicos verificam SSR/metadados, filtros inválidos, busca/paginação, perfil e 404, respostas privadas sem cache, proteção de Origin, navegação, ausência de erros de hidratação e de overflow horizontal. Os testes pessoais verificam login, follow persistente após reload, isolamento REST entre A/B, unfollow e logout. Tokens não são gravados em traces dos testes autenticados; contas temporárias são removidas.

Os testes unitários/integrados usam fixtures oficiais pequenas e minimizadas, separadas da demo. Consultas externas e importação real foram opt-in. O CI usa fixtures e não depende de disponibilidade da API legislativa.

## O que cada modo significa

- **Demo funcional:** 12 pessoas explicitamente fictícias, lista/perfil e navegação, sem autenticação simulada. O seed determinístico compartilha esses mesmos registros; não atribui fatos inventados a políticos reais.
- **Integração real local:** dados consultados na API oficial da Câmara, persistidos no PostgreSQL e lidos pela web/REST; Supabase Auth local e RLS para follows. A amostra de três representantes não significa cobertura completa.
- **Estrutura preparada:** CI, Dockerfile, documentação REST e limites para futuras integrações. Ter esses arquivos não significa que houve execução no GitHub, build de imagem Docker ou implantação remota.
- **Planejamento preservado:** propostas, votações, despesas, Senado, TSE, feed, alertas e demais funcionalidades continuam nos documentos completos. As telas ainda sem integração informam indisponibilidade.

## Ambiente e limites da verificação

Bun 1.4.2 não estava disponível inicialmente e foi instalado em `.tools/` do projeto. Docker estava instalado, com daemon parado; Docker Desktop foi iniciado e o Supabase local ficou acessível. Esses impedimentos foram resolvidos e não bloquearam as verificações da fundação.

A imagem do `Dockerfile`, o workflow no GitHub, adapters de hospedagem remota e conexão por pooler remoto **não foram executados/validados**. O alvo efetivamente testado é o servidor Bun local. Não há envio externo de e-mail, recuperação/exclusão de conta, fila, scheduler ou notificações. O advisor sem ocorrências não equivale a uma auditoria completa de segurança.

CPF retornado pela Câmara é removido antes de persistir RAW; hashes original/armazenado e campos removidos mantêm evidência dessa minimização. Datas de coleta e de observação não são datas legais de atualização ou filiação.

Comandos reproduzíveis estão no [README](../README.md); versões instaladas em [VERSOES.md](VERSOES.md). A porta 3000 deve estar livre para suítes que iniciam seu próprio servidor; `E2E_BASE_URL` permite usar um servidor já ativo.

## Entrega posterior de propostas

Este documento registra a fundação inicial. O catálogo foi posteriormente ampliado para 513 deputados e três propostas oficiais; detalhes e checks da nova entrega estão em [VALIDACAO-PROPOSTAS.md](VALIDACAO-PROPOSTAS.md).
