/**
 * Gera public/og-image.png (1200x630) a partir da arte do masthead.
 *
 * Renderiza um template HTML num navegador headless (Chrome/Brave/Chromium) para
 * usar as fontes da marca (Sora/Inter) e o mesmo #373374 do masthead.
 *
 * Uso: node scripts/generate-og.mjs
 * Ao trocar a arte (src/assets/header-image.jpeg), rode de novo.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const ART = join(ROOT, 'src/assets/header-image.jpeg');
const OUT = join(ROOT, 'public/og-image.png');

// Mesma cor de fundo da arte — a imagem se funde com a faixa (ver Header.tsx)
const BANNER_BG = '#373374';

const CANDIDATES = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].filter(Boolean);

const browser = CANDIDATES.find((p) => existsSync(p));
if (!browser) {
    console.error('Nenhum navegador Chrome/Brave/Chromium encontrado. Defina CHROME_PATH.');
    process.exit(1);
}

const artDataUri = `data:image/jpeg;base64,${readFileSync(ART).toString('base64')}`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@700;800&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: ${BANNER_BG};
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: Inter, system-ui, sans-serif;
    position: relative;
  }
  /* Brilho sutil para dar profundidade ao campo chapado */
  body::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(900px 460px at 50% -12%, rgba(255,255,255,0.12), transparent 62%);
  }
  .art { width: 760px; overflow: hidden; position: relative; }
  /* scale recorta a franja clara de ~1px nas bordas do JPEG (mesmo truque do Header) */
  .art img { display: block; width: 100%; height: auto; transform: scale(1.03); }
  h1 {
    position: relative; margin-top: 52px;
    font-family: Sora, Inter, sans-serif; font-weight: 800; font-size: 58px;
    color: #fff; letter-spacing: -0.02em; line-height: 1.05; text-align: center;
  }
  p {
    position: relative; margin-top: 18px;
    font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.72);
    letter-spacing: 0.01em; text-align: center;
  }
  .accent {
    position: absolute; left: 0; right: 0; bottom: 0; height: 10px;
    background: linear-gradient(90deg, #1D4ED8 0%, #1789C7 55%, #0E9F6E 100%);
  }
</style>
</head>
<body>
  <div class="art"><img src="${artDataUri}" alt="" /></div>
  <h1>Painel de Dados Nacionais</h1>
  <p>Atividades, participantes e alcance de RP/IP em todo o Brasil</p>
  <div class="accent"></div>
</body>
</html>`;

const tmpHtml = join(tmpdir(), `abna-og-${process.pid}.html`);
writeFileSync(tmpHtml, html);

try {
    execFileSync(
        browser,
        [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            '--force-device-scale-factor=1',
            '--window-size=1200,630',
            '--virtual-time-budget=8000', // espera as fontes carregarem
            `--screenshot=${OUT}`,
            `file://${tmpHtml}`,
        ],
        { stdio: 'ignore' }
    );
    console.log(`OK: ${OUT}`);
} finally {
    unlinkSync(tmpHtml);
}
