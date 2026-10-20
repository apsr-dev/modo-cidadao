# 005 — Integração da landing com o catálogo e revisão do PR 4

Data: 20/10/2026. Status: aceito.

O PR 4 reorganiza a apresentação e a consulta, enquanto `main` já contém propostas da Câmara e rótulos de representação dos PRs 1 e 2. A integração mantém as rotas públicas e coloca os diretórios, detalhes e área pessoal sob o layout sem segmento `_app`. Não reintroduz o placeholder antigo de propostas.

Cargo, esfera e instituição continuam vindo do mapeamento tipado de `catalog-labels`, e a UF continua identificando representação. No diretório estreito, o partido é exibido junto da identidade em vez de desaparecer com a coluna do desktop. A lista resumida de `/app` também preserva essa informação. Os avisos de demo incluem pessoas, propostas e tramitações fictícias; os textos de cobertura integrada descrevem os catálogos parciais existentes.

A preferência de tema passa a pertencer a um `ThemeProvider` no layout raiz. Ele permanece montado durante navegação entre a apresentação e a plataforma, conservando a escolha manual em memória quando `localStorage` não está disponível. Persistência entre recargas e sincronização entre abas continuam usando armazenamento quando permitido. Estado React é criado por árvore SSR, sem estado mutável compartilhado no servidor. O bootstrap estático continua aplicando o tema antes da pintura.

Os estilos de propostas incorporados de `main` usam os tokens claros/escuros, evitando fundos brancos fixos e o uso de um token de superfície como cor de texto. Loaders, REST, identidade de autores, autenticação, RLS e cadeia de migrations conservam seus contratos. A integração não altera regras de coleta ou de participação.

Testes de regressão cobrem partido/cargo/UF em 320, 800, 1150 e 1280 pixels; tema nas duas direções de navegação com armazenamento bloqueado; layout das propostas; e contraste das ementas/metadados em ambos os temas. Execuções e limites estão em [VALIDACAO-PR4-REVISAO.md](../VALIDACAO-PR4-REVISAO.md).
