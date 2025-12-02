const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando PWA...');

const distDir = path.join(__dirname, '..', 'dist');
const assetsDir = path.join(distDir, 'assets');

// Criar pasta assets se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Copiar icon.png
const iconSrc = path.join(__dirname, '..', 'assets', 'icon.png');
const iconDest = path.join(assetsDir, 'icon.png');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, iconDest);
  console.log('✅ icon.png copiado');
}

// Copiar manifest.json
const manifestSrc = path.join(__dirname, '..', 'public', 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('✅ manifest.json copiado');
}

// Encontrar o arquivo JS gerado pelo Expo
const jsDir = path.join(distDir, '_expo', 'static', 'js', 'web');
let jsFile = 'index.js';
if (fs.existsSync(jsDir)) {
  const files = fs.readdirSync(jsDir);
  const indexFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  if (indexFile) {
    jsFile = indexFile;
  }
}
console.log('📦 Arquivo JS:', jsFile);

// Criar index.html com meta tags PWA
const indexPath = path.join(distDir, 'index.html');
const indexContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
  <title>Dr Maycon</title>
  
  <!-- iOS PWA -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Dr Maycon" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="application-name" content="Dr Maycon" />
  <meta name="theme-color" content="#1A5F7A" />
  <meta name="description" content="Aplicativo médico do Dr. Maycon Fellipe" />
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Icons -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/assets/icon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icon.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="/assets/icon.png" />
  <link rel="apple-touch-icon-precomposed" href="/assets/icon.png" />
  
  <style>
    *{box-sizing:border-box}
    html,body{
      height:100%;
      width:100%;
      margin:0;
      padding:0;
      overflow:hidden;
      background:#1A5F7A;
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
    }
    #root{
      display:flex;
      flex:1;
      width:100%;
      height:100%;
      padding-top:env(safe-area-inset-top);
      padding-bottom:env(safe-area-inset-bottom);
      padding-left:env(safe-area-inset-left);
      padding-right:env(safe-area-inset-right);
      background:#F5F7FA;
    }
    @supports(padding:max(0px)){
      #root{
        padding-top:max(0px,env(safe-area-inset-top));
        padding-bottom:max(0px,env(safe-area-inset-bottom));
        padding-left:max(0px,env(safe-area-inset-left));
        padding-right:max(0px,env(safe-area-inset-right));
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="/_expo/static/js/web/${jsFile}" defer></script>
</body>
</html>`;

fs.writeFileSync(indexPath, indexContent);
console.log('✅ index.html configurado com PWA');

console.log('🎉 Build PWA completo!');
