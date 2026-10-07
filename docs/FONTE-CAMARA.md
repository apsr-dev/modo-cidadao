# Fonte implementada — Câmara / deputados

Verificação HTTP: 07/10/2026. Adapter: `packages/source-camara`. Normalizador: `camara-deputados-1`.

- Fonte: Dados Abertos da Câmara dos Deputados; [documentação oficial](https://dadosabertos.camara.leg.br/swagger/api.html).
- Base: `https://dadosabertos.camara.leg.br/api/v2`.
- Recursos usados: `GET /deputados?ordem=ASC&ordenarPor=nome&pagina=N&itens=M` e `GET /deputados/{id}`.
- Sem credencial. Accept JSON, UTF-8. IDs numéricos externos são preservados como strings em namespace Câmara/deputados; pessoa recebe UUID determinístico desse namespace, sem associação por nome.
- Paginação lista: `dados` e `links`, encerramento quando não há `rel=next`. Não seguimos URLs arbitrárias da resposta: a próxima página usa a base fixa oficial. Ordem da lista e detalhe foram consultados de fato.
- Cobertura implementada: amostra limitada de registros retornados pela listagem atual; sem backfill e sem afirmação de cobertura completa. Foram importados três representantes em execução manual.
- Validação: schema externo Zod requer identidade, nome, UF e legislatura. Campos desconhecidos são preservados no RAW minimizado; campos opcionais não são inventados.
- Mapeamento: `ultimoStatus.nome`, `siglaUf`, `idLegislatura`, `siglaPartido`, `situacao`, e-mail e telefone de gabinete. `nomeCivil` quando informado. O perfil usa a situação da fonte; não infere exercício pela candidatura.
- E-mail ausente/inválido fica não informado; telefone mantém valor original da fonte. História de mandatos/exercício e filiação legal não foi importada. Mudanças de partido conservam observações anteriores.
- RAW: remoção de `dados.cpf` por minimização; hash da origem e hash do corpo armazenado, campos removidos, URL e coleta. Snapshot deduplicado; observação criada a cada coleta. JSON inválido no detalhe impede persistência do corpo não minimizável.
- Operação: sequencial (concurrency 1), timeout de 15 s por request, até três tentativas para HTTP 429/5xx, Retry-After numérico/data limitado a 10 s. Falhas de transporte falham a execução para reexecução manual; não há SLA ou limite oficial presumido. SIGINT/SIGTERM cancela.
- Persistência: transação para cada RAW/observação e para cada atualização normalizada; lock por pessoa e constraints. Checkpoint só avança após página inteira persistida. Ausência em amostra parcial não remove dados anteriores.
- Termos/atribuição: fonte identificada e links oficiais preservados. Não foi estabelecida uma política completa de redistribuição ou retenção para operação pública; revisão continua pendente. Os dados são usados localmente na fundação.
- Fixtures: `tests/fixtures/camara-list.json`, `camara-204379.json`, `camara-220714.json`; reduzidas dos endpoints reais em 07/10/2026, somente campos necessários, sem CPF. Não alimentam a demo fictícia.
- Teste online opt-in: `bun run test:source`; ingestão: `bun run worker -- --source=camara --max-pages=1 --page-size=3 --limit=3`.
- Resultado real: payload de lista/detalhe validado; três registros percorreram adapter → RAW → normalização → PostgreSQL → SSR/REST → navegador. Normalização e deduplicação também são verificadas sem rede oficial usando fixtures.
- Mudanças da fonte: [notícias da API](https://dadosabertos.camara.leg.br/news/noticias.html) e [tutoriais](https://dadosabertos.camara.leg.br/howtouse/central-tutoriais.html).

Os dados do Senado e do TSE ainda não têm adapter. Os recursos e seus limites institucionais permanecem descritos integralmente em `RECURSOS.md`.
