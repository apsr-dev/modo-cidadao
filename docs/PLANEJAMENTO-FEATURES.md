# Planejamento de funcionalidades — Plataforma cívica

Data de consolidação: 06/10/2026. Nome definitivo: em aberto.

Este documento descreve **o que o produto deve oferecer**. Arquitetura e persistência pertencem a [PLANEJAMENTO-TECNICO.md](PLANEJAMENTO-TECNICO.md); fontes e mecanismos oficiais, a [RECURSOS.md](RECURSOS.md). Não é uma lista de features já implementadas nem um cronograma de etapas.

## 1. Visão e decisões de produto

Ajudar o cidadão a entender quem o representa, acompanhar decisões públicas e participar além do voto, reunindo informações que hoje estão dispersas em portais oficiais.

A experiência central é: **descobrir → entender → acompanhar → participar**. Cada informação relevante deve oferecer um próximo passo concreto: abrir o texto oficial, seguir a proposta, ver a votação, consultar o contato ou participar no canal competente.

### Núcleo do produto: compreender, agir e acompanhar

Decisão de produto confirmada em 21/10/2026: **transformar fatos públicos verificáveis em compreensão, ação cidadã e acompanhamento contínuo**. Esse princípio orienta todas as funcionalidades, inclusive decisões de apresentação, dados e operação.

A experiência deve ser utilizável por pessoas com diferentes escolaridades e pouca familiaridade com política, orçamento ou termos jurídicos. Usar linguagem simples e respeitosa, sem infantilizar. Não exigir conhecimento prévio para encontrar uma situação, entender o que se sabe e escolher um próximo passo.

A unidade de experiência é uma questão pública compreensível: uma decisão, proposta, gasto, entrega ou cobrança. Diretórios, tabelas e documentos permanecem disponíveis para busca e conferência; as jornadas conectam esses registros às perguntas do cidadão e à cobertura real.

Cada jornada deve permitir responder, quando a evidência existir:

1. **O que aconteceu?** Apresentar o fato, seu estado, período e uma explicação curta.
2. **Por que isso importa?** Explicar a finalidade e a relação documentada com a questão acompanhada, distinguindo efeito previsto de resultado comprovado.
3. **Quem responde por cada parte?** Identificar os papéis comprovados de decisão, destinação, execução e fiscalização, com canal competente quando verificado.
4. **O que posso fazer?** Oferecer uma ação pertinente, como entender o texto, acompanhar mudanças, participar no canal oficial ou preparar um pedido de informação.
5. **Como acompanho depois?** Explicar onde consultar mudanças, respostas e providências dentro das capacidades efetivamente implementadas.

Primeiro mostrar explicação, situação e próximo passo; detalhes técnicos e documentos ficam acessíveis por aprofundamento. Termos oficiais devem ter explicação junto à informação, preservando o termo original para conferência. Recursos visuais precisam de rótulos, texto equivalente e contexto; não depender apenas de cor.

Fonte, data do fato quando conhecida, data da coleta e limites de cobertura devem continuar acessíveis. Explicitar o que não foi informado, não foi coletado ou ainda não pôde ser verificado. Uma síntese não pode inventar vínculos, responsáveis, causalidade ou conclusões sobre corrupção. A simplificação é obrigatória na experiência; o uso de IA continua opcional e sujeito às regras de F-09.

Para dados financeiros, acompanhar a movimentação do dinheiro e a entrega como estados distintos, cada qual sustentado por evidência própria. Pagamento registrado não comprova serviço entregue. Em participação, distinguir abertura de canal, envio, resposta e providência; sem evidência, não afirmar conclusão.

Esta diretriz orienta a implementação e revisão das funcionalidades atuais e futuras. Não declara novas fontes, mecanismos de cobrança ou integrações financeiras já implementados. Decisão e consequências em [ADR 007](decisions/007-compreensao-acao-acompanhamento.md).

| Assunto | Decisão consolidada |
| --- | --- |
| Público | Prioridade para jovens adultos de aproximadamente 18–35 anos, sem excluir outras idades. |
| Abrangência | Brasil; cobertura operacional federal/Congresso: Câmara e Senado, com informações eleitorais do TSE. |
| Outras esferas | Modelo preparado para estados e municípios; expansão depende de fonte verificável e cobertura explicitada. |
| Neutralidade | Exibir fatos, contexto e fontes. Sem nota, ranking de qualidade, classificação ideológica ou recomendação de voto. |
| Plataforma | Web responsiva/mobile-first e PWA; aplicativo React Native/Expo é possibilidade de evolução, não implementação exigida agora. |
| Personalização | Acompanhamento escolhido pelo cidadão, sem inferência de posicionamento político. |
| Marca | Faz Valer, Modo Cidadão e outros nomes foram considerados; nenhum nome foi confirmado. |
| Exclusões | Canal, YouTube, estratégia de conteúdo e blog editorial estão fora deste planejamento. |

Os detalhes operacionais abaixo são especificações propostas para transformar o escopo discutido em software. Novas escolhas — como provedor de login, frequência exata de alertas ou limite de comparação — precisam ser registradas quando adotadas. Não representam decisões históricas já confirmadas.

## 2. Home e descoberta

**F-01 — Entrada do produto**

- Mensagem clara: a participação política continua depois da eleição.
- Acesso imediato a representantes, propostas, votações e oportunidades de participação.
- Campo de busca e seleção manual de UF; município opcional para contexto e expansão, sem prometer representantes locais ainda não cobertos.
- Bloco “O que está acontecendo” baseado em atualizações verificadas, com critérios explícitos de seleção, como atividade recente ou agenda oficial.
- Indicação de cobertura, fonte e atualização nos cards quando pertinente.
- Navegação pública sem exigir conta. Login só quando a funcionalidade depende de persistência pessoal.

**Aceitação:** um visitante encontra os representantes federais de uma UF e acessa uma ação oficial sem criar conta. Nenhum estado ou cidade sem dados aparece como se tivesse cobertura completa.

## 3. Representantes e pessoas

**F-02 — Diretório**

- Listar deputados federais e senadores em exercício, com histórico separado quando disponível.
- Busca por nome civil/parlamentar; filtros por UF, Casa, partido, exercício e período/legislatura.
- Mostrar foto oficial, nome, cargo/mandato, UF, partido e situação de exercício com proveniência.
- Paginação e URL compartilhável preservando filtros. Ordenação alfabética ou por critérios objetivos explicitados; não por qualidade política.
- “Quem me representa” apresenta a bancada federal da UF; não presume saber em quem o usuário votou.

**F-03 — Perfil**

- Identidade da pessoa, biografia disponível, mandatos e períodos de exercício.
- Partido atual e histórico de filiação com períodos e fonte, quando obtidos.
- Cargos e participação em comissões; links para órgãos e atividades relacionadas.
- Propostas de autoria/coautoria, relatorias e votações com papéis distintos.
- Gastos parlamentares e candidatura/histórico eleitoral como seções próprias.
- Seguir/deixar de seguir; abrir perfil oficial; compartilhar URL.
- Distinguir titular, suplente, licenciado, fora de exercício e candidato, conforme dados da fonte.

**Aceitação:** mudança de partido não reescreve o partido em votações passadas. Candidatura ou eleição não é exibida automaticamente como mandato em exercício.

## 4. Contato direto

**F-04 — Contatos oficiais**

- E-mail institucional, telefone do gabinete, site, endereço público de atendimento e redes sociais divulgadas oficialmente, conforme disponibilidade.
- Diferenciar contato institucional, perfil pessoal divulgado e canal genérico da instituição.
- Ações de copiar, abrir `mailto:`, abrir `tel:` e visitar o link; indicação de origem e data da última verificação.
- Quando não houver contato individual válido, apresentar o canal institucional adequado, sem inventar endereço.
- Não afirmar que houve entrega, leitura ou resposta porque o usuário clicou no link.

**F-05 — Preparar uma mensagem**

Como apoio de interface proposto, oferecer um rascunho editável com assunto, referência da proposta e pergunta/pedido objetivo. O cidadão revisa o texto e usa o canal oficial. O produto não envia automaticamente, não dispara para bancadas e não garante resposta.

**Aceitação:** o destinatário e o assunto são visíveis antes da ação; copiar/abrir um rascunho não é tratado como mensagem enviada. IA para esse rascunho é opcional e precisa de definição própria.

## 5. Partidos e composição parlamentar

**F-06 — Diretório de partidos**

- Sigla, nome, identificadores oficiais, links institucionais e histórico de nomes/siglas quando disponível.
- Bancada por Casa, UF e período, com relação a pessoas e mandatos.
- Blocos e lideranças quando a fonte os oferecer.
- Filiação temporal no contexto de cada mandato/votação.
- Nenhuma escala automática de esquerda/direita ou avaliação de mérito.

**Aceitação:** partidos, federações e blocos não são tratados como a mesma entidade; suas diferenças e a cobertura de dados são explicitadas.

## 6. Propostas legislativas

**F-07 — Catálogo e busca**

- Pesquisar por identificador — por exemplo, PL, número e ano —, ementa, texto indexável, autoria e tema.
- Filtros por Casa, tipo, ano, tema, autor, situação e período de atividade; UF só quando a relação de autoria/representação fizer sentido e estiver indicada.
- Distinguir projeto principal, emenda, substitutivo, requerimento, parecer e outros documentos.
- Exibir identificador oficial, ementa, autoria, data, órgão atual, situação e atividade recente.
- Ordenar por data ou relevância de busca documentada, nunca por posição política.

**F-08 — Detalhe e entendimento**

- Texto/ementa oficial, autores, relator, temas e links do inteiro teor.
- Histórico de tramitações, documentos e versões; relações com propostas acessórias e tramitação na outra Casa.
- Votações relacionadas, com o objeto de cada decisão.
- Participação oficial vinculada, quando o vínculo tiver sido verificado.
- Seguir, compartilhar e abrir a página oficial.

**F-09 — Explicação simplificada**

Camada derivada opcional planejada com IA: “em uma frase”, “o que o texto propõe”, “o que mudaria”, “quem pode ser afetado” e termos essenciais. Afirmações sobre a regra atual precisam também da norma vigente como fonte; o projeto sozinho não comprova como a legislação funciona hoje.

Mostrar que a explicação é gerada, sua data, documentos usados e versão analisada. Não apresentar previsão de impacto como fato, inventar destinatários nem atribuir intenções ao autor. Permitir informar problema no resumo. Sem texto suficiente ou validação, manter o dado oficial e informar indisponibilidade da explicação.

**Aceitação:** uma alteração do texto não reaproveita silenciosamente resumo da versão anterior. O usuário identifica o documento resumido e acessa as fontes.

## 7. Histórico e tramitação

**F-10 — Linha do tempo**

- Eventos em ordem temporal, órgão responsável, descrição original e explicação curta quando necessária.
- Situação atual como síntese do histórico; eventos anteriores permanecem consultáveis.
- Separar horário de ocorrência e horário em que o sistema conheceu o evento.
- Preservar retificações e links entre documentos, sem sugerir que todo projeto segue uma sequência linear fixa.
- Distinguir aprovação de parecer/requerimento, aprovação em uma Casa e transformação em norma. O status “aprovado” precisa de contexto.

**Aceitação:** o produto não afirma “virou lei” com base só na aprovação em plenário. Ausência de novas tramitações não é apresentada como conclusão.

## 8. Votações e votos

**F-11 — Diretório de votações**

- Filtros por Casa, órgão, data, proposta, assunto e modalidade disponível.
- Mostrar objeto, documento/versão, resultado oficial e vínculo com proposta principal/acessória.
- Distinguir votação nominal, simbólica e outras modalidades informadas pela fonte.

**F-12 — Detalhe da decisão**

- Resultado, data, órgão, totais e lista de votos individuais quando existem.
- Registrar sim, não, abstenção, obstrução e demais códigos preservando o valor original; não converter ausência de registro em “não”.
- Filtrar votos por pessoa, UF e partido no momento da votação.
- Orientação de bancada em seção separada do voto efetivo, quando disponível.
- Compartilhar e abrir registro oficial.

**F-13 — Atuação individual**

Histórico de votos no perfil do representante, com assunto, objeto da votação e resultado. Eventual comparação de registros lado a lado é uma especificação opcional de apresentação factual; não calcula pontuação ou “melhor representante”.

**Aceitação:** votação simbólica nunca recebe votos individuais inventados. Voto sobre procedimento não é rotulado como apoio/oposição ao mérito integral da lei. Cobertura parcial ou totais que não se reconciliam ficam visíveis.

Referência para interpretação: [guia oficial de dados de votações da Câmara](https://dadosabertos.camara.leg.br/howtouse/2020-02-07-dados-votacoes.html).

## 9. Comissões, órgãos, eventos e agenda

**F-14 — Instituições e comissões**

- Diretório de comissões/órgãos, finalidade e composição por período.
- Presidência, membros, suplentes e papel de cada pessoa conforme fonte.
- Propostas em análise, relatorias, reuniões e links oficiais.

**F-15 — Agenda**

- Eventos oficiais com data, horário/fuso, órgão, situação e pauta.
- Relação a propostas, temas e representantes quando a fonte permitir.
- Destaque de audiência ou evento com participação pública verificada.
- Link de transmissão/página oficial quando disponível; avisos de cancelamento/adiamento.
- Não tratar item da pauta como garantia de que será votado naquele dia.

**Aceitação:** agenda informa quando foi consultada; um evento reagendado não continua produzindo alertas no horário antigo.

## 10. Gastos e fiscalização

**F-16 — Despesas parlamentares**

- Consultar despesas da Câmara e cotas do Senado com filtros por pessoa, Casa, período, categoria e fornecedor quando disponível.
- Valores em reais, documento/recibo ou URL oficial, data de competência e categoria original.
- Resumos por período/categoria e evolução temporal com base de cálculo explícita.
- Separar regimes e tipos de gasto; não chamar cota parlamentar de salário e não somar categorias incompatíveis como “custo total do político”.
- Ajustes, devoluções e retificações preservados; zero difere de dado ausente.
- Cobertura e atualização próprias de cada dataset. Exibir despesa não implica irregularidade.

**F-17 — Acesso a mecanismos de fiscalização**

Direcionar para transparência, acesso à informação e ouvidorias competentes. Explicar a finalidade de cada canal dentro do fluxo de participação, sem prometer investigação ou resultado.

**Aceitação:** cada agregado identifica fonte, período e categorias incluídas. Comparações, se oferecidas, são factuais e acompanhadas das diferenças de regime; não criam ranking moral.

## 11. Eleições e candidaturas

**F-18 — Consulta eleitoral**

- Eleições por ano, cargo e UF dentro da cobertura definida.
- Candidato, nome de urna, número, partido/federação/coligação conforme aplicável e situação oficial do registro.
- Foto, redes declaradas, bens declarados, plano de governo quando existir para o cargo e histórico de candidaturas disponíveis nos datasets.
- Resultados eleitorais de fonte específica quando integrados; não inferir eleição a partir do cadastro de candidatos.
- Link para a consulta oficial do TSE e aviso de atualização/retificação.

**F-19 — Continuidade da pessoa**

Ligar candidatura a pessoa e a mandato apenas quando a identidade e os eventos tiverem sido verificados. O usuário pode consultar trajetória eleitoral sem confundir candidato, eleito, diplomado e empossado.

**Aceitação:** quantidade ou valor de bens declarados não vira indicador de corrupção. Cargo sem plano de governo disponível mostra ausência adequada. Cada candidatura mantém partido e situação daquele pleito.

Referência de disponibilidade: [dataset de candidatos de 2026 do TSE](https://dadosabertos.tse.jus.br/dataset/candidatos-2026).

## 12. Participação além do voto

**F-20 — Hub “Participe”**

Organizar mecanismos por intenção: falar com representante, opinar sobre proposta, sugerir ideia legislativa, participar de audiência, pedir informação e fiscalizar.

Cada oportunidade deve informar instituição responsável, objetivo, assunto, requisitos de acesso, prazo se houver, situação verificada e botão para o canal oficial. A conta deste produto não substitui o login do portal público.

**F-21 — Senado/e-Cidadania**

- Acesso a ideias legislativas, consultas públicas e eventos interativos.
- Vínculo com matéria/evento específico apenas quando verificado.
- Regras de apoio, elegibilidade e prazo consultadas no portal oficial; não fixar números ou prazos em código sem revisão.
- Apoiar uma ideia não significa aprovação de lei. Opinião em consulta não é voto parlamentar nem referendo.

**F-22 — Câmara**

Acesso a enquetes e debates interativos oficiais, indicando o texto/versão correspondente. Participação em enquete é manifestação naquele canal; o produto não a apresenta como pesquisa representativa da população.

**F-23 — Informação e ouvidoria**

Links para canais oficiais de acesso à informação, reclamação/sugestão ou outras manifestações, conforme a instituição. A escolha do destinatário precisa respeitar a competência do órgão.

**Aceitação:** não há envio automático de apoio, voto ou mensagem. Um clique externo é registrado, no máximo, como abertura de link; não comprova participação concluída. O produto não solicita senha de gov.br.

Fontes: [sobre o e-Cidadania](https://www12.senado.leg.br/ecidadania/sobre) e [Participe da Câmara](https://www.camara.leg.br/participe).

## 13. Conta e “Meu Brasil”

**F-24 — Conta**

- Login, logout, recuperação conforme método de autenticação escolhido e gerenciamento de sessões quando suportado.
- Perfil mínimo: preferências de UF, idioma/fuso quando necessário e notificações. Sem pedir CPF, título eleitoral ou endereço completo para navegar/seguir.
- Exportação e exclusão de dados pessoais; explicação de retenção pertinente.

**F-25 — Seguir**

- Seguir/deixar de seguir pessoas, propostas e temas.
- Listas pessoais privadas e consistentes entre sessões.
- Escolha de granularidade dos alertas, sem assumir apoio político porque a pessoa segue um representante.
- Uma pessoa não é seguida duas vezes por ter dois mandatos ou identificadores externos.

**F-26 — Feed pessoal**

- Atualizações de representantes, propostas e temas selecionados.
- Eventos de tramitação, novas votações, novos registros relevantes e oportunidades de participação.
- Mostrar motivo da inclusão (“você acompanha esta proposta”), ocorrência, fonte e link de detalhe.
- Ordenação previsível, preferencialmente cronológica; sem recomendar posições políticas.
- Estado vazio útil com opção de escolher acompanhamentos.

**Aceitação:** outro usuário não acessa follows/feed/preferências pelo ID ou URL. Seguir alguém não é exibido publicamente nem usado para inferir voto.

## 14. Alertas e notificações

**F-27 — Central e canais**

- Notificações dentro da plataforma, estado lido/não lido e preferência por categoria.
- E-mail mediante escolha; push web quando houver suporte e consentimento do navegador.
- Resumo periódico e envio por evento como opções de produto a definir; sem promessa de tempo real.
- Controle de frequência, pausa, descadastro e tratamento de endereço/subscrição inválida.
- Evitar duplicatas: reprocessar o mesmo dado não gera outro alerta.
- Retificação importante pode gerar atualização específica, com explicação.

**Aceitação:** evento antigo importado como histórico não dispara aviso como se tivesse acontecido hoje. Aviso de agenda não afirma que uma votação está confirmada.

## 15. Busca, temas e compartilhamento

**F-28 — Busca transversal**

Resultados por representantes, propostas, partidos e votações, com identidade clara do tipo. Busca tolerante a acentos/pequenos erros, filtros combináveis, paginação e URL estável. Termos desconhecidos e resultados vazios não quebram a tela.

**F-29 — Temas**

Categorias oficiais preservadas e, se necessário, taxonomia própria mapeada de forma explícita. Página de tema reúne propostas/atividades e permite seguir. Tema sem correspondência não é inventado automaticamente como oficial.

**F-30 — Compartilhar**

URLs públicas estáveis, título e prévia pertinentes, botão copiar/link de compartilhamento quando disponível. Filtros públicos podem ser compartilhados; preferências privadas nunca entram no URL público.

## 16. Credibilidade e qualidade visíveis

**F-31 — Proveniência**

Origem, link oficial, data da ocorrência quando houver, data da coleta e última verificação relevante. O carimbo “coletado agora” não significa que a fonte publicou uma atualização agora.

**F-32 — Estados dos dados**

Distinguir disponível, não informado, não se aplica, não coletado, fonte indisponível e registro sob revisão. Cobertura parcial deve ser visível, especialmente em histórico, votos e gastos.

**F-33 — Correções**

Mecanismo proposto para informar erro de dado, vínculo ou resumo, com referência ao registro. Correção interna preserva a informação original e sua trilha, sem alterar silenciosamente fatos oficiais.

**Aceitação:** dados de demonstração, dados oficiais e explicação derivada têm apresentação distinta. A falha de uma fonte não apaga o último dado válido nem o apresenta como recém-verificado.

## 17. Administração e operação

**F-34 — Ferramentas internas**

Complemento operacional necessário: visualizar sincronizações, cobertura, erros e divergências; reprocessar dados de forma controlada; revisar identidade entre fontes, links de participação e resumos; administrar permissões e registrar alterações. Painel privado, sem dados pessoais desnecessários.

**Aceitação:** usuário comum não executa importação ou altera dado público. Uma revisão tem responsável, motivo e histórico.

## 18. Requisitos transversais

- Interface em português do Brasil, linguagem direta, termos técnicos explicados junto à informação.
- Responsividade, teclado, foco visível, contraste, textos alternativos e gráficos compreensíveis sem depender de cor.
- Listas grandes paginadas; leitura pública rápida e compartilhável.
- Instalação PWA e página de indisponibilidade. Conteúdo oficial em cache informa data; ações pessoais não são consideradas enviadas offline.
- Conta e preferências privadas protegidas; sem analytics que exporte escolhas políticas individuais.
- Interface adaptada à cobertura real de cada fonte e sem marketing de funcionalidade ainda inexistente.
- Não prometer que o site é oficial, que representa uma instituição ou que uma ação garante resultado legislativo.

### Aceitação comum: utilidade para o cidadão

Toda entrega deve explicar qual pergunta do cidadão ajuda a responder e como contribui para compreender, agir ou acompanhar. Features técnicas e internas demonstram essa contribuição por meio das jornadas que sustentam; não precisam inventar ações cívicas em telas de infraestrutura ou conta.

Na revisão de jornadas públicas, verificar:

- Explicação inicial compreensível sem conhecimento prévio de política ou orçamento, com detalhes e termos oficiais disponíveis para aprofundamento.
- Fatos e relações sustentados por fontes, com responsáveis por papel, datas, cobertura e lacunas identificáveis.
- Próximo passo pertinente e disponível, incluindo sua finalidade e seus limites; o usuário sabe onde acompanhar mudanças quando o recurso existir.
- Estados financeiros, entrega e participação diferenciados conforme a evidência, sem transformar ausência de informação em irregularidade.
- Leitura e ação possíveis no celular, por teclado e sem depender apenas de cor.

A validação de usabilidade deve incluir pessoas de diferentes escolaridades e familiaridade com política, com tarefas concretas: explicar o que aconteceu, identificar o que ainda não se sabe e encontrar o próximo passo sem ajuda. Registrar dificuldades, correções e limitações observadas. Testes automatizados e revisão interna não substituem essa validação; enquanto ela não ocorrer, registrar a pendência, sem alegar compreensão comprovada.

## 19. Decisões em aberto

Nome/domínio e identidade visual; método inicial de login; provedor de IA; política de revisão dos resumos; frequência e limites de alertas; provedor/hospedagem do worker; orçamento de infraestrutura; eventual abertura pública da API; cobertura histórica e expansão territorial.

Essas decisões não impedem a inicialização técnica. Use configuração e limites claros, registre escolhas e não complete lacunas com fatos inventados.

## 20. Executivo — expansão de cobertura planejada

**F-35 — Acompanhar o Executivo: presidente, governadores e prefeitos**

Ampliação de escopo confirmada em 21/10/2026. Acompanhar governos, seus órgãos e períodos de exercício com o mesmo núcleo de compreensão, ação cidadã e acompanhamento. A cobertura operacional atual continua federal/legislativa; o recorte executivo depende de validação de fontes por localidade, recurso e período. Priorização e tarefas pertencem ao Linear.

- Perfis e períodos de exercício do chefe do Executivo, com órgãos, papéis e substituições comprovados. Candidatura ou resultado eleitoral não comprova posse nem exercício atual.
- Planos de governo, compromissos e atos oficiais com fonte, versão, prazo quando explícito e evidências de andamento; não inferir cumprimento apenas pela publicação de um ato.
- Orçamento, receitas, despesas e contratos contextualizados por órgão, esfera, período e regime. Contas fiscais agregadas não equivalem a todos os pagamentos ou contratos.
- Transferências e obras: relacionar origem do recurso, beneficiário, executor, contratação e entrega somente com vínculo verificado. Movimentação do dinheiro e andamento da entrega mantêm evidências próprias.
- Recursos de saúde e educação com indicadores, unidades, metodologia, datas e limites. Gasto não equivale a qualidade do serviço nem comprova causalidade atribuível ao governante.
- Canais de participação, informação e ouvidoria competentes, com próximo passo e acompanhamento por capacidades compartilhadas de conta, follows, feed e alertas. Qualquer registro pessoal de protocolo/resposta exige privacidade e distinção entre relato do usuário e confirmação oficial.

**Aceitação:** explicar uma situação, os papéis responsáveis, o que se sabe, o que falta verificar e uma ação disponível sem exigir conhecimento prévio. Validar compreensão conforme os requisitos transversais. Ausência de dados, atraso ou valor alto não são prova de corrupção. Fontes nacionais ajudam a compor recortes; não se promete cobertura completa de estados e municípios. O Portal da Transparência federal não representa toda a execução local; PNCP e dados fiscais têm cobertura própria.

Fontes candidatas e limites em [RECURSOS.md](RECURSOS.md#11-fontes-candidatas-para-o-executivo). Decisão em [ADR 008](decisions/008-expansao-executivo.md). Backlog em [F-35 no Linear](https://linear.app/modo-cidadao/issue/MOD-178).
