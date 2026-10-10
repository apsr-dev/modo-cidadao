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

## Tema visual Modo Cidadao — MOD-177

O tema fornecido em 07/10/2026 foi aplicado na branch `feat/shadcn-theme`. Os 52 tokens claros e 50 escuros foram comparados ao CSS enviado e preservados. Fontes locais, superfícies, bordas, sombras, links, estados de foco e favicon usam o novo tema; cores auxiliares de texto e preenchimento são derivadas para legibilidade.

Build Vite/Start, inspeção do bundle, typecheck e lint passaram. Permanecem os sete avisos CSS e a sugestão de template string já existentes. Vitest: **9 passaram, 2 opt-in ignorados**. Playwright contra o servidor Bun de produção isolado na porta 3002, em demo: **14 passaram, 2 de Auth ignorados**. O teste de contraste foi repetido após seu ajuste de tipagem, com os dois dispositivos aprovados.

A suíte cobre preferência do sistema, escolha manual por teclado, recarga e navegação, sincronização entre abas, armazenamento bloqueado, aplicação antes do JavaScript da aplicação e contraste mínimo de 4,5 nas amostras de texto/botões verificadas nos dois temas. A navegação também foi verificada em 320 pixels, sem overflow horizontal, além dos fluxos públicos de catálogo/SSR/REST já existentes. A prévia foi inspecionada visualmente em desktop e celular, sem erros no navegador ou servidor. Esta entrega não alterou a ingestão, o banco ou a autenticação; os testes opt-in dessas integrações não foram repetidos.


## Landing e app — redesign de 09/10/2026 no PR 4

Validado com Bun 1.4.2 no worktree `feat/shadcn-theme`. A landing está em `/`, o início do app em `/app`, e os caminhos de catálogo, perfil, participação e área pessoal foram preservados pelo layout sem segmento `_app`.

- `bun install --frozen-lockfile`, build Vite/Start, inspeção de 20 arquivos públicos e TypeScript estrito aprovados. Lint sem erros ou avisos; resta somente a sugestão preexistente de template string no script de configuração local.
- Vitest: **9 passaram, 2 opt-in ignorados**. Sem mudanças de domínio, banco ou ingestão.
- Playwright contra o build de produção na porta 3008, demo: **18 passaram, 2 de Auth ignorados**.
- Playwright contra o mesmo build na porta 3009, com catálogo e Supabase existentes locais: **20 passaram**, incluindo login, follow, reload, isolamento REST, unfollow e logout. Contas temporárias removidas pela suíte. Nenhuma migration ou importação foi executada nesta validação.
- A nova cobertura verifica landing sem navegação do app, entrada em `/app`, descoberta por UF, Escape/foco na navegação mobile e entrada pública sem JavaScript. A suíte anterior continua verificando SSR/REST, perfil/404, origem das mutações, tema, armazenamento bloqueado e contraste nas amostras de texto/botões verificadas.
- Inspeção visual em desktop, 390 × 844 e 320 × 700: landing, início do app, catálogo, perfil e participação. Em 320 pixels, sem overflow horizontal. Console observado sem erros. Capturas em `docs/screenshots/pr-4` usam personagens fictícios e não contêm dados de contas.

As referências do Mobbin, a licença da fotografia e as decisões de layout estão no [ADR 004](decisions/004-landing-e-app.md). O MCP conectado não expôs ferramentas nesta sessão; as referências foram consultadas no navegador. Os testes de fonte externa e o advisor de banco não foram repetidos porque esta entrega não modifica essas integrações. Não houve deploy remoto.

## MOD-44 — apresentação institucional e navegação

A separação de layouts foi complementada com fontes/cobertura por modo e entrada da conta restrita à persistência. Checks e evidências estão em [VALIDACAO-MOD-44.md](VALIDACAO-MOD-44.md).
