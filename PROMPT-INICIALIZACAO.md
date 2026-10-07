# Prompt de inicialização do projeto

> Uso: coloque os outros três arquivos deste pacote em `docs/` no diretório onde o projeto será criado. Cole o texto abaixo na IA que tem acesso à sua máquina. Se estiver anexando os documentos à conversa, peça que a IA os copie integralmente para os caminhos indicados. Este prompt inicializa uma fundação executável; o planejamento descreve o escopo completo do produto, sem calendário de fases.

---

Você é o engenheiro responsável por inicializar na minha máquina uma plataforma brasileira de cidadania e participação política. Execute o trabalho no diretório atual, respeitando os arquivos existentes. Não entregue apenas instruções: crie os arquivos, instale as dependências compatíveis e valide a execução local.

## Contexto obrigatório

Antes de implementar, leia integralmente:

- `docs/PLANEJAMENTO-FEATURES.md`: visão do produto, funcionalidades, regras e critérios de aceitação.
- `docs/PLANEJAMENTO-TECNICO.md`: stack, arquitetura, domínio, segurança e operação.
- `docs/RECURSOS.md`: documentação técnica, APIs, datasets e sites oficiais.

Se os documentos vieram anexados, salve cópias integrais nesses caminhos antes de começar. Não substitua os documentos por resumos. Se um deles estiver ausente, procure-o apenas no diretório e nos anexos fornecidos; informe o impedimento se não conseguir encontrá-lo, sem inventar requisitos.

O produto reúne informações públicas fragmentadas e facilita descobrir representantes, acompanhar propostas e votações, consultar gastos e candidaturas e acessar mecanismos oficiais de participação. É voltado principalmente a jovens adultos de aproximadamente 18–35 anos, mas deve ser acessível a qualquer cidadão.

A cobertura operacional definida é federal: Câmara dos Deputados e Senado. TSE complementa informações eleitorais. O domínio deve permitir outras esferas, sem assumir importação nacional de municípios. Não há nome definitivo: use `plataforma-civica` como nome técnico e configuração de marca substituível. Não presuma que Faz Valer ou Modo Cidadão já foram escolhidos.

Não inclua funcionalidades de canal, redes de conteúdo, blog editorial ou YouTube. Explicações de propostas e instruções de participação são partes da interface do produto. Não crie notas, rankings de qualidade, classificação ideológica ou recomendações de voto.

## Decisões técnicas

- TypeScript em modo estrito, React e **TanStack Start** com TanStack Router; Vite como ferramenta de build.
- Bun 1.4.2 workspaces e Turborepo para tarefas do monorepo.
- Tailwind CSS, shadcn/ui e componentes acessíveis.
- TanStack Query para estado remoto, cache e invalidação; filtros compartilháveis no URL com validação Zod.
- PostgreSQL padrão no Supabase, Supabase Auth e Storage quando houver necessidade de arquivos.
- Drizzle para consultas tipadas e representação do schema. SQL versionado em `supabase/migrations` é a única cadeia de migrations aplicada.
- Workers Bun 1.4.2/TypeScript separados da web para ingestão, reprocessamento, resumos e notificações.
- Vitest para lógica e integrações pertinentes; Playwright para os fluxos essenciais.

Consulte as fontes oficiais atuais antes de escolher versões, comandos de scaffold ou APIs. Confirme Bun 1.4.2, use-o como runtime e único gerenciador de pacotes e gere bun.lock. Use bun --bun vite para dev/build e bun install --frozen-lockfile no CI. Não reutilize exemplos antigos do TanStack Start, não adote RSC experimental e não registre como fato versões ou status de lançamento de conversas anteriores. O guia oficial de início é https://tanstack.com/start/latest/docs/framework/react/getting-started.

## Arquitetura que deve ser materializada

Crie um monólito modular com dois processos: `apps/web` e `apps/worker`. A web contém UI, SSR, server functions como adaptadores do site e server routes REST em `/api/v1` para consumidores externos. Regras de negócio pertencem a `packages/domain`, não às rotas. Server functions e HTTP chamam os mesmos casos de uso; não há chamadas HTTP internas desnecessárias entre eles.

Não crie `apps/api` nem Hono separado por padrão. Essa separação poderá ser feita mantendo domínio e contratos quando houver razão operacional. Server functions do Start não são o contrato do futuro app mobile; use os endpoints REST versionados para isso.

Crie apenas os pacotes que tenham responsabilidade e uso concreto, seguindo o documento técnico:

- `packages/domain`: entidades, regras, portas e casos de uso independentes de React, Start, banco e fornecedores.
- `packages/contracts`: schemas Zod e DTOs seguros para clientes.
- `packages/db`: schema Drizzle e repositórios exclusivamente de servidor.
- `packages/source-camara`: cliente externo, validação e normalização da Câmara.
- `packages/source-senado` e `packages/source-tse`: limites de integração documentados; sem implementações fictícias.
- `packages/ui`: componentes visuais realmente compartilhados.
- `packages/config`: configuração compartilhada de TypeScript/lint quando for útil.

O navegador consulta nossa aplicação, nunca diretamente as APIs legislativas. A ingestão preserva dados originais e proveniência e produz registros normalizados. Identidade de pessoa é distinta de mandato, filiação partidária e candidatura. Votação é distinta de voto individual. Não vincule pessoas de fontes diferentes apenas por nome.

## Resultado esperado da inicialização

Entregue uma base pequena, utilizável e compatível com todo o planejamento:

1. Monorepo funcionando, scripts `dev`, `build`, `typecheck`, `lint`, `test` e comandos locais de banco, seed e worker documentados.
2. Navegação mobile-first com home, representantes, propostas, votações, participação, eleições e área pessoal. Rotas sem integração concluída devem apresentar estado honesto de indisponibilidade; não anuncie features como prontas.
3. Home que explique a proposta do produto, sem marca definitiva nem conteúdo editorial. Páginas públicas com SSR, metadados e tratamento de 404/erro/vazio.
4. Um fluxo vertical funcional de representantes da Câmara: adapter → RAW/proveniência → normalização → banco → caso de uso → server function/REST → lista e detalhe. Paginação, filtros por UF/nome e contato oficial quando disponível. A sincronização deve ser manual/local na inicialização, idempotente e limitada; não importar histórico completo nem ativar agendamento remoto automaticamente.
5. Schema e primeira migration para o núcleo necessário a esse fluxo e para demonstrar isolamento de usuários. O catálogo completo do planejamento orienta os limites; não crie dezenas de tabelas vazias só para imitar a lista.
6. Integração local de Auth e uma operação de seguir/deixar de seguir representante com políticas RLS e teste entre dois usuários. Se não houver Docker ou configuração suficiente, implemente e documente a integração, registre exatamente a validação bloqueada e mantenha a web executável em modo demo explícito.
7. Seed determinístico com personagens fictícios e indicação visível de dados de demonstração, separado da importação oficial. Não associe dados inventados a políticos reais.
8. `.env.example` apenas com nomes, descrições e placeholders; validação separada de env pública e privada. Segredos jamais entram no bundle, nos logs nem no git.
9. `README.md` com requisitos, instalação, configuração, execução, comandos, arquitetura resumida e limitações reais. `AGENTS.md` apontando para os três documentos e registrando as regras abaixo.
10. CI localmente reproduzível para typecheck, lint, testes e build. Sem configurar serviços externos, custos ou deploy por conta própria.

Não é necessário implementar todas as funcionalidades do planejamento nesta solicitação de inicialização. É necessário preservar os documentos completos e entregar a fundação funcionando. Não organize os documentos por MVP/fases/sprints e não remova do planejamento o que ainda não está implementado.

## Regras obrigatórias para implementação e AGENTS.md

- Leia os três documentos antes de mudanças relevantes; atualize-os quando uma decisão de produto ou arquitetura mudar.
- Documentos descrevem intenções, não provam que uma feature existe. Não invente endpoints, limitações de APIs ou comportamento de bibliotecas.
- Rotas e handlers finos, entradas validadas, autenticação e autorização no servidor em cada operação privada.
- Loader não é uma fronteira de servidor: isole banco e segredos usando os mecanismos server-only e de proteção de imports documentados pelo Start.
- RAW, jobs e credenciais não ficam em schemas expostos. RLS e permissões SQL são verificadas; acesso Drizzle com conexão privilegiada não ganha identidade Supabase automaticamente.
- Operações pessoais passam por cliente Supabase no contexto do usuário com RLS; Drizzle fica com catálogo público e ingestão. Qualquer outra estratégia precisa ser registrada e testar o isolamento equivalente.
- Dados oficiais sempre têm origem, identificador externo, link oficial e data de coleta. “Não informado”, “não se aplica”, “não coletado” e zero são estados diferentes.
- Preservar contexto da votação e versão do texto. Não transformar voto em requerimento em voto sobre mérito; não inferir voto individual em votação simbólica.
- Não criar pontuação política, ranking, automação de apoio oficial ou envio em massa de mensagens.
- Integrações de participação abrem o canal oficial e informam requisitos. Nunca guardar senha de gov.br ou presumir autorização para agir em nome do cidadão.
- Notificações pessoais e follows são privados; não enviar suas escolhas para analytics ou logs.
- Evitar microserviços, Kafka, Kubernetes, GraphQL, Elasticsearch e Redis sem necessidade concreta.
- Registrar decisões novas e limitações em documentação; preservar arquivos existentes.

## Validação e entrega

Execute os comandos pertinentes e corrija os erros até obter uma base consistente. Teste normalização/idempotência, validação de filtros, isolamento de follows, navegação e HTML público gerado no servidor. Testes externos com APIs devem ser opt-in; CI usa fixtures pequenas e versionadas.

Ao terminar, informe o que está funcionando, a estrutura criada, as versões realmente instaladas, os comandos para rodar, o resultado dos checks e quais dependências do ambiente impediram verificações. Distinga scaffolding, demonstração e integração real. Se uma dependência externa não estiver disponível, entregue o restante e explique o bloqueio concreto; não finja sucesso.
