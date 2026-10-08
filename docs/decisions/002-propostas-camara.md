# ADR 002 — propostas e tramitações da Câmara

Data: 07/10/2026. Status: implementado localmente; revisão por PR.

Objetivo: representante → proposta → tramitação → documento oficial. Implementa catálogo com filtros por tipo/número/ano/autor, detalhe público, histórico de eventos e autoria/coautoria no perfil. O catálogo de deputados foi ampliado em lotes manuais. O planejamento completo permanece preservado.

Reutilizamos o adapter da Câmara e os dois processos existentes. A nova coleta usa recursos oficiais fixos, RAW/proveniência e Zod. Server functions e REST compartilham os casos de uso; os filtros públicos operam sobre registros persistidos. Nenhuma requisição do visitante importa dados ou chama a Câmara.

`civic.proposals` mantém colunas de busca/ordenação e o documento normalizado tipado, incluindo os eventos. `civic.proposal_authors` permite consulta por identidade externa do deputado, sem unir nomes. `internal.proposal_revisions` preserva a versão anterior e os snapshots de detalhe/autores/tramitações. As tabelas cívicas são acessadas apenas pelo papel de leitura do servidor; o schema interno não recebe grants para o leitor nem para a Data API. Não acrescentamos tabelas pessoais ou privilégios Auth.

Versões com o mesmo hash não são duplicadas; observações RAW registram recoleta. Correções substituem a projeção atual atomicamente e preservam as versões anteriores. Observações antigas não revertem o catálogo. Falhas e recursos incompletos não substituem a última versão válida. Checkpoint avança apenas depois de uma página inteira persistida.

`proponente` define o papel exibido; posição na lista não define autoria principal. A identificação de uma pessoa depende da URI oficial e do registro local; entidades e autores ainda não importados permanecem com nome/tipo/link oficial. Datas sem fuso são mantidas sem conversão. Situação oficial não implica transformação em lei.

Cada execução continua manual/local, com até 100 registros e cinco páginas. `--start-page` permite lotes adicionais. O ano é filtro de apresentação, não promessa de importação anual completa. A API rejeitou intervalos anuais de datas; esses parâmetros não são enviados. Senado, votações, relatorias, follows de propostas, resumos e alertas continuam planejados.

Documentos oficiais permanecem como links específicos, incluindo `codteor`; PDFs não são baixados. Versões arquivadas ficam disponíveis na persistência interna para futura inspeção, sem uma tela pública de comparação nesta entrega. Fixtures oficiais e seed fictício são separados.

Fontes consultadas: [OpenAPI da Câmara](https://dadosabertos.camara.leg.br/api/v2/api-docs), [documentação da Câmara](https://dadosabertos.camara.leg.br/swagger/api.html), [segurança da Data API](https://supabase.com/docs/guides/api/securing-your-api), [changelog Supabase](https://supabase.com/changelog).

O usuário definiu que cada feature é entregue em branch própria e PR para `main`; a regra está registrada em `AGENTS.md`. Versões da stack e Bun 1.4.2 foram mantidos. Resultados da feature são registrados em `docs/VALIDACAO-PROPOSTAS.md`.
