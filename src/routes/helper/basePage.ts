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
  <script src="/javascript/vendor/_hyperscript.min.js" integrity="sha384-NzchC8z9HmP/Ed8cheGl9XuSrFSkDNHPiDl+ujbHE0F0I7tWC4rUnwPXP+7IvVZv" crossorigin="anonymous"></script>
  <script src="/javascript/hx-filter-table.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-click-with-enter.js" crossorigin="anonymous"></script>
  <script src="/javascript/hx-send-error-dialog.js" crossorigin="anonymous"></script>
</head>
${body}
</html>
`
}
