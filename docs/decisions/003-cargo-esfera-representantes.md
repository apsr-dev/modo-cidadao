# 003 — Cargo, esfera e UF no diretório de representantes

Data: 07/10/2026.

O rótulo “Câmara dos Deputados” exigia conhecimento institucional prévio para distinguir deputados federais de estaduais. A UF de uma pessoa também podia ser confundida com a esfera do cargo.

A interface passa a identificar explicitamente o cargo “Deputado federal”, a esfera federal e a UF de representação nos cartões, perfis e diretório. Home e indicação global de cobertura também nomeiam os deputados federais. Senadores pertencem à esfera federal e deputados estaduais/distritais à esfera estadual/distrital; essas categorias são informadas como ainda não integradas, sem opções de filtro que aparentem dados disponíveis.

Os rótulos de cargo, esfera e instituição compartilham um mapeamento tipado pela instituição já validada no contrato (`camara`). Nenhum cargo é inferido por nome ou UF. O aviso de personagem fictício e o contexto demonstrativo permanecem no modo demo. Não são criados mandatos históricos nem novas integrações; banco e REST permanecem com seus contratos atuais.

Referência institucional: [Câmara — o que faz um deputado federal](https://especial.camara.leg.br/eleicoes-2026/eleicoes-2026-o-que-faz-um-deputado-federal/).

## Verificação local

Build e inspeção do bundle, TypeScript estrito, lint (sem erros; avisos já existentes), nove testes de lógica e navegação E2E de produção aprovados. A suíte integrada passou nos seis testes; a demo passou nos quatro públicos, com dois de autenticação intencionalmente ignorados. A rodada integrada foi repetida com diretório próprio de resultados após uma colisão de arquivos de trace entre execuções simultâneas.

Na conferência direta, REST e SSR responderam HTTP 200; o banco local retornou 513 registros da Câmara. Desktop e celular exibiram cargo e esfera nos cartões, aceitaram filtro por SP e mostraram cargo, esfera e UF em campos distintos no perfil, sem erros de console/hidratação ou rolagem horizontal. A demo conservou “Personagem fictício” e “contexto demonstrativo”. Nenhuma consulta nova à API legislativa foi necessária.
