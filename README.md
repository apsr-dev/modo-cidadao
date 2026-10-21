# Plataforma cívica

Projeto para conhecer representantes, acompanhar a atuação parlamentar e acessar canais oficiais de participação.

Implementado: diretório e perfis da Câmara com fotos oficiais, propostas e tramitações parciais, importação manual, autenticação e acompanhamento privado de pessoas. Nome provisório; outras integrações permanecem planejadas.

## Rodar localmente

Requisitos: Git e Bun **1.4.3**.

```sh
git clone git@github.com:apsr-dev/modo-cidadao.git
cd modo-cidadao
bun install --frozen-lockfile
bun run dev
```

Abra [localhost:3000](http://localhost:3000). Sem `.env`, o app usa dados fictícios de demonstração.

Para usar dados oficiais, é necessário Docker Desktop. Veja [configuração do banco e importação](docs/DESENVOLVIMENTO.md#banco-local-e-dados-oficiais). `db:reset` apaga os dados locais.

## Verificar

```sh
bun run build
bun run typecheck
bun run lint
bun run test
bun --bun playwright install chromium
bun run test:e2e
```

## Documentação

- [Desenvolvimento e troca de máquina](docs/DESENVOLVIMENTO.md)
- [Validação](docs/VALIDACAO.md)
- [Funcionalidades](docs/PLANEJAMENTO-FEATURES.md), [arquitetura](docs/PLANEJAMENTO-TECNICO.md) e [fontes](docs/RECURSOS.md)
- [Regras de contribuição](AGENTS.md)
