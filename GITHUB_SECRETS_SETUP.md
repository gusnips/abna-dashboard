# Guia de Configuração dos Segredos do GitHub

Antes de implantar no GitHub Pages, você precisa configurar três segredos do repositório.

## Passos Rápidos de Configuração

1. Acesse seu repositório no GitHub
2. Navegue até **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret** para cada segredo abaixo

## Segredos Obrigatórios

### 1. VITE_GOOGLE_SHEETS_API_KEY
**Nome:** `VITE_GOOGLE_SHEETS_API_KEY`  
**Valor:** Sua chave da API do Google Sheets, obtida no Google Cloud Console  
**Exemplo:** `AIzaSyC...` (sua chave de API real)

**Como obter:**
- Acesse o [Google Cloud Console](https://console.cloud.google.com/)
- Habilite a API do Google Sheets
- Crie credenciais → Chave de API
- Restrinja a chave apenas à API do Google Sheets
- Adicione a restrição de referenciador HTTP: `https://gusnips.github.io/*`

---

### 2. VITE_GOOGLE_SHEETS_SPREADSHEET_ID
**Nome:** `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`  
**Valor:** `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`

**Como obter:**
- Abra sua planilha do Google
- Observe a URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Copie a parte `SPREADSHEET_ID`
- Para este projeto, use: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`

---

### 3. VITE_GOOGLE_SHEETS_RANGE
**Nome:** `VITE_GOOGLE_SHEETS_RANGE`  
**Valor:** `Sheet1!A:Z`

**O que isso significa:**
- `Sheet1` = o nome da aba da planilha
- `A:Z` = colunas de A até Z (todas as linhas)
- Ajuste se a sua planilha tiver um nome diferente ou se você precisar de outras colunas

---

## Lista de Verificação

Após adicionar os três segredos:

- [ ] `VITE_GOOGLE_SHEETS_API_KEY` está definido
- [ ] `VITE_GOOGLE_SHEETS_SPREADSHEET_ID` está definido
- [ ] `VITE_GOOGLE_SHEETS_RANGE` está definido
- [ ] A planilha do Google está configurada como "Qualquer pessoa com o link pode visualizar"
- [ ] A chave da API tem as restrições de referenciador HTTP configuradas
- [ ] **O GitHub Pages está habilitado** (Settings → Pages → Source: GitHub Actions)

**Importante:** Você precisa habilitar manualmente o GitHub Pages em Settings antes que o workflow funcione.

## Testando

Após configurar os segredos, faça push para a branch main:

```bash
git add .
git commit -m "Configurar implantação"
git push origin main
```

Em seguida, verifique:
1. Aba **Actions** - o workflow deve executar com sucesso
2. Acesse `https://gusnips.github.io/abna-campaign-dashboard/`
3. Os dados devem carregar a partir do Google Sheets

## Solução de Problemas

**O build falha com "API key not found"**
- Verifique se os nomes dos segredos estão exatamente como mostrado acima (diferencia maiúsculas de minúsculas)
- Confira se os segredos estão no repositório correto

**Os dados não carregam no site implantado**
- Verifique o console do navegador em busca de erros
- Confira se a planilha está acessível publicamente
- Verifique as restrições da chave da API no Google Cloud Console

**Erro 404 no site implantado**
- Confira se o GitHub Pages está habilitado
- Verifique se o `base` em `vite.config.ts` corresponde ao nome do seu repositório
- Aguarde alguns minutos para a propagação do DNS

## Precisa de Ajuda?

Consulte o guia completo [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas.
