/** @type {import('next').NextConfig} */

const fullVersionConfig = {
  // distDir: "dynamic-export",
  env: {
    NEXT_PUBLIC_FULL_VERSION: "true",
  },
};

const singleHTMLVersionConfig = {
  output: "export",
  distDir: "single-html-export",
  env: {
    NEXT_PUBLIC_FULL_VERSION: "false",
  },
};

const isSingleHTMLBuild = process.env.SINGLE_HTML_BUILD === "true";

const nextConfig = isSingleHTMLBuild
  ? singleHTMLVersionConfig
  : fullVersionConfig;

export default nextConfig;
