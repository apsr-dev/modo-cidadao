# ADR 007 — Senadores em exercício e identidade por fonte

Data: 21/10/2026. Estado: proposta implementada na branch do MOD-47, sujeita à revisão do PR.

## Decisão

Integrar o serviço legislativo v4 `/senador/lista/atual` em `packages/source-senado`, por JSON solicitado explicitamente. O OpenAPI não define paginação. O worker local consulta a lista uma vez, valida toda a coleção antes de publicar e respeita o limite de registros solicitado. Não replica o fluxo lista/detalhe paginado da Câmara.

Pessoa usa UUID determinístico de `senado:senadores:<CodigoParlamentar>`; mandato usa `CodigoMandato`. Não há merge automático entre fontes por nome/número. O repositório usa a instituição persistida e mantém os IDs existentes da Câmara. RAW e execuções recebem fonte explícita; os fluxos atuais da Câmara conservam seu comportamento.

Preservar participação original, legislaturas e períodos de exercício em `senate_details` no mandato, expostos como `senateMandate`. Essa extensão concreta mantém dados próprios da fonte sem implementar o histórico completo da MOD-50. Coleta, datas dos períodos e versão do serviço têm significados distintos. Presença no recurso atual significa exercício observado na coleta; ausência posterior não autoriza remoção ou afastamento.

## Consequências

Migration aditiva amplia o domínio de fontes de pessoas e adiciona JSONB opcional ao mandato. Grants, schemas privados e follows por RLS permanecem os mesmos. SSR, server functions e REST usam o catálogo existente. Créditos, cargo e limites passam a distinguir Câmara e Senado.

A migração deve preceder a nova web/worker. URLs oficiais e dados RAW são preservados; opcional malformado não inventa contato/foto. Não há sincronização automática, abrangência histórica, novos filtros da MOD-48 ou importação de outras entidades do Senado. Cada perfil informa coleta e limites; falha de fonte preserva a última observação válida.

Fonte e contrato verificados estão em [FONTE-SENADO.md](../FONTE-SENADO.md).
