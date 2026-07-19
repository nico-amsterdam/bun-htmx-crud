export function BaseHtml({ lang, body }: { lang: string, body: JSX.Element }): string {
  return `
<!DOCTYPE html>
<html lang=${lang}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HTMX CRUD Demo</title>
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#fddcd0">
  <link rel="apple-touch-icon" href="/image/icon-192.png">
  <meta name="description" content="HTMX CRUD Demo">
  <meta name="htmx-config" content='{"allowEval":false,"includeIndicatorStyles":false,"defaultSwapStyle":"outerHTML"}'>
  <link rel="stylesheet" href="/css/bootstrap3-un.css?t=20260104">
  <link rel="stylesheet" href="/css/auth.css?t=20260104">
  <script src="/javascript/vendor/htmx.min.js" integrity="sha384-/TgkGk7p307TH7EXJDuUlgG3Ce1UVolAOFopFekQkkXihi5u/6OCvVKyz1W+idaz" crossorigin="anonymous"></script>
  <script src="/javascript/hx-preserve-input.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-filter-table.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-server-search.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-toggle-no-results.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-click-with-enter.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-send-error-dialog.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-dark-mode-toggle.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-navigate.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-dialog-close.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-language-switcher.js" crossorigin="anonymous"></script>
</head>
${body}
</html>
`
}
