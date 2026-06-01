# Guia de Implantação

Este guia descreve a implantação do Painel de Campanhas da ABNA no GitHub Pages.

## Pré-requisitos

- Repositório hospedado no GitHub
- GitHub Pages habilitado nas configurações do repositório
- Chave da API do Google Sheets com as restrições adequadas

## Configuração Inicial

### 1. Habilitar o GitHub Pages (configuração manual necessária)

Você precisa habilitar manualmente o GitHub Pages nas configurações do repositório:

1. Acesse seu repositório no GitHub
2. Clique em **Settings** (barra de navegação superior)
3. Role a barra lateral esquerda e clique em **Pages** (em "Code and automation")
4. Em "Build and deployment":
   - **Source**: Selecione **"GitHub Actions"** no menu suspenso
   - NÃO selecione "Deploy from a branch"
5. A página salvará automaticamente

**Importante:** Isso deve ser feito antes que a primeira implantação funcione.

### 2. Configurar os Segredos do Repositório

As variáveis de ambiente a seguir devem ser armazenadas como segredos do repositório:

1. Acesse **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret** para cada um dos itens abaixo:

#### Segredos obrigatórios:

**VITE_GOOGLE_SHEETS_API_KEY**
- Sua chave da API do Google Sheets
- Exemplo: `AIzaSyC...`

**VITE_GOOGLE_SHEETS_SPREADSHEET_ID**
- O ID da sua planilha do Google Sheets
- Padrão: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`
- Exemplo: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`

**VITE_GOOGLE_SHEETS_RANGE**
- O intervalo de células a ser buscado na planilha
- Padrão: `Sheet1!A:Z`
- Exemplo: `Sheet1!A:Z` ou use o formato GID da aba

3. Clique em **Add secret** para cada um

### 3. Configurar o Google Cloud Console

Garanta que sua chave da API tenha as seguintes restrições:

1. **Restrições de API**: Restrinja apenas à API do Google Sheets
2. **Restrições de aplicativo**: Adicione o referenciador HTTP:
   - `https://gusnips.github.io/abna-campaign-dashboard/*`
   - Substitua `gusnips` pelo seu nome de usuário ou organização no GitHub
3. Habilite o monitoramento de cota e os alertas

### 4. Verificar a Configuração da Planilha

Garanta que a planilha do Google Sheets esteja configurada corretamente:

- **Compartilhamento**: "Qualquer pessoa com o link pode visualizar"
- **ID da planilha**: Deve corresponder ao segredo `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`
- **Padrão**: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`
- **Intervalo da aba**: Deve corresponder ao segredo `VITE_GOOGLE_SHEETS_RANGE` (ex.: `Sheet1!A:Z`)

## Processo de Implantação

### Implantação Automática

A aplicação é implantada automaticamente quando você faz push para a branch `main`:

```bash
git add .
git commit -m "Sua mensagem de commit"
git push origin main
```

O workflow do GitHub Actions irá:
1. Fazer checkout do código
2. Configurar o Bun
3. Instalar as dependências
4. Gerar o build da aplicação
5. Implantar no GitHub Pages

### Implantação Manual

Você também pode acionar uma implantação manualmente:

1. Acesse a aba **Actions** no seu repositório
2. Selecione o workflow "Deploy to GitHub Pages"
3. Clique em **Run workflow**
4. Selecione a branch `main`
5. Clique em **Run workflow**

## Testes Locais

Antes de implantar, teste o build de produção localmente:

```bash
# Gerar build de produção
bun run build

# Pré-visualizar o build de produção
bun run preview
```

O servidor de pré-visualização iniciará em `http://localhost:4173` (ou em outra porta, caso a 4173 esteja em uso).

## Verificação

Após a conclusão da implantação:

1. Verifique o status do workflow na aba **Actions**
2. Acesse o site implantado: `https://gusnips.github.io/abna-campaign-dashboard/`
3. Confira:
   - Os dados carregam a partir do Google Sheets
   - Todos os filtros funcionam corretamente
   - Os gráficos são renderizados corretamente
   - O layout responsivo funciona em dispositivos móveis
   - Não há erros no console

## Solução de Problemas

### Erro "Get Pages site failed"

Se você vir este erro na primeira implantação:
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled...
```

**Solução:** O workflow agora habilita o GitHub Pages automaticamente. Esse erro só deve ocorrer uma vez, na primeira tentativa de implantação. Basta:

1. Reexecutar o workflow que falhou (clique em "Re-run all jobs" na aba Actions)
2. Ou fazer push de outro commit para acionar uma nova implantação

O workflow habilitará o GitHub Pages automaticamente na próxima execução.

### Falha no Build

- Verifique o log da aba Actions para mensagens de erro específicas
- Garanta que todas as dependências estejam listadas no `package.json`
- Verifique se a compilação TypeScript passa localmente: `bun run build`

### Problemas com a Chave da API

- Verifique se os três segredos estão configurados:
  - `VITE_GOOGLE_SHEETS_API_KEY`
  - `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`
  - `VITE_GOOGLE_SHEETS_RANGE`
- Verifique as restrições da chave da API no Google Cloud Console
- Garanta que a planilha esteja acessível publicamente

### Erros 404 no Site Implantado

- Verifique se o caminho `base` em `vite.config.ts` corresponde ao nome do seu repositório
- Confira se o GitHub Pages está habilitado e definido como "GitHub Actions"
- Garanta que o workflow tenha concluído com sucesso

### Dados Não Carregam

- Verifique o console do navegador em busca de erros da API
- Confira se as três variáveis de ambiente estão definidas corretamente:
  - A chave da API tem as permissões corretas
  - O ID da planilha corresponde à sua planilha do Google
  - O intervalo cobre todas as colunas necessárias (ex.: `Sheet1!A:Z`)
- Garanta que a planilha esteja acessível publicamente
- Verifique os limites de cota da API no Google Cloud Console

## Arquivos de Configuração

Arquivos importantes para a implantação:

- `.github/workflows/deploy.yml` - Workflow do GitHub Actions
- `vite.config.ts` - Configuração do Vite com o caminho base
- `.env.example` - Modelo de variáveis de ambiente
- `package.json` - Scripts de build e dependências

## Atualizando a Implantação

Para atualizar a aplicação implantada:

1. Faça suas alterações localmente
2. Teste com `bun run dev`
3. Execute os testes: `bun run test:run`
4. Gere o build localmente: `bun run build`
5. Faça commit e push para a branch `main`
6. O GitHub Actions implantará a atualização automaticamente

## Reversão (Rollback)

Para reverter para uma versão anterior:

1. Acesse a aba **Actions**
2. Encontre a implantação bem-sucedida para a qual deseja reverter
3. Clique em **Re-run all jobs**

Como alternativa, reverta o commit e faça push:

```bash
git revert <hash-do-commit>
git push origin main
```

## Monitoramento

Monitore sua implantação:

- **GitHub Actions**: Acompanhe as execuções do workflow na aba Actions
- **Google Cloud Console**: Monitore o uso e as cotas da API
- **Console do navegador**: Verifique erros de execução no site implantado

## Suporte

Para problemas com:
- **GitHub Pages**: Consulte a [documentação do GitHub Pages](https://docs.github.com/en/pages)
- **API do Google Sheets**: Consulte a [documentação da API do Google Sheets](https://developers.google.com/sheets/api)
- **Vite**: Consulte a [documentação do Vite](https://vitejs.dev/)
