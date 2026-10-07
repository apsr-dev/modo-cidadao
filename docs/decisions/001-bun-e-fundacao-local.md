# ADR 001 — Bun e fundação local

Data: 07/10/2026. Decisão do responsável: Bun **1.4.2**, substituindo Node.js/pnpm como padrão. O nome técnico é `plataforma-civica`; o diretório existente `modo-cidadao` é preservado. A marca fica em `VITE_APP_NAME`.

Web/worker executam com Bun; instalação exclusivamente Bun workspaces e `bun.lock`. Vite mantém o pipeline Start, TypeScript estrito verifica tipos separadamente. Vitest e Playwright são mantidos e foram executados com Bun. Turborepo 2.11.7 declara suporte estável a Bun 1.2+ e foi validado localmente. O Node instalado na máquina não é runtime da aplicação. Binários nativos de ferramentas e serviços Docker permanecem dependências próprias.

Produção configurada: processo Bun executando um servidor fetch baseado no guia oficial do Start e servindo `dist/client`/`dist/server/server.js`. Não foi escolhido provedor nem efetuado deploy. `Dockerfile` fixa Bun 1.4.2. Nitro não foi incluído porque o servidor Bun documentado atende este alvo local. Não há garantia de compatibilidade automática com outro provedor.

Banco: PostgreSQL padrão 17 local via Supabase CLI 2.120.0, Drizzle 0.45.3 com postgres.js 3.4.9, `prepare:false`, máximo 3 conexões/processo. Conexão local direta verificada. Nenhum pooler remoto foi validado. Web usa papel de leitura de `civic`; worker usa escrita em `civic/internal`. Credenciais são locais e geradas por `db:env`; configuração real de produção fica pendente.

Auth local escolhido para a fundação: e-mail/senha, mínimo 10 caracteres, sem confirmação de e-mail apenas no Supabase local. Cookies SSR HttpOnly/SameSite Lax, JWT bearer para REST; `getUser` em cada operação privada. Recuperação, exportação, exclusão de conta e operação pública continuam pendentes. Nenhum provedor social, serviço de e-mail ou conta remota foi provisionado.

RAW: a resposta oficial de detalhe da Câmara contém CPF. Por minimização, `dados.cpf` é removido antes de persistir. Guardamos hash da resposta de origem, hash do conteúdo armazenado e lista dos campos removidos. Os demais campos são preservados; quando há remoção, o corpo é uma serialização JSON do objeto recebido, sem prometer bytes idênticos ao transporte. Resposta de detalhe com JSON inválido falha antes de persistir corpo não minimizável. Fixtures são reduzidas e não contêm CPF. Históricos de filiação registram observação, sem inventar datas legais de início/fim.

O catálogo oficial exclui seed fictício. `DEMO_MODE=true` serve a mesma coleção determinística do seed em memória e desativa Auth/follows. `DEMO_MODE=false` exige configuração completa; falhas de banco não provocam fallback silencioso para demo. A ingestão é CLI manual, local, limitada e idempotente, sem scheduler, outbox ou notificações ainda. Checkpoint documenta páginas completas; esta fundação não retoma automaticamente uma execução anterior.

A configuração privada raiz é carregada explicitamente pelo Vite/servidor Bun, porque iniciar dentro de `apps/web` não implica carregar o `.env` da raiz. Somente nomes `VITE_APP_*` entram no bundle. Guardas de import foram ampliadas ao workspace e testadas com import proibido real através de `packages/ui`.

Fontes consultadas:
- [Bun + Start](https://bun.com/guides/ecosystem/tanstack-start)
- [Bun workspaces](https://bun.com/docs/pm/workspaces)
- [Start — criação manual](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)
- [Start — hosting Bun](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#bun)
- [Proteção de imports](https://tanstack.com/start/latest/docs/framework/react/guide/import-protection)
- [Query por requisição](https://tanstack.com/start/latest/docs/framework/react/guide/tanstack-query)
- [Turborepo — suporte](https://turborepo.dev/docs/support-policy)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [PostgreSQL e pooler](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Supabase changelog](https://supabase.com/changelog) — revisado, incluindo mudanças PostgreSQL 17.11; esta base não usa índices ltree/btree_gist nem criptografia legada.
