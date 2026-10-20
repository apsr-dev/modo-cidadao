# Plataforma cívica

Fundação local de uma plataforma brasileira de cidadania. O nome é provisório e configurável. O diretório existente `modo-cidadao` foi preservado. Os três documentos em `docs/` continuam descrevendo o produto completo; este README descreve a implementação atual.

## O que funciona

- Web React/TanStack Start com SSR, metadados, rotas públicas, estados vazio/erro/404 e navegação responsiva.
- Diretório e perfil de representantes da Câmara, busca por nome sem acentos, filtro por UF, paginação e contatos retornados pela fonte. A coleta local foi ampliada para 513 deputados em exercício em 07/10/2026.
- Propostas da Câmara: catálogo com tipo/número/ano/autor, paginação, detalhe com ementa e documentos oficiais, autoria/coautoria e linha do tempo de tramitação. O perfil mostra propostas importadas vinculadas por ID oficial.
- Server functions e REST `/api/v1` usam os mesmos casos de uso; o navegador não chama a API da Câmara.
- Worker Bun manual/local: lista limitada → detalhe oficial → RAW minimizado e hashes → normalização → PostgreSQL → catálogo. Reexecução não duplica pessoas nem filiação inalterada. Coletas continuam criando observações.
- Supabase Auth local por e-mail/senha, cookies SSR HttpOnly e seguir/deixar de seguir. Follows privados por RLS; isolamento entre dois usuários testado no banco e no REST.
- Modo demo explícito com 12 personagens e oito propostas fictícias, incluindo tramitações, e o mesmo seed determinístico. Auth/follows ficam indisponíveis nesse modo.
- Participação abre os portais institucionais verificados da Câmara e do Senado.

Votações, eleições e a integração de dados do Senado/TSE exibem indisponibilidade honesta. O catálogo de propostas é parcial e não representa toda a atuação de cada parlamentar. Feed, alertas, despesas, recuperação de senha, exportação/exclusão de conta, PWA e resumos de IA permanecem planejados. Esta inicialização não é uma operação pública completa.

## Requisitos e início

Bun **1.4.2** é o único runtime JavaScript da aplicação/worker e gerenciador de pacotes. Nesta máquina ele foi instalado no projeto, sem alterar o perfil do shell:

```sh
cd /Users/Samuel.Reichert/Samuel/modo-cidadao
export PATH="$PWD/.tools/bun-darwin-aarch64:$PATH"
bun --version
bun install --frozen-lockfile
bun run dev
```

Abra **http://localhost:3000**. Em outro terminal, repita o `export PATH` antes dos comandos. Em um clone novo, instale Bun 1.4.2 pelo [instalador oficial](https://bun.com/docs/installation); `.tools/` não é versionado. Node.js está instalado na máquina, mas os comandos da aplicação, Vitest e Playwright foram executados com Bun. Turborepo/Biome/CLI e serviços Docker usam seus próprios binários.

A web executa em demo quando não há `.env`. Se criar configuração manualmente, copie `.env.example` para `.env` e mantenha `DEMO_MODE=true` até configurar o banco. As variáveis privadas e públicas são validadas separadamente. Nunca prefixe credenciais com `VITE_`.

## Banco local e dados oficiais

É necessário Docker Desktop em execução. Não há projeto Supabase remoto configurado.

```sh
bun run db:start
bun run db:env
bun run db:seed
bun run db:check
bun run worker -- --source=camara --max-pages=1 --page-size=3 --limit=3
DEMO_MODE=false bun run dev
```

`db:start` suprime a saída de credenciais da CLI. `db:env` lê o status local, gera senhas para os papéis `civica_reader` e `civica_ingest`, grava `.env` com permissão 0600 e preserva nome/URL/mode existentes. Execute após `db:start` ou `db:reset`; se já houver um processo web ativo, reinicie após trocar as senhas. Neste ambiente o banco já foi iniciado, as migrations aplicadas, o seed carregado e 513 deputados e três propostas oficiais importados; `.env` foi deixado com `DEMO_MODE=false` para usar essa integração.

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

Horários sem fuso são preservados, sem conversão para UTC. A situação não é traduzida para “virou lei”. PDFs permanecem como links; votos, resumos, relatorias, comparação pública de versões e follows de propostas ainda não estão implementados. Veja [ADR 002](docs/decisions/002-propostas-camara.md), [ficha da fonte](docs/FONTE-CAMARA.md) e [validação da feature](docs/VALIDACAO-PROPOSTAS.md).

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

O CI fixa Bun 1.4.2, usa `bun install --frozen-lockfile`, executa build/typecheck/lint/Vitest e Playwright. Um segundo job inicia Supabase local e testa Auth/RLS usando fixtures, sem acessar APIs legislativas. O workflow foi criado; sua execução no GitHub ainda não ocorreu.

Resultados da fundação estão em [docs/VALIDACAO.md](docs/VALIDACAO.md); checks da feature em [docs/VALIDACAO-PROPOSTAS.md](docs/VALIDACAO-PROPOSTAS.md). Versões efetivamente instaladas estão em [docs/VERSOES.md](docs/VERSOES.md).

## Estrutura e fronteiras

```text
apps/web          React, SSR, TanStack Router, server functions e REST /api/v1
apps/worker       ingestão manual/local da Câmara e encerramento controlado
packages/domain   entidades, portas e casos de uso, sem framework/banco
packages/contracts validação Zod e tipos públicos
packages/db       schema Drizzle, repositórios e tipo da Data API pessoal
packages/source-camara cliente oficial, schemas externos e normalização
packages/ui       Button e Badge compartilhados; padrão shadcn/ui
packages/config   TypeScript estrito compartilhado
supabase          configuração, migrations SQL e referência ao seed determinístico
scripts           configuração local, seed, checks e inspeção do bundle
tests             fixtures pequenas, Vitest e Playwright
docs              planejamento completo, decisões e resultados
```

Senado e TSE permanecem limites documentados em `docs/RECURSOS.md`, sem pacotes/implementações vazios. Não há `apps/api` separado.

`civic` contém pessoas, mandatos, filiações observadas e contatos. `internal` contém snapshots, observações e sync runs. Somente `public.followed_people` fica exposta pela Data API, com grants explícitos/RLS. Os papéis SQL não têm bypassrls: web lê `civic`; ingestão escreve `civic/internal`; administração de migrations é separada. PostgreSQL direto usa postgres.js com `prepare:false`, pool máximo 3, conexão local testada. Poolers/hospedagem remotos permanecem sem validação.

Arquivos `.server.ts` têm marcador server-only; a proteção de imports cobre o workspace e foi testada por import de banco através de `packages/ui`. O build também procura marcadores e valores de segredos configurados nos arquivos públicos. QueryClient é criado por requisição SSR.

## REST implementado

| Método e caminho | Comportamento |
| --- | --- |
| `GET /api/v1/representatives` | `name`, `uf`, `page`, `pageSize`; máximo 50 itens; `{items,total,page,pageSize,pages}`. |
| `GET /api/v1/people/:id` | DTO público de perfil; UUID válido e 404 para pessoa ausente. |
| `GET /api/v1/proposals` | `type`, `number`, `year`, `authorId`, `page`, `pageSize`; catálogo local parcial. |
| `GET /api/v1/proposals/:id` | Detalhe, autores e eventos de tramitação; UUID estável e 404 para registro não importado. |
| `GET /api/v1/me/follows` | IDs dos follows do usuário autenticado. |
| `PUT /api/v1/me/follows/people/:id` | Follow idempotente de pessoa existente no catálogo. |
| `DELETE /api/v1/me/follows/people/:id` | Remove apenas follow do usuário autenticado. |

Erros REST: `{error:{code,message,requestId}}`, status 400/401/403/404/503 conforme o caso. O schema inicial está em [docs/openapi.json](docs/openapi.json). A política de abertura pública/limites de produção permanece pendente.

## Proveniência e limites

Cada perfil identifica fonte, ID externo, link oficial e coleta. A data de coleta não é data de atualização legislativa. Não são importados mandatos históricos, comissões, votos, despesas ou candidaturas. A coleta atual de deputados foi ampliada; as propostas continuam uma amostra parcial. Ausência no catálogo não comprova ausência na fonte.

A Câmara retorna CPF no detalhe. O adapter remove esse campo antes de persistir, mantendo os demais dados, hash original, hash armazenado e lista de campos removidos. Cada coleta mantém sua observação; quando minimizado, o corpo não é prometido como bytes idênticos do transporte. Filiação registra períodos **de observação**, sem inventar datas legais. Dados ausentes conservam “não informado”, “não coletado” ou “não se aplica”.

O alvo de produção validado é o processo Bun local usando o build Start. `Dockerfile` fixa Bun 1.4.2, mas a imagem e um provedor remoto não foram validados. Nenhum deploy, serviço pago, conta externa ou agendamento remoto foi configurado. Para produção serão necessárias decisões sobre domínio, credenciais/papéis, e-mail, recuperação/exclusão de conta, retenção, orçamento e operação.

Veja [AGENTS.md](AGENTS.md), [ADR 001](docs/decisions/001-bun-e-fundacao-local.md) e os três documentos de planejamento antes de mudanças relevantes.
