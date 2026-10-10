# Validação — refinamento da interface

Data: 10/10/2026. Branch `feat/shadcn-theme`, PR #4.

## Escopo

Dropdowns compartilhados, diretório com 24 itens por página e separação visual nas telas do app. Navegação usa a paleta `sidebar` do tema; conteúdo usa `card`; contexto usa uma combinação de `muted`/`border`. Textos auxiliares ganharam contraste. Identidade do tweakcn, fontes locais e ordenação alfabética permanecem.

## Verificação

- Bun 1.4.2: `bun run check:boundaries` bloqueou o import proibido; `bun run build` passou e inspecionou 20 arquivos públicos.
- `bun run typecheck` e `bun run lint` passaram. Sem avisos novos; permanece a sugestão informativa preexistente em `scripts/local-env.ts`.
- `bun run test`: 9 passaram, 2 integrações opt-in ignoradas.
- `E2E_BASE_URL=http://localhost:3009 bun run test:e2e`: 22 passaram contra o build final; 2 testes de autenticação ignorados na demo.
- `E2E_INTEGRATION=1 E2E_BASE_URL=http://localhost:3008 bun --env-file=<env-local> run test:e2e`: 24 passaram com o banco local, incluindo login, follow, isolamento no REST e logout. Contas temporárias removidas pela suíte.
- Após o ajuste final de largura: `E2E_INTEGRATION=1 E2E_BASE_URL=http://localhost:3008 bun --env-file=<env-local> run test:e2e tests/e2e/redesign.spec.ts tests/e2e/theme.spec.ts`: 18 passaram.
- O teste de contraste agora verifica landing e app, em claro e escuro, exigindo pelo menos 4,5:1 nas amostras de navegação, textos auxiliares e ações.
- Com 513 registros locais: 24 linhas na primeira e na segunda página, total de 22 páginas; filtro SP retorna 70 pessoas, 24 na primeira página e 3 páginas. Aplicar filtro retorna à página 1 e preserva `pageSize=24`. Link de retorno do perfil mantém 24.
- Inspeção visual: desktop de 1440px, celulares de 390px e 320px. Sem overflow horizontal; linhas do app em 320px têm largura de conteúdo igual à área disponível. Dropdowns têm altura de 44px e padding vertical zero; indicação de estado e seta centralizadas.

Uma execução inicial teve timeout no teste de navegação mobile. A reprodução isolada e as execuções completas posteriores passaram, sem relaxar timeouts ou aceitação. O teste mobile do fluxo de descoberta agora usa 320px e verifica o conteúdo de cada linha, evitando que `overflow:hidden` oculte cortes.

## Revisão de design engineering

Modo `full` no escopo acima, com React/TanStack Start, shadcn compartilhado, Tailwind nos componentes e CSS existente na web. A revisão não redesenha a landing nem implementa integrações de dados.

| Categoria | Evidência inspecionada | Resultado |
| --- | --- | --- |
| Tipografia | Texto principal/auxiliar, labels, temas e contraste automatizado | Ajustado e verificado |
| Superfícies | Navegação, filtros, resultados, contexto, perfil e participação; 320–1440px | Ajustado e verificado |
| Animações | Transições existentes de cor/hover; nenhuma nova animação | Sem novo problema identificado |
| Ícones | Lucide, `currentColor`, navegação ativa e caret do select | Reutilizados e verificados visualmente |
| Performance | Sem novas dependências; lista limitada e SSR; build e React Best Practices | Sem novo problema identificado |

| Severidade | Localização | Antes | Depois | Motivo |
| --- | --- | --- | --- | --- |
| MEDIUM | `packages/ui/src/native-select.tsx`, `apps/web/src/styles.css` | Padding global conflita com altura do select e desloca texto | Altura 44px, padding vertical zero e estilo global restrito a inputs | Alinhamento óptico e área de toque |
| MEDIUM | `apps/web/src/styles.css`: sidebar, explore, diretório, perfil, participação e conta | Regiões compartilham praticamente o mesmo fundo | Navegação, conteúdo e contexto têm superfícies distintas, divisórias estruturais e linhas mais compactas | Facilita leitura e agrupamento visual |
| MEDIUM | `apps/web/src/styles.css`: textos auxiliares | Cor auxiliar muito próxima ao fundo | Mistura mais próxima de `foreground`, validada nos dois temas | Legibilidade |
| MEDIUM | `apps/web/src/styles.css`: linhas do app em 320px | Mínimo de largura dos nomes corta o fim da linha | Coluna dos nomes flexível, sem mínimo rígido | Conteúdo visível em celulares estreitos |

| MEDIUM | `packages/contracts/src/index.ts`, links públicos e diretório | Listagem padrão de 6; filtros perdem o tamanho explícito | Padrão de 24, retorno/entrada consistentes e tamanho preservado pelo formulário | Menos trocas de página e URL previsível |

Achados corrigidos. Sem novo movimento a inspecionar em câmera lenta. Veredito: **Approve** no escopo validado. Banco, autenticação, ingestão e fontes não foram alterados.

## Capturas

`docs/screenshots/refinamento-ui/` contém comparações de claro/escuro, diretório, perfil e celular com os dados oficiais já presentes no banco local. Nenhuma nova importação ou promessa de atualização em tempo real foi adicionada.
