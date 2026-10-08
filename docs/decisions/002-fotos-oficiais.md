# Fotos oficiais de representantes

Data: 08/10/2026. Entrega: MOD-49.

O catálogo armazena a URL oficial `ultimoStatus.urlFoto` como `DataValue` na pessoa, com a mesma origem, coleta e observação do detalhe. Não armazena os bytes da imagem. A migration aditiva deixa registros anteriores como `not_collected`; nova coleta com o normalizador `camara-deputados-2` preenche o campo.

O adapter aceita apenas o retrato HTTPS da Câmara cujo caminho contém o mesmo ID externo. Ausência ou formato inesperado não impede normalizar a pessoa. A UI usa Avatar do padrão shadcn/Radix com iniciais acessíveis durante carregamento ou falha. Personagens demo nunca recebem retratos reais ou inventados. O layout existente é preservado.

A imagem é carregada diretamente do host oficial, sem envio de Referer. Isso depende da disponibilidade do servidor da Câmara; falha não bloqueia navegar ao perfil. O perfil informa a origem institucional e permite consultar a imagem original. A fonte não fornece autoria/licença por arquivo; não se inventa fotógrafo nem se estendem automaticamente os termos do Banco de Imagens aos retratos BANDEP. Consulte [FONTE-CAMARA.md](../FONTE-CAMARA.md) para referências e limites.
