# Backlog no Linear

O planejamento completo está publicado no [projeto Modo Cidadão](https://linear.app/modo-cidadao/project/modo-cidadao-b79c0658183c), no workspace Modo Cidadao e no time `MOD`. Publicação conferida em **07/10/2026**: 34 épicos funcionais, cinco épicos técnicos e 133 subtarefas, totalizando 172 issues. As 106 dependências foram conferidas no Linear.

Comece pelo [guia de contribuição e entrega](https://linear.app/modo-cidadao/document/comece-aqui-contribuicao-estados-e-criterios-de-entrega-cf76aed8a43d). Para organizar trabalho atual, use os estados e critérios no Linear; este documento e [linear/backlog.json](linear/backlog.json) registram a publicação inicial. O JSON não sincroniza alterações posteriores automaticamente.

## Como contribuir

1. Escolha uma subtarefa disponível e leia seu escopo, critérios de aceite e dependências. Os épicos representam a funcionalidade completa.
2. Consulte [AGENTS.md](../AGENTS.md) e os três documentos de planejamento antes de mudanças relevantes. Combine a responsabilidade pelo item no Linear com a equipe.
3. Crie uma branch própria, referencie o identificador `MOD` no PR para `main` e descreva o comportamento final e a validação realizada.
4. Execute os checks pertinentes à mudança e atualize documentação quando o comportamento, a fonte ou a arquitetura mudar. O aceite inclui neutralidade, proveniência, cobertura e privacidade.
5. Mantenha o item em revisão enquanto o PR estiver aberto. A conclusão exige entrega integrada; nenhum merge automático foi autorizado.

A integração automática entre GitHub e Linear ainda tem uma tarefa própria: [T-05.03 · MOD-155](https://linear.app/modo-cidadao/issue/MOD-155/t-0503-configurar-integracao-githublinear-para-rastrear-entregas). Os PRs existentes foram vinculados manualmente.

## Estado inicial e prioridades

- **14 subtarefas concluídas:** comportamentos da fundação já integrados na `main` (`a3080ef`), com evidência na descrição.
- **6 subtarefas em revisão:** vinculadas ao [PR #1](https://github.com/apsr-dev/modo-cidadao/pull/1) ou ao [PR #2](https://github.com/apsr-dev/modo-cidadao/pull/2), ambos abertos na conferência.
- **113 subtarefas no backlog:** trabalho futuro ou decisões ainda abertas. Todos os 39 épicos continuam em backlog, pois nenhuma funcionalidade completa foi encerrada por uma entrega parcial.

O time ainda não tem estado de revisão: as seis tarefas usam `In Progress` e o rótulo `Em revisão`. Nenhum item recebeu responsável, ciclo, prazo ou estimativa durante a importação.

Prioridades iniciais são propostas: **alta** para capacidades de base, confiança, operação e contribuição; **normal** para os demais escopos; **baixa** para decisões e extensões opcionais. Entregas já concluídas ficam sem prioridade. O rótulo `Opcional` mantém visíveis escolhas que ainda dependem de decisão.

Os 513 representantes observados localmente são **deputados federais**; isso não representa cobertura estadual nem do Senado. A coleta local é manual e as três propostas são uma amostra. A integração de senadores e a descoberta de fontes estaduais/distritais têm itens próprios; atualização recorrente permanece planejada.

## Referências completas

- [Planejamento completo de funcionalidades](https://linear.app/modo-cidadao/document/planejamento-completo-de-funcionalidades-d89be38952aa)
- [Planejamento técnico e arquitetura](https://linear.app/modo-cidadao/document/planejamento-tecnico-e-arquitetura-ef3d487c1018)
- [Recursos, APIs e fontes oficiais](https://linear.app/modo-cidadao/document/recursos-apis-e-fontes-oficiais-f4713c240336)
- [Comece aqui — contribuição, estados e critérios de entrega](https://linear.app/modo-cidadao/document/comece-aqui-contribuicao-estados-e-criterios-de-entrega-cf76aed8a43d)

Os documentos versionados permanecem íntegros: [funcionalidades](PLANEJAMENTO-FEATURES.md), [planejamento técnico](PLANEJAMENTO-TECNICO.md) e [recursos/fontes](RECURSOS.md). Os links nas issues apontam para revisões imutáveis. A coleta de requisitos desta publicação corresponde ao commit `94f918a`; hashes dos arquivos estão no JSON.

## Índice dos épicos

| Código | Funcionalidade ou área | Tarefas | Concluídas | Em revisão | Backlog |
| --- | --- | ---: | ---: | ---: | ---: |
| F-01 | [Entrada do produto](https://linear.app/modo-cidadao/issue/MOD-5/f-01-entrada-do-produto) | 4 | 1 | 0 | 3 |
| F-02 | [Diretório](https://linear.app/modo-cidadao/issue/MOD-6/f-02-diretorio) | 6 | 1 | 2 | 3 |
| F-03 | [Perfil](https://linear.app/modo-cidadao/issue/MOD-7/f-03-perfil) | 4 | 1 | 1 | 2 |
| F-04 | [Contatos oficiais](https://linear.app/modo-cidadao/issue/MOD-8/f-04-contatos-oficiais) | 3 | 1 | 0 | 2 |
| F-05 | [Preparar uma mensagem](https://linear.app/modo-cidadao/issue/MOD-9/f-05-preparar-uma-mensagem) | 2 | 0 | 0 | 2 |
| F-06 | [Diretório de partidos](https://linear.app/modo-cidadao/issue/MOD-10/f-06-diretorio-de-partidos) | 3 | 0 | 0 | 3 |
| F-07 | [Catálogo e busca](https://linear.app/modo-cidadao/issue/MOD-11/f-07-catalogo-e-busca) | 5 | 0 | 1 | 4 |
| F-08 | [Detalhe e entendimento](https://linear.app/modo-cidadao/issue/MOD-12/f-08-detalhe-e-entendimento) | 5 | 0 | 1 | 4 |
| F-09 | [Explicação simplificada](https://linear.app/modo-cidadao/issue/MOD-13/f-09-explicacao-simplificada) | 4 | 0 | 0 | 4 |
| F-10 | [Linha do tempo](https://linear.app/modo-cidadao/issue/MOD-14/f-10-linha-do-tempo) | 2 | 0 | 1 | 1 |
| F-11 | [Diretório de votações](https://linear.app/modo-cidadao/issue/MOD-15/f-11-diretorio-de-votacoes) | 3 | 0 | 0 | 3 |
| F-12 | [Detalhe da decisão](https://linear.app/modo-cidadao/issue/MOD-16/f-12-detalhe-da-decisao) | 2 | 0 | 0 | 2 |
| F-13 | [Atuação individual](https://linear.app/modo-cidadao/issue/MOD-17/f-13-atuacao-individual) | 2 | 0 | 0 | 2 |
| F-14 | [Instituições e comissões](https://linear.app/modo-cidadao/issue/MOD-18/f-14-instituicoes-e-comissoes) | 3 | 0 | 0 | 3 |
| F-15 | [Agenda](https://linear.app/modo-cidadao/issue/MOD-19/f-15-agenda) | 3 | 0 | 0 | 3 |
| F-16 | [Despesas parlamentares](https://linear.app/modo-cidadao/issue/MOD-20/f-16-despesas-parlamentares) | 4 | 0 | 0 | 4 |
| F-17 | [Acesso a mecanismos de fiscalização](https://linear.app/modo-cidadao/issue/MOD-21/f-17-acesso-a-mecanismos-de-fiscalizacao) | 1 | 0 | 0 | 1 |
| F-18 | [Consulta eleitoral](https://linear.app/modo-cidadao/issue/MOD-22/f-18-consulta-eleitoral) | 4 | 0 | 0 | 4 |
| F-19 | [Continuidade da pessoa](https://linear.app/modo-cidadao/issue/MOD-23/f-19-continuidade-da-pessoa) | 2 | 0 | 0 | 2 |
| F-20 | [Hub “Participe”](https://linear.app/modo-cidadao/issue/MOD-24/f-20-hub-participe) | 3 | 1 | 0 | 2 |
| F-21 | [Senado/e-Cidadania](https://linear.app/modo-cidadao/issue/MOD-25/f-21-senadoe-cidadania) | 3 | 1 | 0 | 2 |
| F-22 | [Câmara](https://linear.app/modo-cidadao/issue/MOD-26/f-22-camara) | 3 | 1 | 0 | 2 |
| F-23 | [Informação e ouvidoria](https://linear.app/modo-cidadao/issue/MOD-27/f-23-informacao-e-ouvidoria) | 1 | 0 | 0 | 1 |
| F-24 | [Conta](https://linear.app/modo-cidadao/issue/MOD-28/f-24-conta) | 6 | 1 | 0 | 5 |
| F-25 | [Seguir](https://linear.app/modo-cidadao/issue/MOD-29/f-25-seguir) | 4 | 1 | 0 | 3 |
| F-26 | [Feed pessoal](https://linear.app/modo-cidadao/issue/MOD-30/f-26-feed-pessoal) | 2 | 0 | 0 | 2 |
| F-27 | [Central e canais](https://linear.app/modo-cidadao/issue/MOD-31/f-27-central-e-canais) | 4 | 0 | 0 | 4 |
| F-28 | [Busca transversal](https://linear.app/modo-cidadao/issue/MOD-32/f-28-busca-transversal) | 2 | 0 | 0 | 2 |
| F-29 | [Temas](https://linear.app/modo-cidadao/issue/MOD-33/f-29-temas) | 2 | 0 | 0 | 2 |
| F-30 | [Compartilhar](https://linear.app/modo-cidadao/issue/MOD-34/f-30-compartilhar) | 3 | 1 | 0 | 2 |
| F-31 | [Proveniência](https://linear.app/modo-cidadao/issue/MOD-35/f-31-proveniencia) | 2 | 1 | 0 | 1 |
| F-32 | [Estados dos dados](https://linear.app/modo-cidadao/issue/MOD-36/f-32-estados-dos-dados) | 2 | 1 | 0 | 1 |
| F-33 | [Correções](https://linear.app/modo-cidadao/issue/MOD-37/f-33-correcoes) | 2 | 0 | 0 | 2 |
| F-34 | [Ferramentas internas](https://linear.app/modo-cidadao/issue/MOD-38/f-34-ferramentas-internas) | 3 | 0 | 0 | 3 |
| T-01 | [Ingestão, sincronização e eventos](https://linear.app/modo-cidadao/issue/MOD-39/t-01-ingestao-sincronizacao-e-eventos) | 7 | 1 | 0 | 6 |
| T-02 | [Experiência, acessibilidade e PWA](https://linear.app/modo-cidadao/issue/MOD-40/t-02-experiencia-acessibilidade-e-pwa) | 6 | 0 | 0 | 6 |
| T-03 | [Privacidade, autorização e recuperação](https://linear.app/modo-cidadao/issue/MOD-41/t-03-privacidade-autorizacao-e-recuperacao) | 6 | 0 | 0 | 6 |
| T-04 | [Entrega, operação e qualidade](https://linear.app/modo-cidadao/issue/MOD-42/t-04-entrega-operacao-e-qualidade) | 6 | 1 | 0 | 5 |
| T-05 | [Colaboração e governança do repositório](https://linear.app/modo-cidadao/issue/MOD-43/t-05-colaboracao-e-governanca-do-repositorio) | 4 | 0 | 0 | 4 |

## Subtarefas e dependências

Os estados abaixo são o retrato da publicação. Abra a issue para ver critérios de aceite, evidências e o estado atual.

### F-01 — Entrada do produto

Épico: [MOD-5](https://linear.app/modo-cidadao/issue/MOD-5/f-01-entrada-do-produto).

- [F-01.01 · MOD-163 — Registrar home pública e navegação já entregues](https://linear.app/modo-cidadao/issue/MOD-163/f-0101-registrar-home-publica-e-navegacao-ja-entregues) — Concluída; sem prioridade.
- [F-01.02 · MOD-44 — Separar a apresentação institucional da navegação da plataforma](https://linear.app/modo-cidadao/issue/MOD-44/f-0102-separar-a-apresentacao-institucional-da-navegacao-da-plataforma) — Backlog; alta.
- [F-01.03 · MOD-45 — Mostrar atividade pública recente com critérios de seleção](https://linear.app/modo-cidadao/issue/MOD-45/f-0103-mostrar-atividade-publica-recente-com-criterios-de-selecao) — Backlog; normal. Depende de: [T-01.06](https://linear.app/modo-cidadao/issue/MOD-134/t-0106-criar-eventos-de-dominio-e-outbox-com-deduplicacao).
- [F-01.04 · MOD-46 — Adicionar descoberta por UF na home](https://linear.app/modo-cidadao/issue/MOD-46/f-0104-adicionar-descoberta-por-uf-na-home) — Backlog; normal. Depende de: [F-02.05](https://linear.app/modo-cidadao/issue/MOD-48/f-0205-adicionar-filtros-por-casa-partido-exercicio-e-legislatura).

### F-02 — Diretório

Épico: [MOD-6](https://linear.app/modo-cidadao/issue/MOD-6/f-02-diretorio).

- [F-02.01 · MOD-164 — Registrar diretório da Câmara da fundação](https://linear.app/modo-cidadao/issue/MOD-164/f-0201-registrar-diretorio-da-camara-da-fundacao) — Concluída; sem prioridade.
- [F-02.02 · MOD-157 — Revisar ampliação do catálogo para 513 deputados federais](https://linear.app/modo-cidadao/issue/MOD-157/f-0202-revisar-ampliacao-do-catalogo-para-513-deputados-federais) — Em revisão; alta.
- [F-02.03 · MOD-158 — Revisar identificação de cargo, esfera e UF](https://linear.app/modo-cidadao/issue/MOD-158/f-0203-revisar-identificacao-de-cargo-esfera-e-uf) — Em revisão; alta.
- [F-02.04 · MOD-47 — Integrar senadores atuais com fonte e identidade próprias](https://linear.app/modo-cidadao/issue/MOD-47/f-0204-integrar-senadores-atuais-com-fonte-e-identidade-proprias) — Backlog; alta.
- [F-02.05 · MOD-48 — Adicionar filtros por Casa, partido, exercício e legislatura](https://linear.app/modo-cidadao/issue/MOD-48/f-0205-adicionar-filtros-por-casa-partido-exercicio-e-legislatura) — Backlog; alta. Depende de: [F-02.04](https://linear.app/modo-cidadao/issue/MOD-47/f-0204-integrar-senadores-atuais-com-fonte-e-identidade-proprias), [F-03.02](https://linear.app/modo-cidadao/issue/MOD-50/f-0302-importar-historico-de-exercicio-e-filiacao-com-periodos).
- [F-02.06 · MOD-49 — Exibir foto oficial com alternativa acessível](https://linear.app/modo-cidadao/issue/MOD-49/f-0206-exibir-foto-oficial-com-alternativa-acessivel) — Backlog; normal.

### F-03 — Perfil

Épico: [MOD-7](https://linear.app/modo-cidadao/issue/MOD-7/f-03-perfil).

- [F-03.01 · MOD-165 — Registrar perfil básico e proveniência já entregues](https://linear.app/modo-cidadao/issue/MOD-165/f-0301-registrar-perfil-basico-e-proveniencia-ja-entregues) — Concluída; sem prioridade.
- [F-03.02 · MOD-50 — Importar histórico de exercício e filiação com períodos](https://linear.app/modo-cidadao/issue/MOD-50/f-0302-importar-historico-de-exercicio-e-filiacao-com-periodos) — Backlog; alta.
- [F-03.03 · MOD-51 — Adicionar biografia e vínculos a cargos/comissões](https://linear.app/modo-cidadao/issue/MOD-51/f-0303-adicionar-biografia-e-vinculos-a-cargoscomissoes) — Backlog; normal. Depende de: [F-14.02](https://linear.app/modo-cidadao/issue/MOD-80/f-1402-importar-composicao-e-papeis-em-comissoes-por-periodo).
- [F-03.04 · MOD-159 — Revisar propostas vinculadas no perfil](https://linear.app/modo-cidadao/issue/MOD-159/f-0304-revisar-propostas-vinculadas-no-perfil) — Em revisão; normal.

### F-04 — Contatos oficiais

Épico: [MOD-8](https://linear.app/modo-cidadao/issue/MOD-8/f-04-contatos-oficiais).

- [F-04.01 · MOD-166 — Registrar e-mail e telefone institucionais existentes](https://linear.app/modo-cidadao/issue/MOD-166/f-0401-registrar-e-mail-e-telefone-institucionais-existentes) — Concluída; sem prioridade.
- [F-04.02 · MOD-52 — Ampliar contatos para site, endereço e redes divulgadas](https://linear.app/modo-cidadao/issue/MOD-52/f-0402-ampliar-contatos-para-site-endereco-e-redes-divulgadas) — Backlog; normal.
- [F-04.03 · MOD-53 — Permitir copiar contatos e usar canal institucional de fallback](https://linear.app/modo-cidadao/issue/MOD-53/f-0403-permitir-copiar-contatos-e-usar-canal-institucional-de-fallback) — Backlog; normal. Depende de: [F-04.02](https://linear.app/modo-cidadao/issue/MOD-52/f-0402-ampliar-contatos-para-site-endereco-e-redes-divulgadas).

### F-05 — Preparar uma mensagem

Épico: [MOD-9](https://linear.app/modo-cidadao/issue/MOD-9/f-05-preparar-uma-mensagem).

- [F-05.01 · MOD-54 — Criar rascunho editável para contato com representante](https://linear.app/modo-cidadao/issue/MOD-54/f-0501-criar-rascunho-editavel-para-contato-com-representante) — Backlog; normal.
- [F-05.02 · MOD-55 — Decidir uso opcional de IA nos rascunhos](https://linear.app/modo-cidadao/issue/MOD-55/f-0502-decidir-uso-opcional-de-ia-nos-rascunhos) — Backlog; baixa; opcional.

### F-06 — Diretório de partidos

Épico: [MOD-10](https://linear.app/modo-cidadao/issue/MOD-10/f-06-diretorio-de-partidos).

- [F-06.01 · MOD-56 — Importar partidos, nomes e identificadores oficiais](https://linear.app/modo-cidadao/issue/MOD-56/f-0601-importar-partidos-nomes-e-identificadores-oficiais) — Backlog; normal.
- [F-06.02 · MOD-57 — Modelar bancadas, blocos e lideranças por período](https://linear.app/modo-cidadao/issue/MOD-57/f-0602-modelar-bancadas-blocos-e-liderancas-por-periodo) — Backlog; normal. Depende de: [F-06.01](https://linear.app/modo-cidadao/issue/MOD-56/f-0601-importar-partidos-nomes-e-identificadores-oficiais), [F-03.02](https://linear.app/modo-cidadao/issue/MOD-50/f-0302-importar-historico-de-exercicio-e-filiacao-com-periodos).
- [F-06.03 · MOD-58 — Criar diretório e página de composição partidária](https://linear.app/modo-cidadao/issue/MOD-58/f-0603-criar-diretorio-e-pagina-de-composicao-partidaria) — Backlog; normal. Depende de: [F-06.02](https://linear.app/modo-cidadao/issue/MOD-57/f-0602-modelar-bancadas-blocos-e-liderancas-por-periodo).

### F-07 — Catálogo e busca

Épico: [MOD-11](https://linear.app/modo-cidadao/issue/MOD-11/f-07-catalogo-e-busca).

- [F-07.01 · MOD-160 — Revisar catálogo e filtros de propostas da Câmara](https://linear.app/modo-cidadao/issue/MOD-160/f-0701-revisar-catalogo-e-filtros-de-propostas-da-camara) — Em revisão; alta.
- [F-07.02 · MOD-59 — Pesquisar propostas por ementa/texto e ampliar filtros](https://linear.app/modo-cidadao/issue/MOD-59/f-0702-pesquisar-propostas-por-ementatexto-e-ampliar-filtros) — Backlog; normal. Depende de: [F-07.01](https://linear.app/modo-cidadao/issue/MOD-160/f-0701-revisar-catalogo-e-filtros-de-propostas-da-camara), [F-29.01](https://linear.app/modo-cidadao/issue/MOD-119/f-2901-importar-temas-oficiais-e-mapear-taxonomias-explicitamente).
- [F-07.03 · MOD-60 — Integrar matérias e autoria do Senado](https://linear.app/modo-cidadao/issue/MOD-60/f-0703-integrar-materias-e-autoria-do-senado) — Backlog; alta. Depende de: [F-02.04](https://linear.app/modo-cidadao/issue/MOD-47/f-0204-integrar-senadores-atuais-com-fonte-e-identidade-proprias).
- [F-07.04 · MOD-61 — Ampliar coleta de propostas com cobertura verificável](https://linear.app/modo-cidadao/issue/MOD-61/f-0704-ampliar-coleta-de-propostas-com-cobertura-verificavel) — Backlog; alta. Depende de: [T-01.04](https://linear.app/modo-cidadao/issue/MOD-132/t-0104-implementar-retomada-de-checkpoint-e-sincronizacao-incremental), [F-07.01](https://linear.app/modo-cidadao/issue/MOD-160/f-0701-revisar-catalogo-e-filtros-de-propostas-da-camara).
- [F-07.05 · MOD-62 — Distinguir tipos de documento legislativo](https://linear.app/modo-cidadao/issue/MOD-62/f-0705-distinguir-tipos-de-documento-legislativo) — Backlog; normal. Depende de: [F-07.01](https://linear.app/modo-cidadao/issue/MOD-160/f-0701-revisar-catalogo-e-filtros-de-propostas-da-camara).

### F-08 — Detalhe e entendimento

Épico: [MOD-12](https://linear.app/modo-cidadao/issue/MOD-12/f-08-detalhe-e-entendimento).

- [F-08.01 · MOD-161 — Revisar detalhe, autoria e documentos oficiais](https://linear.app/modo-cidadao/issue/MOD-161/f-0801-revisar-detalhe-autoria-e-documentos-oficiais) — Em revisão; alta.
- [F-08.02 · MOD-63 — Adicionar relatorias e relações entre documentos](https://linear.app/modo-cidadao/issue/MOD-63/f-0802-adicionar-relatorias-e-relacoes-entre-documentos) — Backlog; normal. Depende de: [F-08.01](https://linear.app/modo-cidadao/issue/MOD-161/f-0801-revisar-detalhe-autoria-e-documentos-oficiais).
- [F-08.03 · MOD-64 — Relacionar tramitação entre Câmara e Senado](https://linear.app/modo-cidadao/issue/MOD-64/f-0803-relacionar-tramitacao-entre-camara-e-senado) — Backlog; normal. Depende de: [F-07.03](https://linear.app/modo-cidadao/issue/MOD-60/f-0703-integrar-materias-e-autoria-do-senado), [F-08.02](https://linear.app/modo-cidadao/issue/MOD-63/f-0802-adicionar-relatorias-e-relacoes-entre-documentos).
- [F-08.04 · MOD-65 — Vincular votações e participação ao detalhe da proposta](https://linear.app/modo-cidadao/issue/MOD-65/f-0804-vincular-votacoes-e-participacao-ao-detalhe-da-proposta) — Backlog; normal. Depende de: [F-12.02](https://linear.app/modo-cidadao/issue/MOD-76/f-1202-criar-detalhe-de-votacao-e-consultar-votos), [F-21.02](https://linear.app/modo-cidadao/issue/MOD-98/f-2102-verificar-consultas-ideias-e-eventos-especificos-do-senado), [F-22.02](https://linear.app/modo-cidadao/issue/MOD-100/f-2202-verificar-enquetes-e-debates-por-propostaevento).
- [F-08.05 · MOD-66 — Expor histórico e comparação factual de versões](https://linear.app/modo-cidadao/issue/MOD-66/f-0805-expor-historico-e-comparacao-factual-de-versoes) — Backlog; normal. Depende de: [F-10.01](https://linear.app/modo-cidadao/issue/MOD-162/f-1001-revisar-linha-do-tempo-e-preservacao-de-revisoes).

### F-09 — Explicação simplificada

Épico: [MOD-13](https://linear.app/modo-cidadao/issue/MOD-13/f-09-explicacao-simplificada).

- [F-09.01 · MOD-67 — Definir fornecedor, orçamento e política de revisão de IA](https://linear.app/modo-cidadao/issue/MOD-67/f-0901-definir-fornecedor-orcamento-e-politica-de-revisao-de-ia) — Backlog; baixa; opcional.
- [F-09.02 · MOD-68 — Extrair textos de documentos e tratar PDF/OCR](https://linear.app/modo-cidadao/issue/MOD-68/f-0902-extrair-textos-de-documentos-e-tratar-pdfocr) — Backlog; baixa; opcional. Depende de: [F-08.05](https://linear.app/modo-cidadao/issue/MOD-66/f-0805-expor-historico-e-comparacao-factual-de-versoes), [F-09.01](https://linear.app/modo-cidadao/issue/MOD-67/f-0901-definir-fornecedor-orcamento-e-politica-de-revisao-de-ia).
- [F-09.03 · MOD-69 — Gerar explicações estruturadas com fontes e validação](https://linear.app/modo-cidadao/issue/MOD-69/f-0903-gerar-explicacoes-estruturadas-com-fontes-e-validacao) — Backlog; baixa; opcional. Depende de: [F-09.02](https://linear.app/modo-cidadao/issue/MOD-68/f-0902-extrair-textos-de-documentos-e-tratar-pdfocr).
- [F-09.04 · MOD-70 — Publicar resumos revisados e permitir apontar erro](https://linear.app/modo-cidadao/issue/MOD-70/f-0904-publicar-resumos-revisados-e-permitir-apontar-erro) — Backlog; baixa; opcional. Depende de: [F-09.03](https://linear.app/modo-cidadao/issue/MOD-69/f-0903-gerar-explicacoes-estruturadas-com-fontes-e-validacao), [F-33.01](https://linear.app/modo-cidadao/issue/MOD-125/f-3301-criar-registro-de-relato-de-erro-e-trilha-de-correcao).

### F-10 — Linha do tempo

Épico: [MOD-14](https://linear.app/modo-cidadao/issue/MOD-14/f-10-linha-do-tempo).

- [F-10.01 · MOD-162 — Revisar linha do tempo e preservação de revisões](https://linear.app/modo-cidadao/issue/MOD-162/f-1001-revisar-linha-do-tempo-e-preservacao-de-revisoes) — Em revisão; alta.
- [F-10.02 · MOD-71 — Contextualizar eventos e retificações na linha do tempo](https://linear.app/modo-cidadao/issue/MOD-71/f-1002-contextualizar-eventos-e-retificacoes-na-linha-do-tempo) — Backlog; normal. Depende de: [F-10.01](https://linear.app/modo-cidadao/issue/MOD-162/f-1001-revisar-linha-do-tempo-e-preservacao-de-revisoes), [F-08.02](https://linear.app/modo-cidadao/issue/MOD-63/f-0802-adicionar-relatorias-e-relacoes-entre-documentos).

### F-11 — Diretório de votações

Épico: [MOD-15](https://linear.app/modo-cidadao/issue/MOD-15/f-11-diretorio-de-votacoes).

- [F-11.01 · MOD-72 — Importar votações da Câmara com objeto e modalidade](https://linear.app/modo-cidadao/issue/MOD-72/f-1101-importar-votacoes-da-camara-com-objeto-e-modalidade) — Backlog; alta.
- [F-11.02 · MOD-73 — Importar votações do Senado com contrato próprio](https://linear.app/modo-cidadao/issue/MOD-73/f-1102-importar-votacoes-do-senado-com-contrato-proprio) — Backlog; normal. Depende de: [F-02.04](https://linear.app/modo-cidadao/issue/MOD-47/f-0204-integrar-senadores-atuais-com-fonte-e-identidade-proprias).
- [F-11.03 · MOD-74 — Criar catálogo de votações e filtros públicos](https://linear.app/modo-cidadao/issue/MOD-74/f-1103-criar-catalogo-de-votacoes-e-filtros-publicos) — Backlog; alta. Depende de: [F-11.01](https://linear.app/modo-cidadao/issue/MOD-72/f-1101-importar-votacoes-da-camara-com-objeto-e-modalidade).

### F-12 — Detalhe da decisão

Épico: [MOD-16](https://linear.app/modo-cidadao/issue/MOD-16/f-12-detalhe-da-decisao).

- [F-12.01 · MOD-75 — Importar votos individuais e filiação no contexto do voto](https://linear.app/modo-cidadao/issue/MOD-75/f-1201-importar-votos-individuais-e-filiacao-no-contexto-do-voto) — Backlog; alta. Depende de: [F-11.01](https://linear.app/modo-cidadao/issue/MOD-72/f-1101-importar-votacoes-da-camara-com-objeto-e-modalidade), [F-03.02](https://linear.app/modo-cidadao/issue/MOD-50/f-0302-importar-historico-de-exercicio-e-filiacao-com-periodos).
- [F-12.02 · MOD-76 — Criar detalhe de votação e consultar votos](https://linear.app/modo-cidadao/issue/MOD-76/f-1202-criar-detalhe-de-votacao-e-consultar-votos) — Backlog; alta. Depende de: [F-12.01](https://linear.app/modo-cidadao/issue/MOD-75/f-1201-importar-votos-individuais-e-filiacao-no-contexto-do-voto).

### F-13 — Atuação individual

Épico: [MOD-17](https://linear.app/modo-cidadao/issue/MOD-17/f-13-atuacao-individual).

- [F-13.01 · MOD-77 — Mostrar histórico contextualizado de votos no perfil](https://linear.app/modo-cidadao/issue/MOD-77/f-1301-mostrar-historico-contextualizado-de-votos-no-perfil) — Backlog; normal. Depende de: [F-12.02](https://linear.app/modo-cidadao/issue/MOD-76/f-1202-criar-detalhe-de-votacao-e-consultar-votos).
- [F-13.02 · MOD-78 — Decidir comparação factual de registros de votos](https://linear.app/modo-cidadao/issue/MOD-78/f-1302-decidir-comparacao-factual-de-registros-de-votos) — Backlog; baixa; opcional. Depende de: [F-13.01](https://linear.app/modo-cidadao/issue/MOD-77/f-1301-mostrar-historico-contextualizado-de-votos-no-perfil).

### F-14 — Instituições e comissões

Épico: [MOD-18](https://linear.app/modo-cidadao/issue/MOD-18/f-14-instituicoes-e-comissoes).

- [F-14.01 · MOD-79 — Importar órgãos e comissões de Câmara e Senado](https://linear.app/modo-cidadao/issue/MOD-79/f-1401-importar-orgaos-e-comissoes-de-camara-e-senado) — Backlog; normal.
- [F-14.02 · MOD-80 — Importar composição e papéis em comissões por período](https://linear.app/modo-cidadao/issue/MOD-80/f-1402-importar-composicao-e-papeis-em-comissoes-por-periodo) — Backlog; normal. Depende de: [F-14.01](https://linear.app/modo-cidadao/issue/MOD-79/f-1401-importar-orgaos-e-comissoes-de-camara-e-senado), [F-03.02](https://linear.app/modo-cidadao/issue/MOD-50/f-0302-importar-historico-de-exercicio-e-filiacao-com-periodos).
- [F-14.03 · MOD-81 — Criar diretório e detalhe de órgãos](https://linear.app/modo-cidadao/issue/MOD-81/f-1403-criar-diretorio-e-detalhe-de-orgaos) — Backlog; normal. Depende de: [F-14.02](https://linear.app/modo-cidadao/issue/MOD-80/f-1402-importar-composicao-e-papeis-em-comissoes-por-periodo), [F-08.02](https://linear.app/modo-cidadao/issue/MOD-63/f-0802-adicionar-relatorias-e-relacoes-entre-documentos).

### F-15 — Agenda

Épico: [MOD-19](https://linear.app/modo-cidadao/issue/MOD-19/f-15-agenda).

- [F-15.01 · MOD-82 — Importar agenda, situação e pautas oficiais](https://linear.app/modo-cidadao/issue/MOD-82/f-1501-importar-agenda-situacao-e-pautas-oficiais) — Backlog; normal.
- [F-15.02 · MOD-83 — Criar agenda e detalhe de eventos](https://linear.app/modo-cidadao/issue/MOD-83/f-1502-criar-agenda-e-detalhe-de-eventos) — Backlog; normal. Depende de: [F-15.01](https://linear.app/modo-cidadao/issue/MOD-82/f-1501-importar-agenda-situacao-e-pautas-oficiais).
- [F-15.03 · MOD-84 — Emitir eventos de alteração da agenda sem alertas obsoletos](https://linear.app/modo-cidadao/issue/MOD-84/f-1503-emitir-eventos-de-alteracao-da-agenda-sem-alertas-obsoletos) — Backlog; normal. Depende de: [F-15.01](https://linear.app/modo-cidadao/issue/MOD-82/f-1501-importar-agenda-situacao-e-pautas-oficiais), [T-01.06](https://linear.app/modo-cidadao/issue/MOD-134/t-0106-criar-eventos-de-dominio-e-outbox-com-deduplicacao).

### F-16 — Despesas parlamentares

Épico: [MOD-20](https://linear.app/modo-cidadao/issue/MOD-20/f-16-despesas-parlamentares).

- [F-16.01 · MOD-85 — Importar despesas parlamentares da Câmara](https://linear.app/modo-cidadao/issue/MOD-85/f-1601-importar-despesas-parlamentares-da-camara) — Backlog; normal.
- [F-16.02 · MOD-86 — Importar CEAPS por fonte administrativa do Senado](https://linear.app/modo-cidadao/issue/MOD-86/f-1602-importar-ceaps-por-fonte-administrativa-do-senado) — Backlog; normal.
- [F-16.03 · MOD-87 — Criar agregados e consultas de despesas](https://linear.app/modo-cidadao/issue/MOD-87/f-1603-criar-agregados-e-consultas-de-despesas) — Backlog; normal. Depende de: [F-16.01](https://linear.app/modo-cidadao/issue/MOD-85/f-1601-importar-despesas-parlamentares-da-camara).
- [F-16.04 · MOD-88 — Exibir despesas no perfil e filtros por período/categoria](https://linear.app/modo-cidadao/issue/MOD-88/f-1604-exibir-despesas-no-perfil-e-filtros-por-periodocategoria) — Backlog; normal. Depende de: [F-16.03](https://linear.app/modo-cidadao/issue/MOD-87/f-1603-criar-agregados-e-consultas-de-despesas).

### F-17 — Acesso a mecanismos de fiscalização

Épico: [MOD-21](https://linear.app/modo-cidadao/issue/MOD-21/f-17-acesso-a-mecanismos-de-fiscalizacao).

- [F-17.01 · MOD-89 — Organizar mecanismos oficiais de fiscalização](https://linear.app/modo-cidadao/issue/MOD-89/f-1701-organizar-mecanismos-oficiais-de-fiscalizacao) — Backlog; normal.

### F-18 — Consulta eleitoral

Épico: [MOD-22](https://linear.app/modo-cidadao/issue/MOD-22/f-18-consulta-eleitoral).

- [F-18.01 · MOD-90 — Validar recursos e dicionários eleitorais do TSE](https://linear.app/modo-cidadao/issue/MOD-90/f-1801-validar-recursos-e-dicionarios-eleitorais-do-tse) — Backlog; alta.
- [F-18.02 · MOD-91 — Importar candidaturas e declarações em streaming](https://linear.app/modo-cidadao/issue/MOD-91/f-1802-importar-candidaturas-e-declaracoes-em-streaming) — Backlog; normal. Depende de: [F-18.01](https://linear.app/modo-cidadao/issue/MOD-90/f-1801-validar-recursos-e-dicionarios-eleitorais-do-tse).
- [F-18.03 · MOD-92 — Importar resultados eleitorais por dataset próprio](https://linear.app/modo-cidadao/issue/MOD-92/f-1803-importar-resultados-eleitorais-por-dataset-proprio) — Backlog; normal. Depende de: [F-18.01](https://linear.app/modo-cidadao/issue/MOD-90/f-1801-validar-recursos-e-dicionarios-eleitorais-do-tse).
- [F-18.04 · MOD-93 — Criar consulta de eleições e candidaturas](https://linear.app/modo-cidadao/issue/MOD-93/f-1804-criar-consulta-de-eleicoes-e-candidaturas) — Backlog; normal. Depende de: [F-18.02](https://linear.app/modo-cidadao/issue/MOD-91/f-1802-importar-candidaturas-e-declaracoes-em-streaming), [F-18.03](https://linear.app/modo-cidadao/issue/MOD-92/f-1803-importar-resultados-eleitorais-por-dataset-proprio).

### F-19 — Continuidade da pessoa

Épico: [MOD-23](https://linear.app/modo-cidadao/issue/MOD-23/f-19-continuidade-da-pessoa).

- [F-19.01 · MOD-94 — Modelar vínculo comprovado entre candidatura, pessoa e mandato](https://linear.app/modo-cidadao/issue/MOD-94/f-1901-modelar-vinculo-comprovado-entre-candidatura-pessoa-e-mandato) — Backlog; normal. Depende de: [F-18.02](https://linear.app/modo-cidadao/issue/MOD-91/f-1802-importar-candidaturas-e-declaracoes-em-streaming), [F-03.02](https://linear.app/modo-cidadao/issue/MOD-50/f-0302-importar-historico-de-exercicio-e-filiacao-com-periodos).
- [F-19.02 · MOD-95 — Exibir trajetória eleitoral no perfil](https://linear.app/modo-cidadao/issue/MOD-95/f-1902-exibir-trajetoria-eleitoral-no-perfil) — Backlog; normal. Depende de: [F-19.01](https://linear.app/modo-cidadao/issue/MOD-94/f-1901-modelar-vinculo-comprovado-entre-candidatura-pessoa-e-mandato), [F-18.03](https://linear.app/modo-cidadao/issue/MOD-92/f-1803-importar-resultados-eleitorais-por-dataset-proprio).

### F-20 — Hub “Participe”

Épico: [MOD-24](https://linear.app/modo-cidadao/issue/MOD-24/f-20-hub-participe).

- [F-20.01 · MOD-167 — Registrar acesso inicial aos portais de participação](https://linear.app/modo-cidadao/issue/MOD-167/f-2001-registrar-acesso-inicial-aos-portais-de-participacao) — Concluída; sem prioridade.
- [F-20.02 · MOD-96 — Organizar o Participe por intenção do cidadão](https://linear.app/modo-cidadao/issue/MOD-96/f-2002-organizar-o-participe-por-intencao-do-cidadao) — Backlog; normal. Depende de: [F-17.01](https://linear.app/modo-cidadao/issue/MOD-89/f-1701-organizar-mecanismos-oficiais-de-fiscalizacao), [F-23.01](https://linear.app/modo-cidadao/issue/MOD-102/f-2301-mapear-canais-competentes-de-informacao-e-ouvidoria).
- [F-20.03 · MOD-97 — Modelar oportunidades com vínculo e prazo verificados](https://linear.app/modo-cidadao/issue/MOD-97/f-2003-modelar-oportunidades-com-vinculo-e-prazo-verificados) — Backlog; normal. Depende de: [F-21.02](https://linear.app/modo-cidadao/issue/MOD-98/f-2102-verificar-consultas-ideias-e-eventos-especificos-do-senado), [F-22.02](https://linear.app/modo-cidadao/issue/MOD-100/f-2202-verificar-enquetes-e-debates-por-propostaevento).

### F-21 — Senado/e-Cidadania

Épico: [MOD-25](https://linear.app/modo-cidadao/issue/MOD-25/f-21-senadoe-cidadania).

- [F-21.01 · MOD-168 — Registrar acesso genérico ao e-Cidadania](https://linear.app/modo-cidadao/issue/MOD-168/f-2101-registrar-acesso-generico-ao-e-cidadania) — Concluída; sem prioridade.
- [F-21.02 · MOD-98 — Verificar consultas, ideias e eventos específicos do Senado](https://linear.app/modo-cidadao/issue/MOD-98/f-2102-verificar-consultas-ideias-e-eventos-especificos-do-senado) — Backlog; normal.
- [F-21.03 · MOD-99 — Mostrar oportunidades do Senado no contexto adequado](https://linear.app/modo-cidadao/issue/MOD-99/f-2103-mostrar-oportunidades-do-senado-no-contexto-adequado) — Backlog; normal. Depende de: [F-20.03](https://linear.app/modo-cidadao/issue/MOD-97/f-2003-modelar-oportunidades-com-vinculo-e-prazo-verificados).

### F-22 — Câmara

Épico: [MOD-26](https://linear.app/modo-cidadao/issue/MOD-26/f-22-camara).

- [F-22.01 · MOD-169 — Registrar acesso genérico ao Participe da Câmara](https://linear.app/modo-cidadao/issue/MOD-169/f-2201-registrar-acesso-generico-ao-participe-da-camara) — Concluída; sem prioridade.
- [F-22.02 · MOD-100 — Verificar enquetes e debates por proposta/evento](https://linear.app/modo-cidadao/issue/MOD-100/f-2202-verificar-enquetes-e-debates-por-propostaevento) — Backlog; normal.
- [F-22.03 · MOD-101 — Mostrar participação da Câmara em proposta/evento](https://linear.app/modo-cidadao/issue/MOD-101/f-2203-mostrar-participacao-da-camara-em-propostaevento) — Backlog; normal. Depende de: [F-20.03](https://linear.app/modo-cidadao/issue/MOD-97/f-2003-modelar-oportunidades-com-vinculo-e-prazo-verificados).

### F-23 — Informação e ouvidoria

Épico: [MOD-27](https://linear.app/modo-cidadao/issue/MOD-27/f-23-informacao-e-ouvidoria).

- [F-23.01 · MOD-102 — Mapear canais competentes de informação e ouvidoria](https://linear.app/modo-cidadao/issue/MOD-102/f-2301-mapear-canais-competentes-de-informacao-e-ouvidoria) — Backlog; normal.

### F-24 — Conta

Épico: [MOD-28](https://linear.app/modo-cidadao/issue/MOD-28/f-24-conta).

- [F-24.01 · MOD-170 — Registrar autenticação e logout locais da fundação](https://linear.app/modo-cidadao/issue/MOD-170/f-2401-registrar-autenticacao-e-logout-locais-da-fundacao) — Concluída; sem prioridade.
- [F-24.02 · MOD-103 — Implementar recuperação de senha](https://linear.app/modo-cidadao/issue/MOD-103/f-2402-implementar-recuperacao-de-senha) — Backlog; alta. Depende de: [F-24.06](https://linear.app/modo-cidadao/issue/MOD-107/f-2406-configurar-e-validar-e-mail-de-autenticacao-para-operacao).
- [F-24.03 · MOD-104 — Salvar preferências mínimas de UF, idioma e fuso](https://linear.app/modo-cidadao/issue/MOD-104/f-2403-salvar-preferencias-minimas-de-uf-idioma-e-fuso) — Backlog; normal.
- [F-24.04 · MOD-105 — Implementar exportação e exclusão da conta](https://linear.app/modo-cidadao/issue/MOD-105/f-2404-implementar-exportacao-e-exclusao-da-conta) — Backlog; alta. Depende de: [T-03.01](https://linear.app/modo-cidadao/issue/MOD-142/t-0301-definir-finalidade-retencao-e-direitos-dos-dados-pessoais).
- [F-24.05 · MOD-106 — Permitir gerenciamento de sessões suportado pelo provedor](https://linear.app/modo-cidadao/issue/MOD-106/f-2405-permitir-gerenciamento-de-sessoes-suportado-pelo-provedor) — Backlog; normal.
- [F-24.06 · MOD-107 — Configurar e validar e-mail de autenticação para operação pública](https://linear.app/modo-cidadao/issue/MOD-107/f-2406-configurar-e-validar-e-mail-de-autenticacao-para-operacao) — Backlog; alta. Depende de: [T-04.02](https://linear.app/modo-cidadao/issue/MOD-148/t-0402-escolher-hospedagem-worker-pooler-e-orcamento).

### F-25 — Seguir

Épico: [MOD-29](https://linear.app/modo-cidadao/issue/MOD-29/f-25-seguir).

- [F-25.01 · MOD-171 — Registrar follows privados de pessoas já entregues](https://linear.app/modo-cidadao/issue/MOD-171/f-2501-registrar-follows-privados-de-pessoas-ja-entregues) — Concluída; sem prioridade.
- [F-25.02 · MOD-108 — Permitir seguir propostas com RLS](https://linear.app/modo-cidadao/issue/MOD-108/f-2502-permitir-seguir-propostas-com-rls) — Backlog; alta. Depende de: [F-08.01](https://linear.app/modo-cidadao/issue/MOD-161/f-0801-revisar-detalhe-autoria-e-documentos-oficiais).
- [F-25.03 · MOD-109 — Permitir seguir temas com RLS](https://linear.app/modo-cidadao/issue/MOD-109/f-2503-permitir-seguir-temas-com-rls) — Backlog; normal. Depende de: [F-29.02](https://linear.app/modo-cidadao/issue/MOD-120/f-2902-criar-pagina-e-consulta-de-tema).
- [F-25.04 · MOD-110 — Organizar listas pessoais e granularidade de acompanhamento](https://linear.app/modo-cidadao/issue/MOD-110/f-2504-organizar-listas-pessoais-e-granularidade-de-acompanhamento) — Backlog; normal. Depende de: [F-25.02](https://linear.app/modo-cidadao/issue/MOD-108/f-2502-permitir-seguir-propostas-com-rls), [F-25.03](https://linear.app/modo-cidadao/issue/MOD-109/f-2503-permitir-seguir-temas-com-rls), [F-27.01](https://linear.app/modo-cidadao/issue/MOD-113/f-2701-criar-central-de-notificacoes-e-preferencias-privadas).

### F-26 — Feed pessoal

Épico: [MOD-30](https://linear.app/modo-cidadao/issue/MOD-30/f-26-feed-pessoal).

- [F-26.01 · MOD-111 — Construir consulta de feed pessoal a partir de eventos](https://linear.app/modo-cidadao/issue/MOD-111/f-2601-construir-consulta-de-feed-pessoal-a-partir-de-eventos) — Backlog; alta. Depende de: [T-01.06](https://linear.app/modo-cidadao/issue/MOD-134/t-0106-criar-eventos-de-dominio-e-outbox-com-deduplicacao), [F-25.02](https://linear.app/modo-cidadao/issue/MOD-108/f-2502-permitir-seguir-propostas-com-rls).
- [F-26.02 · MOD-112 — Criar feed com motivo, origem e estado vazio útil](https://linear.app/modo-cidadao/issue/MOD-112/f-2602-criar-feed-com-motivo-origem-e-estado-vazio-util) — Backlog; alta. Depende de: [F-26.01](https://linear.app/modo-cidadao/issue/MOD-111/f-2601-construir-consulta-de-feed-pessoal-a-partir-de-eventos).

### F-27 — Central e canais

Épico: [MOD-31](https://linear.app/modo-cidadao/issue/MOD-31/f-27-central-e-canais).

- [F-27.01 · MOD-113 — Criar central de notificações e preferências privadas](https://linear.app/modo-cidadao/issue/MOD-113/f-2701-criar-central-de-notificacoes-e-preferencias-privadas) — Backlog; alta.
- [F-27.02 · MOD-114 — Enviar notificações por e-mail com outbox e idempotência](https://linear.app/modo-cidadao/issue/MOD-114/f-2702-enviar-notificacoes-por-e-mail-com-outbox-e-idempotencia) — Backlog; alta. Depende de: [T-01.06](https://linear.app/modo-cidadao/issue/MOD-134/t-0106-criar-eventos-de-dominio-e-outbox-com-deduplicacao), [F-27.01](https://linear.app/modo-cidadao/issue/MOD-113/f-2701-criar-central-de-notificacoes-e-preferencias-privadas), [F-24.06](https://linear.app/modo-cidadao/issue/MOD-107/f-2406-configurar-e-validar-e-mail-de-autenticacao-para-operacao).
- [F-27.03 · MOD-115 — Adicionar resumo periódico e controle de frequência](https://linear.app/modo-cidadao/issue/MOD-115/f-2703-adicionar-resumo-periodico-e-controle-de-frequencia) — Backlog; normal. Depende de: [F-27.02](https://linear.app/modo-cidadao/issue/MOD-114/f-2702-enviar-notificacoes-por-e-mail-com-outbox-e-idempotencia), [T-01.05](https://linear.app/modo-cidadao/issue/MOD-133/t-0105-configurar-scheduler-que-enfileira-coletas).
- [F-27.04 · MOD-116 — Adicionar push web com consentimento e tratamento de subscrição](https://linear.app/modo-cidadao/issue/MOD-116/f-2704-adicionar-push-web-com-consentimento-e-tratamento-de-subscricao) — Backlog; normal. Depende de: [F-27.01](https://linear.app/modo-cidadao/issue/MOD-113/f-2701-criar-central-de-notificacoes-e-preferencias-privadas), [T-02.02](https://linear.app/modo-cidadao/issue/MOD-137/t-0202-implementar-instalacao-pwa-e-indisponibilidade-offline).

### F-28 — Busca transversal

Épico: [MOD-32](https://linear.app/modo-cidadao/issue/MOD-32/f-28-busca-transversal).

- [F-28.01 · MOD-117 — Criar busca transversal com FTS e tolerância a nomes](https://linear.app/modo-cidadao/issue/MOD-117/f-2801-criar-busca-transversal-com-fts-e-tolerancia-a-nomes) — Backlog; normal. Depende de: [F-07.02](https://linear.app/modo-cidadao/issue/MOD-59/f-0702-pesquisar-propostas-por-ementatexto-e-ampliar-filtros), [F-06.01](https://linear.app/modo-cidadao/issue/MOD-56/f-0601-importar-partidos-nomes-e-identificadores-oficiais), [F-11.01](https://linear.app/modo-cidadao/issue/MOD-72/f-1101-importar-votacoes-da-camara-com-objeto-e-modalidade).
- [F-28.02 · MOD-118 — Criar interface de busca com filtros compartilháveis](https://linear.app/modo-cidadao/issue/MOD-118/f-2802-criar-interface-de-busca-com-filtros-compartilhaveis) — Backlog; normal. Depende de: [F-28.01](https://linear.app/modo-cidadao/issue/MOD-117/f-2801-criar-busca-transversal-com-fts-e-tolerancia-a-nomes).

### F-29 — Temas

Épico: [MOD-33](https://linear.app/modo-cidadao/issue/MOD-33/f-29-temas).

- [F-29.01 · MOD-119 — Importar temas oficiais e mapear taxonomias explicitamente](https://linear.app/modo-cidadao/issue/MOD-119/f-2901-importar-temas-oficiais-e-mapear-taxonomias-explicitamente) — Backlog; normal.
- [F-29.02 · MOD-120 — Criar página e consulta de tema](https://linear.app/modo-cidadao/issue/MOD-120/f-2902-criar-pagina-e-consulta-de-tema) — Backlog; normal. Depende de: [F-29.01](https://linear.app/modo-cidadao/issue/MOD-119/f-2901-importar-temas-oficiais-e-mapear-taxonomias-explicitamente).

### F-30 — Compartilhar

Épico: [MOD-34](https://linear.app/modo-cidadao/issue/MOD-34/f-30-compartilhar).

- [F-30.01 · MOD-172 — Registrar URLs públicas e metadados da fundação](https://linear.app/modo-cidadao/issue/MOD-172/f-3001-registrar-urls-publicas-e-metadados-da-fundacao) — Concluída; sem prioridade.
- [F-30.02 · MOD-121 — Adicionar copiar link e compartilhamento contextual](https://linear.app/modo-cidadao/issue/MOD-121/f-3002-adicionar-copiar-link-e-compartilhamento-contextual) — Backlog; normal.
- [F-30.03 · MOD-122 — Criar sitemap e prévias públicas pertinentes](https://linear.app/modo-cidadao/issue/MOD-122/f-3003-criar-sitemap-e-previas-publicas-pertinentes) — Backlog; normal.

### F-31 — Proveniência

Épico: [MOD-35](https://linear.app/modo-cidadao/issue/MOD-35/f-31-proveniencia).

- [F-31.01 · MOD-173 — Registrar proveniência e RAW minimizado da fundação](https://linear.app/modo-cidadao/issue/MOD-173/f-3101-registrar-proveniencia-e-raw-minimizado-da-fundacao) — Concluída; sem prioridade.
- [F-31.02 · MOD-123 — Padronizar proveniência em todos os recursos](https://linear.app/modo-cidadao/issue/MOD-123/f-3102-padronizar-proveniencia-em-todos-os-recursos) — Backlog; normal.

### F-32 — Estados dos dados

Épico: [MOD-36](https://linear.app/modo-cidadao/issue/MOD-36/f-32-estados-dos-dados).

- [F-32.01 · MOD-174 — Registrar estados de dados e demo explícita existentes](https://linear.app/modo-cidadao/issue/MOD-174/f-3201-registrar-estados-de-dados-e-demo-explicita-existentes) — Concluída; sem prioridade.
- [F-32.02 · MOD-124 — Exibir fonte desatualizada, indisponível e registro sob revisão](https://linear.app/modo-cidadao/issue/MOD-124/f-3202-exibir-fonte-desatualizada-indisponivel-e-registro-sob-revisao) — Backlog; normal. Depende de: [T-04.05](https://linear.app/modo-cidadao/issue/MOD-151/t-0405-adicionar-metricas-e-logs-operacionais-com-minimizacao), [F-33.01](https://linear.app/modo-cidadao/issue/MOD-125/f-3301-criar-registro-de-relato-de-erro-e-trilha-de-correcao).

### F-33 — Correções

Épico: [MOD-37](https://linear.app/modo-cidadao/issue/MOD-37/f-33-correcoes).

- [F-33.01 · MOD-125 — Criar registro de relato de erro e trilha de correção](https://linear.app/modo-cidadao/issue/MOD-125/f-3301-criar-registro-de-relato-de-erro-e-trilha-de-correcao) — Backlog; normal.
- [F-33.02 · MOD-126 — Criar revisão de correções com responsável e histórico](https://linear.app/modo-cidadao/issue/MOD-126/f-3302-criar-revisao-de-correcoes-com-responsavel-e-historico) — Backlog; normal. Depende de: [F-33.01](https://linear.app/modo-cidadao/issue/MOD-125/f-3301-criar-registro-de-relato-de-erro-e-trilha-de-correcao), [T-03.02](https://linear.app/modo-cidadao/issue/MOD-143/t-0302-implementar-papeis-administrativos-protegidos-e-auditoria).

### F-34 — Ferramentas internas

Épico: [MOD-38](https://linear.app/modo-cidadao/issue/MOD-38/f-34-ferramentas-internas).

- [F-34.01 · MOD-127 — Criar painel privado de sincronizações e cobertura](https://linear.app/modo-cidadao/issue/MOD-127/f-3401-criar-painel-privado-de-sincronizacoes-e-cobertura) — Backlog; normal. Depende de: [T-03.02](https://linear.app/modo-cidadao/issue/MOD-143/t-0302-implementar-papeis-administrativos-protegidos-e-auditoria), [T-01.03](https://linear.app/modo-cidadao/issue/MOD-131/t-0103-implementar-jobs-persistentes-com-lease-heartbeat-e-retries).
- [F-34.02 · MOD-128 — Permitir reprocessamento controlado e cancelamento de jobs](https://linear.app/modo-cidadao/issue/MOD-128/f-3402-permitir-reprocessamento-controlado-e-cancelamento-de-jobs) — Backlog; normal. Depende de: [F-34.01](https://linear.app/modo-cidadao/issue/MOD-127/f-3401-criar-painel-privado-de-sincronizacoes-e-cobertura), [T-01.07](https://linear.app/modo-cidadao/issue/MOD-135/t-0107-implementar-reconciliacao-backfill-e-replay-de-raw).
- [F-34.03 · MOD-129 — Unificar revisão de identidade, links e resumos](https://linear.app/modo-cidadao/issue/MOD-129/f-3403-unificar-revisao-de-identidade-links-e-resumos) — Backlog; normal. Depende de: [T-03.02](https://linear.app/modo-cidadao/issue/MOD-143/t-0302-implementar-papeis-administrativos-protegidos-e-auditoria), [F-19.01](https://linear.app/modo-cidadao/issue/MOD-94/f-1901-modelar-vinculo-comprovado-entre-candidatura-pessoa-e-mandato), [F-33.01](https://linear.app/modo-cidadao/issue/MOD-125/f-3301-criar-registro-de-relato-de-erro-e-trilha-de-correcao).

### T-01 — Ingestão, sincronização e eventos

Épico: [MOD-39](https://linear.app/modo-cidadao/issue/MOD-39/t-01-ingestao-sincronizacao-e-eventos).

- [T-01.01 · MOD-175 — Registrar worker manual e contratos da Câmara existentes](https://linear.app/modo-cidadao/issue/MOD-175/t-0101-registrar-worker-manual-e-contratos-da-camara-existentes) — Concluída; sem prioridade.
- [T-01.02 · MOD-130 — Decidir fila, recortes de cobertura e frequência por recurso](https://linear.app/modo-cidadao/issue/MOD-130/t-0102-decidir-fila-recortes-de-cobertura-e-frequencia-por-recurso) — Backlog; alta.
- [T-01.03 · MOD-131 — Implementar jobs persistentes com lease, heartbeat e retries](https://linear.app/modo-cidadao/issue/MOD-131/t-0103-implementar-jobs-persistentes-com-lease-heartbeat-e-retries) — Backlog; alta. Depende de: [T-01.02](https://linear.app/modo-cidadao/issue/MOD-130/t-0102-decidir-fila-recortes-de-cobertura-e-frequencia-por-recurso).
- [T-01.04 · MOD-132 — Implementar retomada de checkpoint e sincronização incremental](https://linear.app/modo-cidadao/issue/MOD-132/t-0104-implementar-retomada-de-checkpoint-e-sincronizacao-incremental) — Backlog; alta. Depende de: [T-01.03](https://linear.app/modo-cidadao/issue/MOD-131/t-0103-implementar-jobs-persistentes-com-lease-heartbeat-e-retries).
- [T-01.05 · MOD-133 — Configurar scheduler que enfileira coletas](https://linear.app/modo-cidadao/issue/MOD-133/t-0105-configurar-scheduler-que-enfileira-coletas) — Backlog; alta. Depende de: [T-01.03](https://linear.app/modo-cidadao/issue/MOD-131/t-0103-implementar-jobs-persistentes-com-lease-heartbeat-e-retries), [T-04.03](https://linear.app/modo-cidadao/issue/MOD-149/t-0403-validar-imagem-e-processo-de-entrega-no-destino-escolhido).
- [T-01.06 · MOD-134 — Criar eventos de domínio e outbox com deduplicação](https://linear.app/modo-cidadao/issue/MOD-134/t-0106-criar-eventos-de-dominio-e-outbox-com-deduplicacao) — Backlog; alta.
- [T-01.07 · MOD-135 — Implementar reconciliação, backfill e replay de RAW](https://linear.app/modo-cidadao/issue/MOD-135/t-0107-implementar-reconciliacao-backfill-e-replay-de-raw) — Backlog; normal. Depende de: [T-01.04](https://linear.app/modo-cidadao/issue/MOD-132/t-0104-implementar-retomada-de-checkpoint-e-sincronizacao-incremental).

### T-02 — Experiência, acessibilidade e PWA

Épico: [MOD-40](https://linear.app/modo-cidadao/issue/MOD-40/t-02-experiencia-acessibilidade-e-pwa).

- [T-02.01 · MOD-136 — Verificar acessibilidade nos fluxos principais](https://linear.app/modo-cidadao/issue/MOD-136/t-0201-verificar-acessibilidade-nos-fluxos-principais) — Backlog; alta.
- [T-02.02 · MOD-137 — Implementar instalação PWA e indisponibilidade offline](https://linear.app/modo-cidadao/issue/MOD-137/t-0202-implementar-instalacao-pwa-e-indisponibilidade-offline) — Backlog; normal.
- [T-02.03 · MOD-138 — Definir e medir orçamento de desempenho](https://linear.app/modo-cidadao/issue/MOD-138/t-0203-definir-e-medir-orcamento-de-desempenho) — Backlog; normal.
- [T-02.04 · MOD-139 — Decidir necessidade de cliente mobile nativo](https://linear.app/modo-cidadao/issue/MOD-139/t-0204-decidir-necessidade-de-cliente-mobile-nativo) — Backlog; baixa; opcional. Depende de: [T-03.04](https://linear.app/modo-cidadao/issue/MOD-145/t-0304-definir-politica-de-api-externa-e-controles-operacionais).
- [T-02.05 · MOD-140 — Definir marca, domínio e identidade visual](https://linear.app/modo-cidadao/issue/MOD-140/t-0205-definir-marca-dominio-e-identidade-visual) — Backlog; normal.
- [T-02.06 · MOD-141 — Avaliar expansão estadual/distrital/municipal com fontes verificáveis](https://linear.app/modo-cidadao/issue/MOD-141/t-0206-avaliar-expansao-estadualdistritalmunicipal-com-fontes) — Backlog; baixa; opcional.

### T-03 — Privacidade, autorização e recuperação

Épico: [MOD-41](https://linear.app/modo-cidadao/issue/MOD-41/t-03-privacidade-autorizacao-e-recuperacao).

- [T-03.01 · MOD-142 — Definir finalidade, retenção e direitos dos dados pessoais](https://linear.app/modo-cidadao/issue/MOD-142/t-0301-definir-finalidade-retencao-e-direitos-dos-dados-pessoais) — Backlog; alta.
- [T-03.02 · MOD-143 — Implementar papéis administrativos protegidos e auditoria](https://linear.app/modo-cidadao/issue/MOD-143/t-0302-implementar-papeis-administrativos-protegidos-e-auditoria) — Backlog; alta.
- [T-03.03 · MOD-144 — Ampliar isolamento de dados e fronteiras para novos recursos](https://linear.app/modo-cidadao/issue/MOD-144/t-0303-ampliar-isolamento-de-dados-e-fronteiras-para-novos-recursos) — Backlog; alta.
- [T-03.04 · MOD-145 — Definir política de API externa e controles operacionais](https://linear.app/modo-cidadao/issue/MOD-145/t-0304-definir-politica-de-api-externa-e-controles-operacionais) — Backlog; normal.
- [T-03.05 · MOD-146 — Configurar backup e testar restauração](https://linear.app/modo-cidadao/issue/MOD-146/t-0305-configurar-backup-e-testar-restauracao) — Backlog; alta. Depende de: [T-04.02](https://linear.app/modo-cidadao/issue/MOD-148/t-0402-escolher-hospedagem-worker-pooler-e-orcamento), [T-03.01](https://linear.app/modo-cidadao/issue/MOD-142/t-0301-definir-finalidade-retencao-e-direitos-dos-dados-pessoais).
- [T-03.06 · MOD-147 — Implementar limpeza e retenção auditadas](https://linear.app/modo-cidadao/issue/MOD-147/t-0306-implementar-limpeza-e-retencao-auditadas) — Backlog; normal. Depende de: [T-03.01](https://linear.app/modo-cidadao/issue/MOD-142/t-0301-definir-finalidade-retencao-e-direitos-dos-dados-pessoais).

### T-04 — Entrega, operação e qualidade

Épico: [MOD-42](https://linear.app/modo-cidadao/issue/MOD-42/t-04-entrega-operacao-e-qualidade).

- [T-04.01 · MOD-176 — Registrar fundação Bun, monorepo, banco e CI existentes](https://linear.app/modo-cidadao/issue/MOD-176/t-0401-registrar-fundacao-bun-monorepo-banco-e-ci-existentes) — Concluída; sem prioridade.
- [T-04.02 · MOD-148 — Escolher hospedagem, worker, pooler e orçamento](https://linear.app/modo-cidadao/issue/MOD-148/t-0402-escolher-hospedagem-worker-pooler-e-orcamento) — Backlog; alta.
- [T-04.03 · MOD-149 — Validar imagem e processo de entrega no destino escolhido](https://linear.app/modo-cidadao/issue/MOD-149/t-0403-validar-imagem-e-processo-de-entrega-no-destino-escolhido) — Backlog; alta. Depende de: [T-04.02](https://linear.app/modo-cidadao/issue/MOD-148/t-0402-escolher-hospedagem-worker-pooler-e-orcamento).
- [T-04.04 · MOD-150 — Separar local, preview e produção no pipeline](https://linear.app/modo-cidadao/issue/MOD-150/t-0404-separar-local-preview-e-producao-no-pipeline) — Backlog; alta. Depende de: [T-04.02](https://linear.app/modo-cidadao/issue/MOD-148/t-0402-escolher-hospedagem-worker-pooler-e-orcamento).
- [T-04.05 · MOD-151 — Adicionar métricas e logs operacionais com minimização](https://linear.app/modo-cidadao/issue/MOD-151/t-0405-adicionar-metricas-e-logs-operacionais-com-minimizacao) — Backlog; alta.
- [T-04.06 · MOD-152 — Testar falhas de fonte, envio e recuperação de jobs](https://linear.app/modo-cidadao/issue/MOD-152/t-0406-testar-falhas-de-fonte-envio-e-recuperacao-de-jobs) — Backlog; normal. Depende de: [T-01.03](https://linear.app/modo-cidadao/issue/MOD-131/t-0103-implementar-jobs-persistentes-com-lease-heartbeat-e-retries), [T-01.06](https://linear.app/modo-cidadao/issue/MOD-134/t-0106-criar-eventos-de-dominio-e-outbox-com-deduplicacao).

### T-05 — Colaboração e governança do repositório

Épico: [MOD-43](https://linear.app/modo-cidadao/issue/MOD-43/t-05-colaboracao-e-governanca-do-repositorio).

- [T-05.01 · MOD-153 — Escrever guia de contribuição e onboarding local](https://linear.app/modo-cidadao/issue/MOD-153/t-0501-escrever-guia-de-contribuicao-e-onboarding-local) — Backlog; alta.
- [T-05.02 · MOD-154 — Criar templates de issue e PR com aceite e validação](https://linear.app/modo-cidadao/issue/MOD-154/t-0502-criar-templates-de-issue-e-pr-com-aceite-e-validacao) — Backlog; alta.
- [T-05.03 · MOD-155 — Configurar integração GitHub/Linear para rastrear entregas](https://linear.app/modo-cidadao/issue/MOD-155/t-0503-configurar-integracao-githublinear-para-rastrear-entregas) — Backlog; alta.
- [T-05.04 · MOD-156 — Definir revisão, responsabilidades e acesso de colaboradores](https://linear.app/modo-cidadao/issue/MOD-156/t-0504-definir-revisao-responsabilidades-e-acesso-de-colaboradores) — Backlog; normal.
