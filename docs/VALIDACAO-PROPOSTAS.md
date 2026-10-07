# Validação — propostas da Câmara

Data: 07/10/2026. Branch: `feat/camara-proposals`. Bun 1.4.2 e stack instalada da fundação foram mantidos; não houve instalação de novas dependências.

História verificada: cidadão abre um representante → consulta propostas de autoria/coautoria → abre o detalhe → lê a tramitação → encontra o documento oficial. O navegador usa server functions/REST da aplicação; os dados vêm do PostgreSQL, após coleta manual da Câmara.

| Fronteira/check | Evidência executada |
| --- | --- |
| Fonte → RAW → domínio | Três propostas oficiais importadas com detalhe, autores e tramitações. Replay real concluído; snapshots/observações e versões persistidos. |
| Catálogo de deputados | Seis lotes manuais de até 100 registros, páginas iniciais 1/6/11/16/21/26: 100 + 100 + 100 + 100 + 100 + 13 = **513** deputados persistidos. Sem scheduler. |
| Migration | `20261007151217_camara_proposals.sql` aplicada sobre o banco existente; tabelas novas, grants limitados e recurso da sincronização. Catálogo, contas e follows anteriores preservados. |
| Tipo/lógica | TypeScript estrito passou; Vitest completo: **19 testes de lógica passaram**, integração opt-in separada. |
| PostgreSQL/Auth/RLS | **5 testes passaram**. Consultas/filtros, vínculo de autoria por ID, revisão anterior, idempotência, observação antiga, rollback e isolamento de usuários. |
| UI/REST em desenvolvimento | **8 E2E passaram**, desktop/mobile. SSR/metadados, filtros, paginação, perfil→proposta→tramitação, documentos, 400/404, login/follow/logout. |
| Produção Bun integrada | **8 E2E passaram** no build Start servido por Bun, incluindo Auth local e a nova história. |
| Produção demo | **6 E2E passaram**; **2 testes de Auth ignorados intencionalmente**. Demo contém 12 personagens e oito propostas/tramitações fictícias. |
| Segurança de bundle | Teste negativo bloqueou banco importado por pacote do workspace. Build recomposto; **21 arquivos públicos** inspecionados sem marcadores proibidos nem valores de segredos configurados. |
| Lint | Biome sem erros. Permanecem sete avisos CSS de especificidade e uma sugestão de template string anteriores à feature. |
| Advisor | Advisor de segurança do banco local sem ocorrências. Não é auditoria completa de segurança. |
| Worker | SIGTERM novamente verificado: cancelamento registrado no banco, fechamento do pool e saída 130. |
| Visual | Catálogo/detalhe inspecionados em desktop/mobile; navegação e ausência de overflow/hidratação também verificadas pelos E2E. |

Os testes de proposta verificam a ementa da fixture oficial, papéis de autoria, identidade separada de pessoas, ausência de vínculo por nome, horário sem fuso, offsets explícitos, rejeição de data inexistente e links não oficiais. Recurso de autores/tramitações incompleto ou inválido não substitui o catálogo. Mudança de conteúdo altera a revisão; só o instante de recoleta não a altera. A versão do normalizador participa da identidade da revisão.

CI não consulta APIs legislativas: integração usa fixtures reais pequenas. O teste de rollback/retificação usa registro fictício temporário identificado como demo, removido após a suíte; fatos inventados não são atribuídos ao catálogo real. Contas Auth de teste são removidas e traces autenticados ficam desativados.

## Cobertura e limites

- Os 513 registros correspondem à listagem corrente consultada da Câmara naquele dia. O adapter não elimina ausentes nem garante atualização contínua; o status e a coleta indicam a observação local. Senado permanece sem adapter.
- O catálogo inicial de propostas é uma amostra de três PLs de 2026 filtrados por um deputado. Busca vazia não comprova ausência na fonte. Autoria de todos os 513 deputados não foi importada.
- As datas originais não recebem fuso inventado. Com offsets em todos os eventos, a ordenação compara instantes; sem isso, usa os horários representados pela fonte e a sequência para desempate.
- Recursos com paginação pendente ou mais de 1.000 tramitações são rejeitados como incompletos/fora do limite, mantendo a versão anterior. A limitação é explícita, sem promessa de importação histórica completa.
- Documentos ficam como links oficiais específicos; PDFs não são baixados. Versões anteriores ficam na persistência interna, sem tela pública de comparação.
- Follows de propostas, relatorias, votos, resumos, notificações, scheduler, Senado e TSE continuam planejados. Auth/follows de pessoas existentes continuam funcionando.
- Servidor de produção Bun local validado. Imagem Docker e provedor remoto continuam sem execução nesta entrega; nenhuma infraestrutura externa foi provisionada.

O workflow de CI acompanha o PR e seu resultado é consultado no GitHub. Os números acima são resultados locais efetivamente executados. Consulte [README](../README.md), [ADR 002](decisions/002-propostas-camara.md) e [ficha da fonte](FONTE-CAMARA.md) para reprodução.
