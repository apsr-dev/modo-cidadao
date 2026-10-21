# Desenvolvimento local

Guia de execução, configuração e limites da implementação. Para começar rapidamente, veja o [README](../README.md).

Fundação local de uma plataforma brasileira de cidadania. O nome é provisório e configurável. O diretório existente `modo-cidadao` foi preservado. Os três documentos em `docs/` continuam descrevendo o produto completo; este guia descreve a implementação atual.

## O que funciona

- Web React/TanStack Start com SSR, metadados, rotas públicas, estados vazio/erro/404 e navegação responsiva.
- Landing editorial em `/`, separada do app em `/app`, com catálogo em listas, regiões visuais distintas e contexto de cobertura. As URLs existentes continuam funcionando.
- Tema Modo Cidadao do tweakcn, fontes locais e alternância claro/escuro no cabeçalho. Segue o sistema até uma escolha manual, preservada neste navegador.
- Diretório e perfil de representantes da Câmara e do Senado, busca por nome sem acentos, filtro por UF, paginação padrão de 24 itens e contatos retornados pela fonte. A coleta local foi ampliada para 513 deputados em exercício em 07/10/2026.
- Propostas da Câmara: catálogo com tipo/número/ano/autor, paginação, detalhe com ementa e documentos oficiais, autoria/coautoria e linha do tempo de tramitação. O perfil mostra propostas importadas vinculadas por ID oficial.
- Foto oficial no diretório e perfil, com iniciais acessíveis quando ausente ou indisponível. A demo mantém somente iniciais.
- Server functions e REST `/api/v1` usam os mesmos casos de uso; o navegador não chama as APIs legislativas.
- Worker Bun manual/local: lista limitada → detalhe oficial → RAW minimizado e hashes → normalização → PostgreSQL → catálogo. Reexecução não duplica pessoas nem filiação inalterada. Coletas continuam criando observações.
- Supabase Auth local por e-mail/senha, cookies SSR HttpOnly e seguir/deixar de seguir. Follows privados por RLS; isolamento entre dois usuários testado no banco e no REST.
- Modo demo explícito com 12 personagens e oito propostas fictícias, incluindo tramitações, e o mesmo seed determinístico. Auth/follows ficam indisponíveis nesse modo.
- Participação abre os portais institucionais verificados da Câmara e do Senado.

Votações, matérias do Senado e dados eleitorais do TSE exibem indisponibilidade honesta. O catálogo de propostas é parcial e não representa toda a atuação de cada parlamentar. Feed, alertas, despesas, recuperação de senha, exportação/exclusão de conta, PWA e resumos de IA permanecem planejados. Esta inicialização não é uma operação pública completa.

Cargo, esfera e UF de representação são explícitos nos cartões, perfis e diretório. A UF identifica o estado ou o Distrito Federal representado pelo deputado federal; não indica que o cargo é estadual. Senadores em exercício podem ser importados manualmente; deputados estaduais/distritais ainda não estão integrados. Os rótulos preservam o aviso de personagens fictícios no modo demo. Consulte [ADR 003](decisions/003-cargo-esfera-representantes.md).

## Requisitos e início

Bun **1.4.3** é o único runtime JavaScript da aplicação/worker e gerenciador de pacotes, conforme [ADR 006](decisions/006-bun-1-4-3.md). Instale essa versão para seu usuário pelo [instalador oficial](https://bun.com/docs/installation). Abra um novo terminal após instalar e execute:

```sh
git clone git@github.com:apsr-dev/modo-cidadao.git
cd modo-cidadao
bun --version
bun install --frozen-lockfile
bun run dev
```

Abra **http://localhost:3000**. O comando `bun --version` deve retornar `1.4.3`. Configure o PATH para a instalação do usuário, por exemplo `~/.bun/bin`, no perfil do shell; não é necessário instalar Bun dentro do repositório. A configuração do projeto não atualiza o executável instalado. Aplicação, Vitest e Playwright usam Bun. Turborepo/Biome/CLI e serviços Docker usam seus próprios binários.

A web executa em demo quando não há `.env`. Se criar configuração manualmente, copie `.env.example` para `.env` e mantenha `DEMO_MODE=true` até configurar o banco. As variáveis privadas e públicas são validadas separadamente. Nunca prefixe credenciais com `VITE_`.

## Skills de interface para o Codex

`frontend-skill`, `make-interfaces-feel-better` e `find-skills` também estão em `.agents/skills`. A primeira foi instalada da versão histórica `30444aed500c00c85294d12074f6e3ee794f808a` de `openai/skills` (`skills/.curated/frontend-skill`); não está mais no catálogo principal e o instalador oficial não gerou uma entrada em `skills-lock.json`. As outras duas conservam origem e hash no lockfile.

## Skill shadcn

A skill oficial do repositório `shadcn/ui` fica em `.agents/skills/shadcn`, com suas referências, e é descoberta pelo Codex nos próximos turnos neste checkout. A origem e o hash da instalação ficam em `skills-lock.json`. Para atualizar a instalação no escopo do projeto:

```sh
bun x --bun skills add shadcn/ui --skill shadcn --agent codex --copy --yes
```

## Banco local e dados oficiais

É necessário Docker Desktop em execução. Não há projeto Supabase remoto configurado.

```sh
bun run db:start
bun run db:env
bun run db:seed
bun run db:check
bun run worker -- --source=camara --max-pages=1 --page-size=3 --limit=3
bun run dev:real
```

`dev:real` inicia o servidor com `DEMO_MODE=false`, independentemente do valor no `.env`, e usa os dados oficiais já importados no banco local. Não inicia o banco nem executa coleta automática.

`db:start` suprime a saída de credenciais da CLI. `db:env` lê o status local, gera senhas para os papéis `civica_reader` e `civica_ingest`, grava `.env` com permissão 0600 e preserva nome/URL/mode existentes. Execute após `db:start` ou `db:reset`; se já houver um processo web ativo, reinicie após trocar as senhas. Em um clone novo, execute esse fluxo e o worker para importar dados oficiais. A recoleta consulta o estado atual da fonte e não restaura observações antigas, contas ou follows; preservar esses dados exige backup privado separado. `.env`, volumes Docker e backups não devem ser enviados ao GitHub. O seed é fictício e não importa a Câmara. Os 513 deputados e três propostas dos registros anteriores pertencem ao ambiente daquela validação; não estão incluídos no clone.

Para atualizar um banco existente com fotos, execute `bun run db:migrate` antes de iniciar a nova web/worker e repita a coleta limitada acima. A migration preserva pessoas e marca a foto anterior como “não coletado”; somente uma nova observação oficial preenche a URL. As imagens são carregadas diretamente da Câmara, sem crawler nem armazenamento de arquivos. Origem, atribuição e limites dos termos estão em [docs/FONTE-CAMARA.md](FONTE-CAMARA.md).

A origem web configurada é `http://localhost:3000`. Use esse endereço para login. Se trocar domínio/porta, ajuste `VITE_APP_URL`; as mutações por cookie verificam Origin. `VITE_APP_NAME` altera a marca após reiniciar/rebuild.

O seed usa nomes fictícios e não cria contas. O catálogo integrado exclui `demo=true`. Para ativar a integração de forma persistente, altere `DEMO_MODE=false` no `.env`. Sem configuração completa ou banco acessível, o modo integrado mostra erro; ele não consulta produção nem muda silenciosamente para demo.

A sincronização é limitada a 5 páginas, 20 itens/página e 100 registros por chamada; `--start-page` permite iniciar outro lote manual de deputados ou propostas; o padrão é 3. Não apaga registros ausentes em amostras parciais nem importa histórico. Checkpoint só avança após página completa persistida; retomada automática, scheduler, fila de jobs, outbox e notificações ainda não existem. SIGINT/SIGTERM interrompe a coleta, registra cancelamento e fecha o pool.

```sh
bun run worker -- --help
bun run test:source                # opt-in: consulta oficial de uma pessoa, sem importar
bun run test:worker:shutdown       # opt-in: inicia/cancela worker contra a fonte oficial
bun run db:migrate                # aplica migrations pendentes apenas no banco local
bun run db:reset                  # APAGA o banco local e recria a cadeia SQL
bun run db:env
bun run db:seed
bun run db:stop                    # encerra contêineres locais, preservando volumes
```

`db:reset` não reimporta dados oficiais. As migrations são exclusivamente `supabase/migrations`; não há Drizzle Kit nem outra cadeia. Para migration nova, use `bun --bun supabase migration new nome` após consultar `--help`.

## Propostas e ampliação do catálogo

A origem continua sendo a Câmara; nenhum novo fornecedor foi necessário. Em `/propostas`, filtros por `type`, `number`, `year` e `authorId` operam sobre dados já persistidos. O detalhe mostra ementa oficial, situação, autores, datas e links específicos dos documentos. O perfil liga autoria por URI/ID do deputado, nunca pelo nome. Proponentes e signatários de apoio mantêm papéis distintos conforme a fonte.

```sh
bun run db:migrate
bun run db:seed
bun run worker -- --source=camara --resource=proposals --year=2026 --type=PL --deputy=204379 --page-size=3 --limit=3
# Para um identificador específico, acrescente --number=4916.
# Ampliação manual do catálogo atual de deputados, com até 100 registros em cada lote:
for first_page in 1 6 11 16 21 26; do
  bun run worker -- --source=camara --resource=deputies --start-page="$first_page" --max-pages=5 --page-size=20 --limit=100 || break
done
```

As páginas iniciais acima foram suficientes para a listagem de 07/10/2026; não são uma garantia permanente sobre seu tamanho. A consulta padrão da fonte retorna deputados em exercício no momento da requisição. A situação do perfil e as datas de coleta indicam a observação local; não há atualização automática nem remoção por ausência.

O catálogo inicial de propostas contém três PLs de 2026 de um autor; é uma amostra explícita. O ano é filtro de apresentação, sem garantia de cobertura anual completa da consulta externa. Intervalos anuais de datas são rejeitados pela API e não são enviados. O worker grava detalhe, autores e tramitações antes de substituir a versão atual. Recurso incompleto/falha preserva a última versão válida; versões anteriores e snapshots ficam no schema interno. Mesmos corpos não criam nova revisão. Cada recoleta mantém suas observações.

Horários sem fuso são preservados, sem conversão para UTC. A situação não é traduzida para “virou lei”. PDFs permanecem como links; votos, resumos, relatorias, comparação pública de versões e follows de propostas ainda não estão implementados. Veja [ADR 002](decisions/002-propostas-camara.md), [ficha da fonte](FONTE-CAMARA.md) e [validação da feature](VALIDACAO-PROPOSTAS.md).

## Senadores em exercício — MOD-47

Após atualizar o código, aplique a migration antes de iniciar web/worker:

```sh
bun install --frozen-lockfile
bun run db:migrate
bun run worker -- --source=senado --resource=senators --limit=3
bun run test:source:senado   # opt-in: valida o recurso oficial inteiro, sem persistir
bun run test:worker:shutdown -- --source=senado # opt-in: testa cancelamento oficial
# Para importar a lista observada, dentro do teto de 100 registros:
bun run worker -- --source=senado --resource=senators --limit=100
bun run dev:real
```

O Senado usa JSON com `Accept: application/json`, serviço v4, sem paginação. Não passe opções de páginas, ano ou filtros de propostas nesse comando: são rejeitadas. O limite padrão é três; cada chamada consulta o recurso completo e publica somente até o limite solicitado. `available` informa quantos registros a fonte retornou; `coverage=partial` indica truncamento local e `observed-list` indica que toda aquela resposta foi persistida. Nenhum desses estados garante atualização contínua ou cobertura histórica. `checkpoint=1` só é gravado quando toda a resposta foi persistida; não há retomada automática.

A identidade usa `senado:senadores:<CodigoParlamentar>`, sem união por número/nome com a Câmara. Pessoa e mandato usam códigos distintos. Participação (titular/suplente), legislaturas e períodos de exercício do mandato são preservados no perfil/REST em `senateMandate`. A situação é uma observação de presença na lista de pessoas em exercício no momento da coleta; não é uma inferência a partir do fim ausente de um período. Datas legais informadas pelo Senado continuam separadas da coleta. Ausência posterior não remove nem desativa registros automaticamente.

O catálogo permite busca por nome/UF e paginação nas duas Casas. Filtros por Casa/partido/período pertencem à MOD-48; o histórico completo e as filiações temporais, à MOD-50. Matérias, votações e despesas do Senado continuam sem integração. URLs oficiais HTTP/HTTPS são mantidas como retornadas, com host/caminho/identidade validados; falha do retrato mantém iniciais acessíveis. As fotos não são baixadas nem armazenadas. Ficha, termos e limites em [FONTE-SENADO.md](FONTE-SENADO.md), decisão em [ADR 007](decisions/007-senadores-atuais.md).

## Autenticação e acompanhamento

Com `DEMO_MODE=false`, abra `/meu-brasil` e crie uma conta **local**. Senha mínima de 10 caracteres. Confirmação de e-mail está desativada apenas no Supabase local; não há envio externo. A partir de um perfil oficial, entre e use “Seguir representante” / “Deixar de seguir”. A lista pessoal mostra nomes e links dos perfis.

Cada leitura/mutação pessoal autentica no servidor com Supabase `getUser()`. A identidade nunca vem de um `userId` livre. O cliente Supabase carrega o JWT do usuário e RLS; Drizzle não acessa follows. UPDATE não é concedido na tabela pessoal, impedindo reatribuição de proprietário. As respostas privadas são `private, no-store`, sem cache compartilhado; logout limpa as consultas privadas do navegador.

O frontend usa cookies HttpOnly; REST também aceita `Authorization: Bearer <access_token>`. Mutações por cookie exigem Origin igual a `VITE_APP_URL`. Não há CORS aberto nem autenticação fictícia na demo. Tokens, senhas e escolhas de acompanhamento não são enviados para analytics ou logs.

## Comandos e checks

```sh
bun run build                    # Vite com Bun + inspeção de bundle público
bun run start                    # servidor de produção Bun; build precisa existir
bun run typecheck                # TypeScript estrito em todos os pacotes, scripts e testes
bun run lint                     # Biome
bun run test                     # Vitest; integração local fica opt-in
bun run test:integration          # PostgreSQL/Auth/RLS com dois usuários temporários
bun --bun playwright install chromium
bun run test:e2e                  # demo; desktop e mobile
E2E_INTEGRATION=1 bun run test:e2e # integração local; desktop e mobile
E2E_PRODUCTION=1 bun run test:e2e # demo no servidor do build
E2E_PRODUCTION=1 E2E_INTEGRATION=1 bun run test:e2e
bun run check:boundaries          # introduz import proibido temporário e exige falha de build
bun run build                    # recompõe build e rotas após o teste negativo
```

Em checkout limpo, execute `build` antes de `typecheck`, porque Start gera `routeTree.gen.ts`. A suíte Playwright inicia e encerra seu próprio servidor; libere a porta 3000 antes. `E2E_BASE_URL=http://localhost:3000` permite testar um servidor já iniciado. Testes autenticados não gravam traces com tokens. Usuários temporários são removidos após a suíte.

O CI fixa Bun 1.4.3, usa `bun install --frozen-lockfile`, executa build/typecheck/lint/Vitest e Playwright. Um segundo job inicia Supabase local e testa Auth/RLS usando fixtures, sem acessar APIs legislativas. Os jobs públicos e de integração foram executados no GitHub; consulte os checks do commit atual no PR para o resultado vigente.

Resultados da revisão de fotos estão em [docs/VALIDACAO-PR6-REVISAO.md](VALIDACAO-PR6-REVISAO.md); da atualização de runtime, em [docs/VALIDACAO-PR5-REVISAO.md](VALIDACAO-PR5-REVISAO.md). Resultados da fundação estão em [docs/VALIDACAO.md](VALIDACAO.md); checks da feature em [docs/VALIDACAO-PROPOSTAS.md](VALIDACAO-PROPOSTAS.md). Versões efetivamente instaladas estão em [docs/VERSOES.md](VERSOES.md).

## Landing e plataforma

A apresentação pública usa `MarketingShell` em `/`; a plataforma usa `Shell` no layout sem segmento `_app`. `/app` é a tela Explorar. `/representantes`, `/representantes/:id`, `/participe`, `/meu-brasil` e as páginas de integrações pendentes conservam suas URLs. Os layouts compartilham marca, tema e componentes, mas têm navegação e hierarquia próprias. Não há um segundo deploy ou pacote de frontend. A composição e as referências estão no [ADR 004](decisions/004-landing-e-app.md).

## Estrutura e fronteiras

```text
apps/web          React, SSR, TanStack Router, server functions e REST /api/v1
apps/worker       ingestão manual/local da Câmara e Senado, encerramento controlado
packages/domain   entidades, portas e casos de uso, sem framework/banco
packages/contracts validação Zod e tipos públicos
packages/db       schema Drizzle, repositórios e tipo da Data API pessoal
packages/source-camara cliente oficial, schemas externos e normalização
packages/source-senado lista oficial v4 de senadores em exercício, schemas e normalização
packages/ui       Button, Badge, Avatar, Field, Input, Select, NativeSelect (fallback), Empty e Separator; shadcn/ui
packages/config   TypeScript estrito compartilhado
supabase          configuração, migrations SQL e referência ao seed determinístico
scripts           configuração local, seed, checks e inspeção do bundle
tests             fixtures pequenas, Vitest e Playwright
docs              planejamento completo, decisões e resultados
```

Recursos do Senado além dos senadores em exercício e os dados do TSE permanecem planejados em `docs/RECURSOS.md`. Não há `apps/api` separado.

`civic` contém pessoas, mandatos, filiações observadas e contatos. `internal` contém snapshots, observações e sync runs. Somente `public.followed_people` fica exposta pela Data API, com grants explícitos/RLS. Os papéis SQL não têm bypassrls: web lê `civic`; ingestão escreve `civic/internal`; administração de migrations é separada. PostgreSQL direto usa postgres.js com `prepare:false`, pool máximo 3, conexão local testada. Poolers/hospedagem remotos permanecem sem validação.

Arquivos `.server.ts` têm marcador server-only; a proteção de imports cobre o workspace e foi testada por import de banco através de `packages/ui`. O build também procura marcadores e valores de segredos configurados nos arquivos públicos. QueryClient é criado por requisição SSR.

## REST implementado

| Método e caminho | Comportamento |
| --- | --- |
| `GET /api/v1/representatives` | `name`, `uf`, `page`, `pageSize`; padrão 24 e máximo 50 itens; `{items,total,page,pageSize,pages}`. |
| `GET /api/v1/people/:id` | DTO público de perfil; UUID válido e 404 para pessoa ausente. |
| `GET /api/v1/proposals` | `type`, `number`, `year`, `authorId`, `page`, `pageSize`; catálogo local parcial. |
| `GET /api/v1/proposals/:id` | Detalhe, autores e eventos de tramitação; UUID estável e 404 para registro não importado. |
| `GET /api/v1/me/follows` | IDs dos follows do usuário autenticado. |
| `PUT /api/v1/me/follows/people/:id` | Follow idempotente de pessoa existente no catálogo. |
| `DELETE /api/v1/me/follows/people/:id` | Remove apenas follow do usuário autenticado. |

Erros REST: `{error:{code,message,requestId}}`, status 400/401/403/404/503 conforme o caso. O schema inicial está em [docs/openapi.json](openapi.json). A política de abertura pública/limites de produção permanece pendente.

## Proveniência e limites

Cada perfil identifica fonte, ID externo, link oficial e coleta. A data de coleta não é data de atualização legislativa. Não são importados mandatos históricos, comissões, votos, despesas ou candidaturas. A coleta atual de deputados foi ampliada; as propostas continuam uma amostra parcial. Ausência no catálogo não comprova ausência na fonte.

A Câmara retorna CPF no detalhe. O adapter remove esse campo antes de persistir, mantendo os demais dados, hash original, hash armazenado e lista de campos removidos. Cada coleta mantém sua observação; quando minimizado, o corpo não é prometido como bytes idênticos do transporte. Filiação registra períodos **de observação**, sem inventar datas legais. Dados ausentes conservam “não informado”, “não coletado” ou “não se aplica”.

O alvo de produção validado é o processo Bun local usando o build Start. `Dockerfile` fixa Bun 1.4.3, mas a imagem e um provedor remoto não foram validados. Nenhum deploy, serviço pago, conta externa ou agendamento remoto foi configurado. Para produção serão necessárias decisões sobre domínio, credenciais/papéis, e-mail, recuperação/exclusão de conta, retenção, orçamento e operação.

Veja [AGENTS.md](../AGENTS.md), [ADR 001](decisions/001-bun-e-fundacao-local.md) e os três documentos de planejamento antes de mudanças relevantes.

## Separação institucional e consulta — MOD-44

A home `/` apresenta propósito, fontes e cobertura com ação **Explorar a plataforma** para `/app`. Sua seção de fontes distingue personagens fictícios da demo e catálogo local da Câmara com importação limitada, sem prometer atualização automática ou cobertura completa. Canais de participação são acessados nos portais oficiais. Propostas da Câmara têm catálogo e tramitações parciais; votações, matérias do Senado, despesas e eleições permanecem sem integração.

Os seletores de UF de `/app` e `/representantes` usam o Select do shadcn/Radix, com menu nas cores do tema, teclado, rolagem e opção “Todas as UFs”. O filtro continua no URL e o envio mantém `pageSize`. Sem JavaScript, o formulário usa um select nativo como fallback.

O layout `_app` preserva as URLs públicas e não exige conta para consultar. `/meu-brasil` explica que login serve para salvar acompanhamentos e permite continuar sem conta; a demo mantém a conta indisponível. A implementação foi integrada pelo PR #4, sem duplicar a separação existente. Veja [ADR 004](decisions/004-landing-e-app.md) e [validação](VALIDACAO-MOD-44.md).

## Revisão do PR 4

O catálogo de propostas e seus detalhes compartilham o layout da plataforma, preservando as URLs públicas e a autoria por ID oficial. O diretório mantém partido em desktop/celular; a escolha manual de tema sobrevive à navegação entre landing e app quando o armazenamento está bloqueado. Decisões em [ADR 005](decisions/005-integracao-e-revisao-pr-4.md), resultados em [validação do PR 4](VALIDACAO-PR4-REVISAO.md).

## Continuar em outra máquina

Instale Git, Bun 1.4.3 e, para o modo integrado, Docker Desktop. Selecione a branch da feature com `git switch nome-da-branch` antes de instalar as dependências; PRs abertos não estão automaticamente em `main`. Recrie o `.env` com o fluxo local acima e repita somente as coletas necessárias. Clone, seed fictício, recoleta e restauração de backup são operações distintas.

As quatro skills locais estão versionadas em `.agents/skills/`, junto de `skills-lock.json` na raiz. Um clone traz os arquivos sem reinstalação; mantenha suas referências, licenças e arquivos auxiliares. A origem das três entradas do lock e a exceção histórica de `frontend-skill` estão descritas nas seções de skills acima. Configurações pessoais e credenciais da ferramenta de desenvolvimento são configuradas separadamente na outra máquina.
