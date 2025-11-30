
export const BaseHtml = ({ children }: { children: JSX.Element }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bun HTMX CRUD</title>
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#fddcd0">
  <link rel="apple-touch-icon" href="images/bun-htmx.png">
  <meta name="description" content="BUN HTMX CRUD project">
  <meta name="htmx-config" content='{"allowEval":false,"includeIndicatorStyles":false,"defaultSwapStyle":"outerHTML"}'>
  <link rel="stylesheet" href="/css/bootstrap3-un.css">
  <link rel="stylesheet" href="/css/auth.css">
  <script src="/javascript/vendor/htmx.min.js" integrity="sha384-/TgkGk7p307TH7EXJDuUlgG3Ce1UVolAOFopFekQkkXihi5u/6OCvVKyz1W+idaz" crossorigin="anonymous"></script>
  <script src="/javascript/vendor/_hyperscript.min.js" integrity="sha384-NzchC8z9HmP/Ed8cheGl9XuSrFSkDNHPiDl+ujbHE0F0I7tWC4rUnwPXP+7IvVZv" crossorigin="anonymous"></script>
</head>
${children}
</html>
`
