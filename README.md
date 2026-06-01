# Painel de Campanhas da ABNA

Relatório Nacional de RP/IP da ABNA - Associação Brasileira de Narcóticos Anônimos.

Um painel em React para visualizar os dados das campanhas de Narcóticos Anônimos a partir do Google Sheets.

## Tecnologias

- **Framework**: React 18+ com TypeScript
- **Ferramenta de build**: Vite 7+
- **Gerenciador de pacotes**: Bun
- **Estilização**: Tailwind CSS 4+
- **Gráficos**: Recharts
- **Testes**: Vitest + @testing-library/react + fast-check (PBT)
- **Implantação**: GitHub Pages

## Primeiros Passos

### Pré-requisitos

- [Bun](https://bun.sh/) instalado no seu sistema

### Instalação

```bash
# Instalar dependências
bun install

# Copiar variáveis de ambiente
cp .env.example .env

# Adicione sua chave da API do Google Sheets ao .env
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
bun run dev

# Executar testes
bun run test

# Executar testes uma vez (modo CI)
bun run test:run

# Gerar build de produção
bun run build

# Pré-visualizar o build de produção
bun run preview
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── contexts/       # Contextos React para gerenciamento de estado
├── services/       # Serviços de busca de dados
├── types/          # Definições de tipos TypeScript
├── utils/          # Funções utilitárias
└── test/           # Configuração e utilitários de teste
```

## Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

- `VITE_GOOGLE_SHEETS_API_KEY`: Sua chave da API do Google Sheets
- `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`: O ID da planilha (valor padrão já fornecido)
- `VITE_GOOGLE_SHEETS_RANGE`: O intervalo a ser buscado (ex.: "Sheet1!A:Z")

## Implantação

O projeto está configurado para implantação automática no GitHub Pages via GitHub Actions.

Para instruções detalhadas de implantação, consulte [DEPLOYMENT.md](./DEPLOYMENT.md).

### Início Rápido

1. **Ative o GitHub Pages**: Nas configurações do repositório, vá em Pages e defina a origem como "GitHub Actions"

2. **Configure a chave da API**: A chave da API do Google Sheets precisa ser configurada como um segredo do repositório:
   - Acesse Settings → Secrets and variables → Actions
   - Adicione um novo segredo de repositório chamado `VITE_GOOGLE_SHEETS_API_KEY`
   - Defina o valor como sua chave da API do Google Sheets

3. **Implante**: Faça push para a branch `main` para acionar a implantação automática

O workflow irá:
- Instalar as dependências usando Bun
- Executar o build de produção
- Implantar no GitHub Pages

### Implantação Manual

Para testar o build de produção localmente:

```bash
# Gerar build de produção
bun run build

# Pré-visualizar o build de produção
bun run preview
```

O build de produção será gerado no diretório `dist/`.

## Testes

O projeto usa uma abordagem dupla de testes:

- **Testes unitários**: Exemplos específicos e casos extremos usando Vitest
- **Testes baseados em propriedades**: Propriedades universais de correção usando fast-check

Execute todos os testes com:

```bash
bun run test:run
```

## Licença

Este projeto é de uso interno da ABNA (Associação Brasileira de Narcóticos Anônimos).
