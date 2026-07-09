// scripts/translate-en.mjs
// Camino A: generates English tool content + assigns categories.
// - Adds `categoria` (ES) to every src/content/tools/*.json (original ES text untouched otherwise)
// - Writes src/content/tools-en/*.json with `category` (EN) for the toolsEn collection
// - EN titulo_seo/h1 are curated translations; EN texto_seo is a templated
//   >=300-char SEO paragraph (no external API calls).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ES_DIR = path.join(ROOT, 'src/content/tools');
const EN_DIR = path.join(ROOT, 'src/content/tools-en');

// ---- Categories -----------------------------------------------------------
// EN key -> ES label (used for the ES `categoria` field)
const CAT_ES = {
  crypto: 'Criptografía',
  converter: 'Conversores',
  web: 'Web',
  dev: 'Desarrollo',
  network: 'Red',
  math: 'Matemáticas',
  text: 'Texto',
  images: 'Imágenes',
  measurement: 'Medición',
  data: 'Datos',
};

// slug -> category key
const CAT = {
  'base64-archivo': 'data',
  'basic-auth': 'web',
  'generador-bip39': 'crypto',
  'buscador-mac': 'network',
  'codificador-base64': 'converter',
  'calculadora-chmod': 'dev',
  'calculadora-eta': 'math',
  'calculadora-porcentaje': 'math',
  'calculadora-subred-ipv4': 'network',
  'convertidor-mayusculas': 'text',
  'convertidor-color': 'converter',
  'constructor-benchmark': 'dev',
  'convertidor-base': 'converter',
  'convertidor-fecha': 'measurement',
  'convertidor-ipv4': 'network',
  'convertidor-listas': 'text',
  'convertidor-temperatura': 'measurement',
  'cronometro': 'measurement',
  'generador-crontab': 'dev',
  'diferencia-json': 'data',
  'diferencia-texto': 'text',
  'docker-run-a-compose': 'dev',
  'cifrador-aes': 'crypto',
  'entidades-html': 'text',
  'estadisticas-texto': 'text',
  'evaluador-matematico': 'math',
  'expansor-rango-ipv4': 'network',
  'formateador-json': 'data',
  'formato-sql': 'data',
  'formato-xml': 'data',
  'formato-yaml': 'data',
  'generador-ascii-art': 'text',
  'generador-hash-sha256': 'crypto',
  'generador-ipv6-ula': 'network',
  'generador-lorem-ipsum': 'text',
  'generador-mac': 'network',
  'generador-numeronimos': 'text',
  'generador-og-meta': 'web',
  'generador-puerto': 'network',
  'generador-qr-wifi': 'web',
  'generador-qr': 'images',
  'generador-svg-placeholder': 'images',
  'generador-token': 'crypto',
  'generador-ulid': 'dev',
  'grabadora-camara': 'images',
  'generador-hmac': 'crypto',
  'hoja-git': 'dev',
  'hoja-regex': 'dev',
  'codigos-http': 'web',
  'info-dispositivo': 'dev',
  'info-keycode': 'dev',
  'json-a-csv': 'data',
  'json-a-toml': 'data',
  'json-a-xml': 'data',
  'json-a-yaml': 'data',
  'json-minify': 'data',
  'decodificador-jwt': 'crypto',
  'markdown-a-html': 'text',
  'generador-meta-tags': 'web',
  'normalizador-email': 'web',
  'numeros-romanos': 'math',
  'ofuscador-cadenas': 'text',
  'generador-otp': 'crypto',
  'parser-telefono': 'web',
  'parser-url': 'web',
  'analizador-contrasena': 'crypto',
  'probador-regex': 'dev',
  'generador-rsa': 'crypto',
  'limpiador-enlaces': 'web',
  'selector-emoji': 'text',
  'generador-slug': 'web',
  'texto-a-binario': 'converter',
  'texto-a-nato': 'text',
  'texto-a-unicode': 'text',
  'tipos-mime': 'web',
  'toml-a-json': 'data',
  'toml-a-yaml': 'data',
  'url-encoder': 'web',
  'parser-user-agent': 'web',
  'generador-uuid': 'dev',
  'validador-iban': 'web',
  'verificador-firma-pdf': 'crypto',
  'xml-a-json': 'data',
  'yaml-a-json': 'data',
  'yaml-a-toml': 'data',
};

// ---- Curated EN titles ----------------------------------------------------
// slug -> [en_h1, en_titulo_seo]
const EN = {
  'base64-archivo': ['Base64 File Converter', 'Base64 File Converter Online Free'],
  'basic-auth': ['Basic Auth Generator', 'Basic Auth Header Generator Online Free'],
  'generador-bip39': ['BIP39 Generator', 'Free BIP39 Mnemonic Phrase Generator'],
  'buscador-mac': ['MAC Lookup', 'MAC Vendor Lookup Online Free'],
  'codificador-base64': ['Base64 Encoder and Decoder', 'Base64 Encoder and Decoder Online Free'],
  'calculadora-chmod': ['Chmod Calculator', 'Chmod Calculator Online Free'],
  'calculadora-eta': ['ETA Calculator', 'ETA Calculator Online Free'],
  'calculadora-porcentaje': ['Percentage Calculator', 'Percentage Calculator Online Free'],
  'calculadora-subred-ipv4': ['IPv4 Subnet Calculator', 'IPv4 Subnet Calculator Online Free'],
  'convertidor-mayusculas': ['Uppercase and Lowercase Converter', 'Uppercase and Lowercase Converter Online Free'],
  'convertidor-color': ['HEX to RGB Color Converter', 'HEX to RGB Color Converter Online Free'],
  'constructor-benchmark': ['Benchmark Builder', 'Benchmark Builder Online Free'],
  'convertidor-base': ['Integer Base Converter', 'Numeric Base Converter Online Free'],
  'convertidor-fecha': ['Date and Time Converter', 'Date and Time Converter Online Free'],
  'convertidor-ipv4': ['IPv4 Address Converter', 'IPv4 Converter Online Free'],
  'convertidor-listas': ['List Converter', 'List Converter Online Free'],
  'convertidor-temperatura': ['Temperature Converter', 'Temperature Converter Online Free'],
  'cronometro': ['Stopwatch', 'Stopwatch Online Free'],
  'generador-crontab': ['Crontab Generator and Explainer', 'Crontab Generator and Explainer Online Free'],
  'diferencia-json': ['JSON Diff', 'JSON Comparator Online Free'],
  'diferencia-texto': ['Text Diff', 'Text Diff Comparator Online Free'],
  'docker-run-a-compose': ['Docker Run to Docker Compose', 'Docker Run to Compose Converter Online Free'],
  'cifrador-aes': ['AES-GCM Cipher', 'AES-GCM Cipher Online Free'],
  'entidades-html': ['HTML Entity Escape', 'HTML Entity Escape and Unescape Online Free'],
  'estadisticas-texto': ['Text Statistics', 'Text Statistics Online Free'],
  'evaluador-matematico': ['Math Evaluator', 'Math Expression Evaluator Online Free'],
  'expansor-rango-ipv4': ['IPv4 Range Expander', 'IPv4 Range Expander Online Free'],
  'formateador-json': ['JSON Formatter', 'JSON Formatter Online Free'],
  'formato-sql': ['SQL Format', 'SQL Formatter Online Free'],
  'formato-xml': ['XML Format', 'XML Formatter Online Free'],
  'formato-yaml': ['YAML Format', 'YAML Formatter Online Free'],
  'generador-ascii-art': ['ASCII Art Generator', 'ASCII Art Generator Online Free'],
  'generador-hash-sha256': ['SHA-256 Hash Generator', 'SHA-256 Hash Generator Online Free'],
  'generador-ipv6-ula': ['IPv6 ULA Generator', 'IPv6 ULA Generator Online Free'],
  'generador-lorem-ipsum': ['Lorem Ipsum Generator', 'Lorem Ipsum Generator Online Free'],
  'generador-mac': ['MAC Generator', 'MAC Address Generator Online Free'],
  'generador-numeronimos': ['Numeronym Generator', 'Numeronym Generator Online Free'],
  'generador-og-meta': ['Open Graph Meta Generator', 'Open Graph Meta Tags Generator Online Free'],
  'generador-puerto': ['Random Port Generator', 'Port Generator Online Free'],
  'generador-qr-wifi': ['WiFi QR Generator', 'WiFi QR Generator Online Free'],
  'generador-qr': ['QR Code Generator', 'QR Code Generator Online Free'],
  'generador-svg-placeholder': ['SVG Placeholder Generator', 'SVG Placeholder Generator Online Free'],
  'generador-token': ['Token Generator', 'Random Token Generator Online Free'],
  'generador-ulid': ['ULID Generator', 'ULID Generator Online Free'],
  'grabadora-camara': ['Camera Recorder', 'Camera Recorder Online Free'],
  'generador-hmac': ['HMAC-SHA256 Generator', 'HMAC-SHA256 Generator Online Free'],
  'hoja-git': ['Git Cheat Sheet', 'Git Cheat Sheet Online Free'],
  'hoja-regex': ['Regex Cheat Sheet', 'Regex Cheat Sheet Online Free'],
  'codigos-http': ['HTTP Codes Lookup', 'HTTP Codes Lookup Online Free'],
  'info-dispositivo': ['Device Info', 'Device Information Online Free'],
  'info-keycode': ['Keycode Info', 'Key Keycode Information Online Free'],
  'json-a-csv': ['JSON to CSV Converter', 'JSON to CSV Converter Online Free'],
  'json-a-toml': ['JSON to TOML Converter', 'JSON to TOML Converter Online Free'],
  'json-a-xml': ['JSON to XML Converter', 'JSON to XML Converter Online Free'],
  'json-a-yaml': ['JSON to YAML Converter', 'JSON to YAML Converter Online Free'],
  'json-minify': ['Minify JSON', 'Minify JSON Online Free'],
  'decodificador-jwt': ['JWT Decoder', 'JWT Decoder Online Free'],
  'markdown-a-html': ['Markdown to HTML Converter', 'Markdown to HTML Converter Online Free'],
  'generador-meta-tags': ['Meta Tags Generator', 'SEO Meta Tags Generator Free'],
  'normalizador-email': ['Email Normalizer', 'Email Normalizer Online Free'],
  'numeros-romanos': ['Roman Numerals Converter', 'Roman Numerals Converter Online Free'],
  'ofuscador-cadenas': ['String Obfuscator', 'String Obfuscator Online Free'],
  'generador-otp': ['OTP Generator', 'OTP Code (2FA) Generator Free'],
  'parser-telefono': ['Phone Parser and Formatter', 'Phone Parser Online Free'],
  'parser-url': ['URL Analyzer', 'URL Analyzer Online Free'],
  'analizador-contrasena': ['Password Strength Analyzer', 'Password Strength Analyzer Free'],
  'probador-regex': ['Regex Tester', 'Regex Tester Online Free'],
  'generador-rsa': ['RSA Key Generator', 'RSA 2048 Key Generator Online Free'],
  'limpiador-enlaces': ['Link Cleaner', 'Tracking Link Cleaner Free'],
  'selector-emoji': ['Emoji Picker', 'Emoji Picker Online Free'],
  'generador-slug': ['Slug Generator for URLs', 'Slug Generator for URLs Online Free'],
  'texto-a-binario': ['Text to ASCII Binary', 'Text to Binary Converter Online Free'],
  'texto-a-nato': ['Text to NATO Alphabet', 'Text to NATO Alphabet Converter Online Free'],
  'texto-a-unicode': ['Text to Unicode', 'Text to Unicode Converter Online Free'],
  'tipos-mime': ['MIME Types', 'MIME Types Converter Online Free'],
  'toml-a-json': ['TOML to JSON Converter', 'TOML to JSON Converter Online Free'],
  'toml-a-yaml': ['TOML to YAML Converter', 'TOML to YAML Converter Online Free'],
  'url-encoder': ['URL Encoder and Decoder', 'URL Encoder and Decoder Online Free'],
  'parser-user-agent': ['User-Agent Parser', 'User-Agent Parser Online Free'],
  'generador-uuid': ['UUID v4 Generator', 'UUID v4 Generator Online Free'],
  'validador-iban': ['IBAN Validator and Parser', 'IBAN Validator Online Free'],
  'verificador-firma-pdf': ['PDF Signature Verifier', 'PDF Signature Verifier Online Free'],
  'xml-a-json': ['XML to JSON Converter', 'XML to JSON Converter Online Free'],
  'yaml-a-json': ['YAML to JSON Converter', 'YAML to JSON Converter Online Free'],
  'yaml-a-toml': ['YAML to TOML Converter', 'YAML to TOML Converter Online Free'],
};

// ---- Helpers --------------------------------------------------------------
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function enSeoText(enH1, catKey) {
  const catEn = catKey.charAt(0).toUpperCase() + catKey.slice(1);
  const t = `The ${enH1.toLowerCase()} is a free online utility that runs entirely in your browser. ${cap(enH1)} helps you save time on repetitive tasks, debug information, validate inputs, and learn how the underlying formats and standards work. No data is ever sent to a server, which guarantees complete privacy and instant responses. It is free, requires no registration, and works on any device with a modern browser. Use it to process ${catEn.toLowerCase()} data quickly and securely, whether you are a developer, system administrator, or anyone who handles data every day. This tool is lightweight, fully client-side, and designed for speed and privacy so you can work without compromises.`;
  return t;
}

// ---- Main -----------------------------------------------------------------
const files = fs.readdirSync(ES_DIR).filter((f) => f.endsWith('.json'));
fs.mkdirSync(EN_DIR, { recursive: true });

let ok = 0;
for (const f of files) {
  const esData = JSON.parse(fs.readFileSync(path.join(ES_DIR, f), 'utf8'));
  const slug = esData.slug;

  const catKey = CAT[slug];
  if (!catKey) throw new Error(`Missing category for slug: ${slug}`);
  const [enH1, enTitulo] = EN[slug];
  if (!enH1 || !enTitulo) throw new Error(`Missing EN title for slug: ${slug}`);

  // 1) Add `categoria` to the ES file (keep all original ES content untouched).
  esData.categoria = CAT_ES[catKey];
  fs.writeFileSync(path.join(ES_DIR, f), JSON.stringify(esData, null, 2) + '\n');

  // 2) Build the EN record for the toolsEn collection.
  const enData = {
    slug: esData.slug,
    component: esData.component,
    titulo_seo: enTitulo,
    meta_descripcion: `${enH1} — free, private, 100% client-side online tool.`,
    h1: enH1,
    texto_seo: enSeoText(enH1, catKey),
    ads_layout: esData.ads_layout ?? 'standard',
    category: catKey.charAt(0).toUpperCase() + catKey.slice(1),
  };
  fs.writeFileSync(path.join(EN_DIR, f), JSON.stringify(enData, null, 2) + '\n');
  ok++;
}

console.log(`Processed ${ok} tools. ES categorias set; EN files written to src/content/tools-en/.`);
