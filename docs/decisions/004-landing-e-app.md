# ADR 004 — Landing e plataforma com layouts próprios

Data: 09/10/2026. Status: aceito por implementação solicitada no PR 4.

## Composição

A apresentação usa fotografia real do Congresso, tipografia ampla e seções editoriais sem mosaico de cards. O app usa superfícies calmas, navegação persistente, listas legíveis e uma coluna de contexto. O tema tweakcn enviado pelo usuário continua sendo a fonte dos tokens claros e escuros.

A landing apresenta a marca, explica o acesso à informação, oferece caminhos de consulta e termina com entrada na plataforma. Sua imagem ocupa toda a largura, enquanto os textos e ações têm alinhamento próprio. O app começa pela consulta de representantes por UF, indica a ordenação do catálogo e oferece os canais institucionais. Não apresenta números de cobertura, dados pessoais ou integrações fictícias.

A entrada do hero tem uma sequência curta; âncoras deslocam a página suavemente; setas e botões têm resposta discreta ao hover e ao toque. `prefers-reduced-motion` remove os movimentos. Navegação mobile funciona como uma expansão do menu, com Escape devolvendo o foco ao botão.

## Referências consultadas no Mobbin

- [Titan, seção de landing](https://mobbin.com/explore/sections/5e0d4910-5a39-4fa3-ae69-df856ef207a9): escala da marca, contraste, respiro e arquitetura como âncora visual.
- [Front, workspace web](https://mobbin.com/explore/screens/3e29dd35-0c1d-4f71-831b-af35c13bf1ec): navegação lateral clara, regiões separadas por divisores e conteúdo em linhas com contexto secundário.

As referências foram inspecionadas no navegador. O plugin Mobbin conectado não expôs ferramentas MCP na sessão de implementação. Nenhum screenshot ou asset de produto do Mobbin foi incorporado ao código.

## Organização de rotas

`/` usa `MarketingShell`. O layout `_app` do TanStack Router é sem segmento: agrupa a plataforma sem mudar URLs públicas. `/app` é o início do app; representantes, perfis, participação e área pessoal preservam os endereços existentes. Metadados, loaders SSR, funções de servidor, REST e contratos continuam no mesmo monólito. Não há outro deploy, domínio ou autenticação para a landing.

Ao incorporar PRs de funcionalidades ainda abertos, suas rotas de interface devem passar para `_app.*`, preservando o caminho público. Este PR não combina entregas independentes nem altera dados legislativos, ingestão, autenticação ou acompanhamento.

## Fotografia e licença

`apps/web/public/images/congresso-nacional.jpg`: Carlos Moura / Agência Senado, 22/07/2025, [original e evidência da licença](https://commons.wikimedia.org/wiki/File:Imagens_de_Bras%C3%ADlia_-_Pal%C3%A1cio_do_Congresso_Nacional_(54672677055).jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). O arquivo original permanece sob essa licença; a exibição usa recorte e sobreposição de contraste. Crédito, licença e indicação dessas alterações aparecem na landing. A imagem é servida localmente, sem chamada a uma CDN de terceiros.

## Componentes e limites

`packages/ui` recebe Field, Input, NativeSelect, Empty e Separator do registro oficial shadcn, com imports adaptados ao workspace. O utilitário `cn` é compartilhado; não foi adicionada biblioteca de animação. Fontes continuam locais. O nome permanece configurável por `VITE_APP_NAME`.

Esta é uma mudança de interface sobre a cobertura existente do PR 4. Propostas, votações, Senado e eleições continuam com seus estados de integração pendente nesta branch. A demo continua declarando personagens fictícios e desabilitando autenticação. O Linear segue como única fonte de backlog.

## Complemento — MOD-44

A tarefa F-01.02 foi concluída sobre a separação já existente nesta branch e no PR #4, evitando duas implementações concorrentes da mesma mudança. A home lê o modo público do loader raiz para explicar fontes e cobertura antes de entrar no catálogo, sem consultar dados pessoais ou duplicar acesso ao banco. A apresentação descreve somente a cobertura implementada nesta branch; integração de propostas pertence ao PR #1.

A área pessoal oferece saída para o catálogo sem conta e explica que autenticação serve à persistência. Autorização continua em cada operação privada no servidor, com as políticas de cache e RLS existentes. Testes de navegador verificam home, URLs públicas e entrada da conta em demo e integração local.
