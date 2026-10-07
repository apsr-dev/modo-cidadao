# Fonte implementada — Câmara / deputados

Verificação HTTP: 07/10/2026. Adapter: `packages/source-camara`. Normalizador: `camara-deputados-1`.

- Fonte: Dados Abertos da Câmara dos Deputados; [documentação oficial](https://dadosabertos.camara.leg.br/swagger/api.html).
- Base: `https://dadosabertos.camara.leg.br/api/v2`.
- Recursos usados: `GET /deputados?ordem=ASC&ordenarPor=nome&pagina=N&itens=M` e `GET /deputados/{id}`.
- Sem credencial. Accept JSON, UTF-8. IDs numéricos externos são preservados como strings em namespace Câmara/deputados; pessoa recebe UUID determinístico desse namespace, sem associação por nome.
- Paginação lista: `dados` e `links`, encerramento quando não há `rel=next`. Não seguimos URLs arbitrárias da resposta: a próxima página usa a base fixa oficial. Ordem da lista e detalhe foram consultados de fato.
- Cobertura implementada: catálogo ampliado em seis lotes manuais, páginas iniciais 1/6/11/16/21/26, de até 100 pessoas cada. Em 07/10/2026, foram persistidos 513 deputados; a documentação da Câmara informa que a consulta sem período retorna deputados em exercício no momento da requisição. Isso não é histórico completo nem garantia de atualização contínua. Ausências futuras não removem registros automaticamente.
- Validação: schema externo Zod requer identidade, nome, UF e legislatura. Campos desconhecidos são preservados no RAW minimizado; campos opcionais não são inventados.
- Mapeamento: `ultimoStatus.nome`, `siglaUf`, `idLegislatura`, `siglaPartido`, `situacao`, e-mail e telefone de gabinete. `nomeCivil` quando informado. O perfil usa a situação da fonte; não infere exercício pela candidatura.
- E-mail ausente/inválido fica não informado; telefone mantém valor original da fonte. História de mandatos/exercício e filiação legal não foi importada. Mudanças de partido conservam observações anteriores.
- RAW: remoção de `dados.cpf` por minimização; hash da origem e hash do corpo armazenado, campos removidos, URL e coleta. Snapshot deduplicado; observação criada a cada coleta. JSON inválido no detalhe impede persistência do corpo não minimizável.
- Operação: sequencial (concurrency 1), timeout de 15 s por request, até três tentativas para HTTP 429/5xx, Retry-After numérico/data limitado a 10 s. Falhas de transporte falham a execução para reexecução manual; não há SLA ou limite oficial presumido. SIGINT/SIGTERM cancela.
- Persistência: transação para cada RAW/observação e para cada atualização normalizada; lock por pessoa e constraints. Checkpoint só avança após página inteira persistida. Ausência em amostra parcial não remove dados anteriores.
- Termos/atribuição: fonte identificada e links oficiais preservados. Não foi estabelecida uma política completa de redistribuição ou retenção para operação pública; revisão continua pendente. Os dados são usados localmente na fundação.
- Fixtures: `tests/fixtures/camara-list.json`, `camara-204379.json`, `camara-220714.json`; reduzidas dos endpoints reais em 07/10/2026, somente campos necessários, sem CPF. Não alimentam a demo fictícia.
- Teste online opt-in: `bun run test:source`; ingestão: `bun run worker -- --source=camara --max-pages=1 --page-size=3 --limit=3`.
- Resultado real: payload de lista/detalhe validado; 513 registros persistidos após ampliação do catálogo. O fluxo adapter → RAW → normalização → PostgreSQL → SSR/REST → navegador passou em desktop/mobile. Normalização e deduplicação também são verificadas sem rede oficial usando fixtures.
- Mudanças da fonte: [notícias da API](https://dadosabertos.camara.leg.br/news/noticias.html) e [tutoriais](https://dadosabertos.camara.leg.br/howtouse/central-tutoriais.html).

Os dados do Senado e do TSE ainda não têm adapter. Os recursos e seus limites institucionais permanecem descritos integralmente em `RECURSOS.md`.

## Propostas, autores e tramitações

Verificação HTTP: 07/10/2026. Normalizador: `camara-proposicoes-1`. Recursos efetivamente usados: `/proposicoes`, `/proposicoes/{id}`, `/proposicoes/{id}/autores`, `/proposicoes/{id}/tramitacoes`, conforme o [OpenAPI oficial](https://dadosabertos.camara.leg.br/api/v2/api-docs).

Lista paginada por ID decrescente, com `ano`, `siglaTipo`, `numero` e `idDeputadoAutor` opcionais conforme a CLI. A coleta exige ano, limita cada chamada a 100 propostas e cinco páginas; padrão de três. Não se presume que o ano sozinho represente cobertura anual completa: a API também tem regras e janelas próprias de consulta. Filtros de datas com intervalo anual foram rejeitados por HTTP 400 (“diferença entre as datas … maior que 3 meses”); nenhum intervalo anual é enviado pelo adapter.

Cada proposta só substitui a versão normalizada depois que detalhe, autores e tramitações tiverem sido persistidos como RAW e validados. Recursos de autores/tramitações com `rel=next` são rejeitados como incompletos; mais de 1.000 eventos ou sequências duplicadas falham a validação, preservando a versão anterior. Coleta manual pode ser repetida com `--start-page`.

Identidade: UUID determinístico no namespace Câmara/proposições, separado de pessoas. Vínculo com deputado usa exclusivamente URI oficial `/deputados/{id}`, nunca o nome. Autores sem pessoa local continuam visíveis com tipo e link oficial. `proponente=1` corresponde a autor proponente; `0`, a coautor/signatário de apoio; ausente, papel não informado. A fonte considera todos os signatários autores; ordem de assinatura não é usada para inventar autoria principal.

Datas de apresentação/ocorrência conservam a precisão e o fuso recebidos. Os timestamps sem offset não são convertidos para UTC nem rotulados como horário de Brasília. Coletas têm timestamp UTC próprio. Situação, órgão, descrição e despacho permanecem oficiais; não há tradução automática para “virou lei”. Inteiro teor e documentos de eventos mantêm suas URLs específicas; o PDF não é baixado nem resumido. Links renderizados aceitam somente HTTP(S) em hosts oficiais da Câmara.

Persistência: catálogo e relação de autores em `civic`; versões anteriores em `internal.proposal_revisions`, com referências aos três snapshots. Transação e lock por proposta tornam atualização/replay consistentes. Hash da revisão usa a versão do normalizador e os corpos dos três recursos, sem depender do instante da recoleta. Mesmo conteúdo/normalizador não cria outra revisão; novas observações RAW continuam preservadas. Uma observação antiga não reverte a versão atual.

A execução real importou três PLs de 2026 filtrados por `idDeputadoAutor=204379`; detalhes/autores/tramitações de `2642134` foram usados como fixture oficial, separados da demo. O catálogo da web é parcial. A demo usa oito propostas explicitamente fictícias, sem documentos oficiais simulados.

Comando opt-in: `bun run worker -- --source=camara --resource=proposals --year=2026 --type=PL --deputy=204379 --page-size=3 --limit=3`. Para filtrar identificador, acrescente `--number=4916`. Mesmas regras de timeout/retry/cancelamento da coleta de deputados; sem scheduler, notificações ou chamadas legislativas pelo navegador.
