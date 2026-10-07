# Recursos, APIs e fontes oficiais — Plataforma cívica

Data da consulta documental: **06/10/2026**.

Responsabilidade deste arquivo: indicar **onde obter os dados e a documentação**, como cada recurso se conecta ao produto e o que validar antes de implementar. Escopo funcional: [PLANEJAMENTO-FEATURES.md](PLANEJAMENTO-FEATURES.md). Arquitetura: [PLANEJAMENTO-TECNICO.md](PLANEJAMENTO-TECNICO.md).

## 1. Como interpretar este catálogo

- **API/dataset:** fonte para importação e armazenamento no nosso sistema.
- **Portal oficial:** local para conferir fatos, documentos ou executar uma ação pelo próprio cidadão.
- **Documentação técnica:** referência de implementação, não fonte de dados políticos.
- **Complementar:** recurso que só entra em integração quando houver caso de uso e cobertura definidos.

Os portais e documentos centrais foram consultados; **não foi executada uma bateria de testes dos endpoints nem validado todo o schema de respostas**. Algumas interfaces dependem de JavaScript, e a leitura de respostas XML/JSON e de certos portais não ficou disponível na ferramenta de consulta. URLs-base e caminhos abaixo orientam adapters; disponibilidade, parâmetros, limites e payloads precisam de verificação por HTTP no ambiente de implementação.

Uma API pública de consulta não implica API de escrita/participação. Não inventar endpoints para votar em enquete, apoiar ideia, mandar pergunta ou enviar mensagem. A integração padrão desses fluxos é o link oficial verificado.

## 2. Mapa de responsabilidade dos dados

| Necessidade | Fonte primária | Forma de uso |
| --- | --- | --- |
| Deputados, proposições, tramitações, votações e órgãos da Câmara | Dados Abertos da Câmara | Adapter de consulta + RAW + normalização. |
| Senadores, matérias, plenário e comissões | Dados Abertos Legislativos do Senado | Adapter separado, preservando o modelo próprio da instituição. |
| Despesas/cotas da Câmara | Dados Abertos da Câmara | Importação de registros financeiros, com regime explícito. |
| Cotas e dados administrativos de senadores | Dados Abertos Administrativos do Senado | Adapter administrativo distinto do legislativo. |
| Candidaturas, bens declarados e informações eleitorais | Portal de Dados Abertos do TSE | Datasets por eleição/recurso e dicionários de campos. |
| Resultado eleitoral | Dataset específico de resultados do TSE | Integração própria; cadastro de candidatos não comprova eleição. |
| Contatos | Perfis institucionais de Câmara/Senado; dados eleitorais quando apropriado | Canal e origem identificados; prioridade ao contato institucional para mandato atual. |
| Enquetes/debates | Participe da Câmara | Acesso pelo cidadão no portal oficial. |
| Ideias/consultas/eventos interativos | e-Cidadania do Senado | Acesso pelo cidadão no portal oficial. |
| UF e códigos territoriais | IBGE Localidades | Taxonomia geográfica de referência. |
| Texto de norma vigente | Planalto e fontes legislativas oficiais | Evidência complementar para contextualização/resumo. |
| Fiscalização federal complementar | Portal da Transparência e Fala.BR | Dados adicionais ou encaminhamento, conforme competência. |

## 3. Câmara dos Deputados

### Entradas oficiais

- [Portal de Dados Abertos](https://dadosabertos.camara.leg.br/).
- [Documentação da API e arquivos](https://dadosabertos.camara.leg.br/swagger/api.html).
- [Arquivos para download](https://dadosabertos.camara.leg.br/swagger/api.html?tab=staticfile).
- [Tutoriais e interpretação](https://dadosabertos.camara.leg.br/howtouse/central-tutoriais.html).
- [Guia sobre votações](https://dadosabertos.camara.leg.br/howtouse/2020-02-07-dados-votacoes.html).
- [Alterações na API](https://dadosabertos.camara.leg.br/news/noticias.html).
- [Diretório de deputados](https://www.camara.leg.br/deputados/quem-sao).

Base de referência: `https://dadosabertos.camara.leg.br/api/v2`.

### Rotas para mapear ao domínio

Tabela de consulta para o adapter; confirmar os contratos na documentação vigente antes de usar. Os placeholders não são links para IDs reais.

| Caminho relativo | Entidade/uso interno |
| --- | --- |
| `/deputados` e `/deputados/{id}` | Pessoas, representação e contatos disponíveis. |
| `/deputados/{id}/historico` | Períodos/alterações de exercício. |
| `/deputados/{id}/despesas` | Despesas parlamentares. |
| `/deputados/{id}/orgaos` | Participação em órgãos. |
| `/partidos` e `/partidos/{id}` | Partidos. |
| `/partidos/{id}/membros` | Composição conforme período suportado. |
| `/legislaturas` | Referência temporal. |
| `/proposicoes` e `/proposicoes/{id}` | Registros legislativos. |
| `/proposicoes/{id}/autores` | Autoria e coautoria. |
| `/proposicoes/{id}/temas` | Classificação temática. |
| `/proposicoes/{id}/tramitacoes` | Histórico. |
| `/proposicoes/{id}/relacionadas` | Relações entre documentos. |
| `/proposicoes/{id}/votacoes` | Decisões vinculadas. |
| `/votacoes` e `/votacoes/{id}` | Votação/resultado. |
| `/votacoes/{id}/votos` | Registro individual nominal. |
| `/votacoes/{id}/orientacoes` | Orientação de bancada. |
| `/orgaos` e `/orgaos/{id}/membros` | Órgãos e composição. |
| `/eventos` e `/eventos/{id}/pauta` | Agenda e pauta. |
| `/referencias` e recursos subordinados | Códigos/tipos para normalização. |

### Validações do adapter

Paginação completa, filtros/ordenadores documentados, códigos originais, datas com precisão, URLs oficiais retornadas, vínculos de objetos acessórios e retificações. Não inferir votos individuais em votação simbólica nem presença a partir da ausência de voto. Listagem de votação não é um serviço de acompanhamento de voto em andamento.

O diretório de deputados, os tutoriais e a documentação são fontes distintas de evidência; uma descrição reduzida na lista não substitui o detalhe ou o documento oficial. Usar arquivos em lote para histórico só após conferir cobertura e layout.

## 4. Senado Federal: separar legislativo e administrativo

### Catálogo e documentação

- [Catálogo geral de dados abertos](https://www12.senado.leg.br/dados-abertos).
- [Catálogo legislativo](https://www12.senado.leg.br/dados-abertos/legislativo).
- [Swagger legislativo](https://legis.senado.leg.br/dadosabertos/api-docs/swagger-ui/index.html).
- [Senadores — legislativo](https://www12.senado.leg.br/dados-abertos/conjuntos?grupo=senadores&portal=Legislativo).
- [Projetos e matérias](https://www12.senado.leg.br/dados-abertos/conjuntos?grupo=projetos-e-materias&portal=legislativo).
- [Plenário e votações](https://www12.senado.leg.br/dados-abertos/conjuntos?grupo=plenario&portal=Legislativo).
- [Comissões](https://www12.senado.leg.br/dados-abertos/conjuntos?grupo=comissoes&portal=Legislativo).
- [Pesquisa oficial de senadores](https://www25.senado.leg.br/web/senadores/).

Base legislativa de referência: `https://legis.senado.leg.br/dadosabertos`.

Exemplo de recurso conhecido para conferir no ambiente de implementação: [senadores atuais](https://legis.senado.leg.br/dadosabertos/senador/lista/atual). A consulta nesta elaboração encontrou resposta XML que não pôde ser interpretada pela ferramenta; portanto, o payload não foi validado. Não presumir formato JSON em todos os recursos.

Obter no Swagger/catálogo os endpoints específicos de matéria, autoria, tramitação, votação e composição. Não copiar caminhos da Câmara para o Senado.

### Despesas e administração

- [Senadores — dados administrativos, incluindo CEAPS](https://www12.senado.leg.br/dados-abertos/conjuntos?grupo=senadores&portal=Administrativo).
- [Swagger administrativo apontado pelo catálogo](https://adm.senado.gov.br/adm-dadosabertos/swagger-ui/index.html?configUrl=/adm-dadosabertos/swagger-config.json).

O catálogo administrativo é a entrada para cotas e outros conjuntos. Não somar todos os benefícios disponíveis por padrão; selecionar o regime que atende à funcionalidade e registrar categoria, período e cobertura.

### Validações do adapter

ID de parlamentar versus ID de matéria; formato retornado e versões de serviços; titular/suplente e períodos; objetos de votação; vínculos de tramitação entre Casas; calendário dos datasets administrativos. Guardar payload original antes de converter XML/CSV para o modelo interno.

## 5. TSE: informações eleitorais

- [Portal de Dados Abertos](https://dadosabertos.tse.jus.br/).
- [Grupo de candidatos](https://dadosabertos.tse.jus.br/group/candidatos).
- [Candidatos — 2026](https://dadosabertos.tse.jus.br/dataset/candidatos-2026).
- [DivulgaCandContas](https://divulgacandcontas.tse.jus.br/divulga/): consulta oficial; a aplicação não pôde ser lida pela ferramenta nesta elaboração.

O dataset de 2026 consultado lista candidatos, informações complementares, bens, coligações, vagas, redes sociais, histórico, fotos e propostas de governo. Recursos e cobertura variam por cargo/UF. Não pressupor plano de governo para todos os cargos nem tratar declaração de bens como patrimônio atualizado em tempo real.

Importar pelo recurso anunciado no catálogo e pelo dicionário correspondente. URLs de ZIP/CSV não devem ser deduzidas apenas trocando o ano. Para eleição passada, resolver o dataset específico; para resultados ou prestação de contas, resolver o grupo/recurso próprio no portal, sem reaproveitar o contrato de candidaturas.

### Validações do adapter

Encoding, delimitador, aspas, números decimais, valores nulos/códigos sentinela, ZIP com múltiplos arquivos, tamanho completo, retificações e identidade de candidato por eleição. Processar grandes arquivos em streaming/lotes, não apenas carregá-los inteiros em memória.

Não vincular candidatura e mandato exclusivamente por nome ou número de urna. Não redistribuir CPF e outras informações pessoais que não sejam necessárias ao produto só porque apareceram no arquivo de origem.

## 6. Participação oficial

### Câmara

- [Participe / e-Democracia](https://www.camara.leg.br/participe).

Entrada para enquetes e debates interativos. Descobrir os links específicos a partir da página oficial da proposta/evento, conservar a versão consultada e verificar o destino. Enquete não equivale a resultado de pesquisa representativa nem votação parlamentar.

### Senado/e-Cidadania

- [Sobre o portal](https://www12.senado.leg.br/ecidadania/sobre).
- [Ideias legislativas](https://www12.senado.leg.br/ecidadania/principalideia).
- [Consultas públicas](https://www12.senado.leg.br/ecidadania/principalmateria).
- [Eventos interativos](https://www12.senado.leg.br/ecidadania/principalaudiencia).
- [Termos de uso](https://www12.senado.leg.br/ecidadania/termo).

As páginas definem a finalidade e as regras dos mecanismos. Quando o produto explicar prazo, número de apoios ou requisitos, registrar a fonte e revisá-los periodicamente. Cumprir requisito de apoio não equivale a lei aprovada.

**Contrato do nosso software:** armazenar canal/URL, instituição, vínculo verificado, prazo quando houver, status e data de verificação. O cidadão realiza a ação no site oficial. Não armazenar senha externa, simular login gov.br nem afirmar conclusão a partir de um clique.

## 7. Fiscalização complementar e legislação

| Recurso | Link oficial | Aplicação no produto |
| --- | --- | --- |
| Portal da Transparência | [API de dados](https://portaldatransparencia.gov.br/api-de-dados) | Dados federais complementares quando definidos; não substitui despesas das Casas. |
| Credencial da API de transparência | [Cadastro de e-mail](https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email) | A documentação da API exige token; obtenção pelo responsável e uso somente no servidor. |
| Fala.BR | [Portal oficial](https://falabr.cgu.gov.br/web/home) | Encaminhamento de manifestação/acesso à informação conforme órgão e competência; interface não foi analisada como API. |
| Constituição Federal | [Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm) | Referência institucional/legal; não hardcode de interpretação. |
| LexML | [Portal](https://www.lexml.gov.br/) e [descrição oficial do acervo/API](https://www12.senado.leg.br/dados-abertos/legislativo/legislacao/acervo-do-portal-lexml) | Localizar documentos e identificadores jurídicos; conferir o documento oficial vinculado. |
| Legislação federal | [Planalto](https://www.planalto.gov.br/) | Resolver texto vigente quando necessário para comparação com proposta. |
| ANPD | [Glossário](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/glossario-anpd) | Referência de privacidade, inclusive definição de dado pessoal sensível. |

Uso complementar não implica nova feature de fiscalização nacional já decidida. Selecionar o dado necessário e registrar limites/credencial/competência. Não confundir atividade legislativa de uma pessoa com orçamento integral do governo federal.

## 8. Geografia

- [Documentação da API de Localidades do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades).
- [Estados](https://servicodados.ibge.gov.br/api/v1/localidades/estados).
- [Municípios](https://servicodados.ibge.gov.br/api/v1/localidades/municipios).

Usar códigos oficiais para jurisdição, UF e município. Obter localidades não significa que conseguimos cobrir todas as câmaras municipais. No produto federal, UF é o filtro central; município é contexto opcional e extensão de modelo.

## 9. Documentação técnica da stack

### TanStack

| Referência | Responsabilidade |
| --- | --- |
| [TanStack Start — visão geral](https://tanstack.com/start/latest/docs/framework/react/overview) | Modelo do framework e documentação vigente. |
| [Inicialização](https://tanstack.com/start/latest/docs/framework/react/getting-started) | Scaffold/CLI atual e exemplos oficiais. |
| [Server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) | Adaptadores tipados do próprio site. |
| [Server routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes) | HTTP externo/REST e integrações. |
| [Modelo de execução](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model) | Fronteira cliente/servidor. |
| [Proteção de imports](https://tanstack.com/start/latest/docs/framework/react/guide/import-protection) | Guardas de build; validar alcance no monorepo e status da API. |
| [Variáveis de ambiente](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables) | Exposição pública versus segredos. |
| [SSR seletivo](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr) | Renderização por rota. |
| [Integração com Query](https://tanstack.com/start/latest/docs/framework/react/guide/tanstack-query) | Cache remoto e hidratação. |
| [Search params](https://tanstack.com/router/latest/docs/guide/search-params) | Filtros tipados no URL. |
| [SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo) | Metadados e indexação. |
| [Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) | Compatibilidade do adapter/alvo de deploy. |

A referência de inicialização consultada aponta para CLI oficial, mas o prompt exige confirmar comandos/versões no momento da execução. Não fixar neste documento o status RC ou major de um framework apenas com base em conversa passada.

### Banco, Auth e integração Supabase

- [Supabase — changelog](https://supabase.com/changelog): conferir mudanças relevantes antes de implementar.
- [Auth no servidor/SSR](https://supabase.com/docs/guides/auth/server-side).
- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [Segurança da Data API](https://supabase.com/docs/guides/api/securing-your-api).
- [Conexões e pooler](https://supabase.com/docs/guides/database/connecting-to-postgres).
- [Desenvolvimento local e CLI](https://supabase.com/docs/guides/local-development).
- [Cron](https://supabase.com/docs/guides/cron).
- [Storage](https://supabase.com/docs/guides/storage).
- [Drizzle ORM](https://orm.drizzle.team/docs/overview).
- [PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html).
- [PostgreSQL `pg_trgm`](https://www.postgresql.org/docs/current/pgtrgm.html).

Usar a versão de documentação correspondente ao PostgreSQL efetivamente provisionado; `/current` não significa a versão do nosso banco. Auth, RLS e SQL direto têm fronteiras distintas descritas no documento técnico.

### UI, workspace, verificação e fornecedores candidatos

| Ferramenta | Documentação | Uso |
| --- | --- | --- |
| shadcn/ui | [TanStack Start](https://ui.shadcn.com/docs/installation/tanstack) | Instalação compatível com a web. |
| Tailwind | [Vite](https://tailwindcss.com/docs/installation/using-vite) | Estilo e tokens. |
| Zod | [Site oficial](https://zod.dev/) | Schemas e validação; consultar API atual ao instalar. |
| Bun 1.4.2 | [Workspaces](https://bun.com/docs/pm/workspaces) e [TanStack Start](https://bun.com/guides/ecosystem/tanstack-start) | Runtime da web/workers e único gerenciador de pacotes. |
| Turborepo | [Política de suporte](https://turborepo.dev/docs/support-policy) | Orquestração de tarefas com Bun workspaces; suporte conferido em 07/10/2026. |
| Vitest | [Guia](https://vitest.dev/guide/) | Testes de regras/adapters. |
| Playwright | [Introdução](https://playwright.dev/docs/intro) | Navegação, SSR e fluxos E2E. |
| WCAG | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Referência de acessibilidade. |
| Resend | [Documentação](https://resend.com/docs/introduction) | Candidato de e-mail; não configurado. |
| Sentry | [Documentação geral](https://docs.sentry.io/) | Candidato de erros; integração atual de Start precisa ser conferida. |

GitHub e destino de hospedagem devem ser configurados pelo responsável no contexto da inicialização/deploy. Este catálogo não contém tokens, projetos já provisionados, links de serviços pagos contratados ou preços presumidos.

## 10. Ficha a manter para cada fonte implementada

Ao transformar um recurso em adapter, registrar junto ao código/documentação:

- ID da fonte e namespace do recurso.
- URL de documentação, base e caminho efetivamente usados.
- Política de autenticação e localização da credencial, quando houver.
- Formato, encoding, paginação e versão/dicionário do schema.
- Significado e escopo do ID externo; precisão de datas e valores.
- Cobertura temporal/territorial e limites conhecidos, com evidência.
- Política de atualização, timeout, retries e reconciliação.
- Termos/licença, atribuição e data de verificação.
- Fixture mínima, comando de teste opt-in e resultado/data da última validação real.
- Mapeamento de campos para domínio e decisões que exigiram interpretação.
- Contato/página oficial para mudanças e problemas da fonte.

Fonte indisponível deve gerar estado operacional verificável. Não completar lacunas com informações de terceiros sem identificá-las nem mostrar a data de uma tentativa falha como última verificação bem-sucedida.

## Atualização de decisão — 07/10/2026

Bun **1.4.2** passa a ser o runtime da web e dos workers e o único gerenciador de pacotes. Workspaces ficam no `package.json`; `bun.lock` é o único lockfile. Vite continua sendo o pipeline de build (`bun --bun vite`), com checagem estática TypeScript separada. Vitest e Playwright permanecem. Consulte [ADR 001](decisions/001-bun-e-fundacao-local.md) e o README para comportamento implementado e validações. O restante do planejamento permanece integral.
