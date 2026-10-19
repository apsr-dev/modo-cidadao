# Validação — Select de UF

Data: 19/10/2026. Branch `feat/shadcn-theme`, PR #4.

## Escopo e resultado

`/app` e `/representantes` usam Select do shadcn/Radix após hidratação. O menu aberto acompanha o tema e mostra checkmark, foco e rolagem. “Todas as UFs” remove o filtro sem enviar o valor interno `all`; o diretório preserva `pageSize` e volta à página 1. NativeSelect fica somente no HTML inicial/fallback sem JavaScript. A decisão está no [ADR 004](decisions/004-landing-e-app.md).

## Checks executados

- `bun install --frozen-lockfile`: aprovado com Bun 1.4.2; somente `bun.lock`.
- `bun run build`: aprovado; 20 arquivos JavaScript públicos inspecionados, sem marcadores de banco ou segredos configurados.
- `bun run check:boundaries`: import de banco através do workspace bloqueado como esperado; probe removido e build recomposto.
- `bun run typecheck`: aprovado.
- `bun run lint`: aprovado; permanece apenas a sugestão informativa preexistente de `useTemplate` em `scripts/local-env.ts`.
- `bun run test`: 9 passaram; 2 integrações opt-in ignoradas.
- `E2E_BASE_URL=http://localhost:3009 bun run test:e2e`: 28 passaram no build de produção em demo; 2 cenários de autenticação ignorados por serem incompatíveis com demo.
- `E2E_INTEGRATION=1 E2E_BASE_URL=http://localhost:3008 bun --env-file=<env-local> run test:e2e tests/e2e/public.spec.ts tests/e2e/redesign.spec.ts tests/e2e/select.spec.ts tests/e2e/theme.spec.ts`: 28 passaram contra o catálogo local, em desktop e mobile.

Os testes verificam Enter/ArrowDown para abrir, End para alcançar TO, Enter para selecionar, Escape para cancelar e devolver foco, toque para limpar a UF, hidratação, envio GET e navegação sem JavaScript. O teste de tema inclui campo, opção selecionada e opção comum, com contraste mínimo de 4,5:1 e popup contido na viewport, incluindo 320×740px.

A primeira execução dos testes novos esperava `uf=` no URL final. O Router normaliza a busca removendo a UF vazia e explicitando `page=1`. As expectativas passaram a verificar esse contrato observado; a implementação não foi alterada para contornar falhas.

Inspeção visual com o navegador do app: desktop 1280×720 e 1440×1000, celulares 390×844 e 320×740, claro/escuro, popup aberto e fechado, seleção de SP e resultado de 70 registros locais. Não houve nova importação. As capturas em [screenshots/select](screenshots/select/) mostram os dados já armazenados da Câmara.

## Revisão de interface

Modo `full`, limitado aos dois controles de UF, composição de formulário e popup. Framework React/TanStack Start; Tailwind e tokens semânticos nos componentes compartilhados, CSS existente da web. Skills shadcn, make-interfaces-feel-better e React Best Practices aplicadas.

| Categoria | Evidência inspecionada | Resultado |
| --- | --- | --- |
| Tipografia | Label, valor fechado, opções, seleção e contraste nos dois temas | Legível nas amostras; alinhamento preservado |
| Superfícies | Popup em portal, dimensões, borda, sombra e colisão com a viewport | Contido na tela, com rolagem e área de toque de 44px |
| Animações | Código gerado e estados de abertura/fechamento | Nenhuma animação nova; sem movimento a desacelerar |
| Ícones | Chevron e checkmark Lucide, foco e opção selecionada | `currentColor`, mesma biblioteca e dimensões consistentes |
| Performance | Build, lockfile, React local e SSR/fallback | Uma dependência direta nova; sem requisições adicionais ou estado global |

| Severidade | Localização | Antes | Depois | Motivo |
| --- | --- | --- | --- | --- |
| MEDIUM | `apps/web/src/features/uf-select.tsx`, duas rotas públicas | Popup desenhado pelo navegador/OS | Select shadcn com tokens de popover/accent e indicação de seleção | Consistência das superfícies abertas com o tema |
| LOW | `packages/ui/src/select.tsx` | Trigger de 36px e opções compactas do registro | Trigger e opções com mínimo de 44px | Área de toque e alinhamento com os filtros existentes |

Candidatos considerados e rejeitados:

| Localização | Candidato | Motivo |
| --- | --- | --- |
| `UfSelect` | Remover inteiramente o controle nativo | Manter o fallback preserva a consulta sem JavaScript e o HTML inicial útil |
| `SelectContent` | Manter zoom/slide do código gerado | Interação frequente; foco, checkmark e mudança de fundo já comunicam o estado |

Achados corrigidos; sem achados acionáveis restantes no escopo verificado. Veredito: **Approve**. Autenticação e integrações online não foram reexecutadas nesta entrega; seus códigos não mudaram. Os projetos de navegador são Chromium desktop e Chromium com viewport/toque de celular; Safari e Firefox não foram verificados.
