import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VERSION } from "../src/app/constants/version.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appName = "EPM Tools";
const fileName = `${appName} - v${VERSION}.html`;

const sourceDir = path.join(__dirname, "../single-html-export");
const destDir = path.join(__dirname, "../public");
const sourceFile = path.join(sourceDir, "index.html");
const destFile = path.join(destDir, fileName);

function getMimeType(extension) {
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".eot": "application/vnd.ms-fontobject",
  };
  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

function convertToBase64(filePath) {
  return fs.readFileSync(filePath).toString("base64");
}

function processCssContent(cssContent, sourceDir) {
  const processUrl = (match, url) => {
    const filePath = path.join(sourceDir, url);
    if (fs.existsSync(filePath)) {
      const base64Content = convertToBase64(filePath);
      const mimeType = getMimeType(path.extname(url));
      return `url(data:${mimeType};base64,${base64Content})`;
    }
    console.warn(`File not found: ${filePath}`);
    return match;
  };

  return cssContent
    .replace(
      /url\((?:'|")?([^)'"]+\.(png|jpg|jpeg|gif|svg))(?:'|")?\)/g,
      processUrl
    )
    .replace(
      /url\((?:'|")?([^)'"]+\.(woff2?|ttf|otf|eot))(?:'|")?\)/g,
      processUrl
    );
}

function cleanupOldFiles(directory) {
  try {
    fs.readdirSync(directory)
      .filter((file) => file.endsWith(".html"))
      .forEach((file) => fs.unlinkSync(path.join(directory, file)));
    console.log("Deleted older HTML files in the public folder.");
  } catch (err) {
    console.error("Error while deleting old HTML files:", err);
  }
}

function processHtml(html, sourceDir) {
  // Process CSS
  html = html.replace(
    /<link[^>]+?href="([^"]+?\.css)"[^>]*>/g,
    (match, href) => {
      const cssPath = path.join(sourceDir, href);
      if (fs.existsSync(cssPath)) {
        const cssContent = processCssContent(
          fs.readFileSync(cssPath, "utf8"),
          sourceDir
        );
        return `<style>${cssContent}</style>`;
      }
      console.warn(`CSS file not found: ${cssPath}`);
      return "";
    }
  );

  // Process JS
  html = html.replace(
    /<script[^>]+?src="([^"]+?\.js)"[^>]*><\/script>/g,
    (match, src) => {
      const jsPath = path.join(sourceDir, src);
      if (fs.existsSync(jsPath)) {
        const base64Js = convertToBase64(jsPath);
        return `<script src="data:application/javascript;base64,${base64Js}"></script>`;
      }
      console.warn(`JavaScript file not found: ${jsPath}`);
      return "";
    }
  );

  // Process images
  html = html.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match, imgSrc) => {
    const imgPath = path.join(sourceDir, imgSrc);
    if (fs.existsSync(imgPath)) {
      const base64Img = convertToBase64(imgPath);
      const mimeType = getMimeType(path.extname(imgSrc));
      return match.replace(imgSrc, `data:${mimeType};base64,${base64Img}`);
    }
    console.warn(`Image file not found: ${imgPath}`);
    return match;
  });

  return html;
}

cleanupOldFiles(destDir);

let html = fs.readFileSync(sourceFile, "utf8");
html = processHtml(html, sourceDir);

const faviconLink = `<link rel="icon" href="data:image/svg+xml,%3Csvg stroke='currentColor' fill='%23688b9d' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg' style='color: rgb(61, 93, 110);'%3E%3Cpath d='M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z'%3E%3C/path%3E%3C/svg%3E" />`;

html = html.replace(/(<head[^>]*>)/i, `$1\n  ${faviconLink}`);
html = html.replace(/<link[^>]+rel="preload"[^>]*>/g, "");
html = html.replace(/<link[^>]+rel="prefetch"[^>]*>/g, "");

fs.writeFileSync(destFile, html);
console.log(`Generated ${fileName} and copied to public folder.`);
