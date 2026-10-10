# ADR 003 — Tema visual Modo Cidadao

Data: 2026-10-07. Status: aceito.

O usuário forneceu o tema [Modo cidadao no tweakcn](https://tweakcn.com/r/themes/cmuyf5u3v000104le49e0c5ne), em CSS e como registro shadcn. O registro contém apenas estilos. Sua aplicação não exige instalar componentes novos ou executar o CLI sobre o layout existente.

`apps/web/src/theme.css` conserva os tokens claros/escuros enviados, com a integração Tailwind v4. `styles.css` usa pares semânticos de superfície e texto para adaptar os componentes existentes, substituindo a paleta fixa anterior. Superfícies auxiliares derivam desses tokens por `color-mix`. Texto secundário, links escuros e o preenchimento do botão primário escuro também são derivados para manter contraste legível nas superfícies usadas. O layout e os fluxos de dados continuam os mesmos.

Inter, Merriweather e JetBrains Mono são servidas localmente por arquivos WOFF2 de pacotes Fontsource fixados no lockfile. Não há requisição a um serviço externo de fontes. Inter recebe preload; as fontes usam `font-display: swap`.

Sem escolha manual, o tema segue a preferência do sistema, inclusive suas mudanças. O botão no cabeçalho salva `light` ou `dark` na chave `modo-cidadao-theme` do armazenamento local e sincroniza abas abertas. Quando o armazenamento está bloqueado, a alternância continua funcionando durante a navegação. Um script estático no head aplica a preferência antes da pintura do corpo; somente a diferença esperada na classe do HTML é suprimida na hidratação. Não são interpolados dados do usuário.

Esta entrega aplica o tema fornecido. A definição completa da marca e domínio continua no Linear; o Linear também é a única fonte de backlog.

A separação e o redesign solicitados em 09/10/2026 estão no [ADR 004](004-landing-e-app.md). Eles alteram a composição e os layouts descritos acima, mantendo os tokens e o comportamento do tema.
