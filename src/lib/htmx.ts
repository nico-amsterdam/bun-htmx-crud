/*
 * Classes
 */

export abstract class HttpHeader {
  // Requests: https://four.htmx.org/docs/#request-headers
  static readonly HxBoosted = "HX-Boosted"
  static readonly HxCurrentUrl = "HX-Current-URL"
  static readonly HxHistoryRestoreRequest = "HX-History-Restore-Request"
  static readonly HxRequest = "HX-Request"
  static readonly HxRequestType = "HX-Request-Type"
  static readonly HxSource = "HX-Source"
  static readonly HxTarget = "HX-Target"
  static readonly HxPrompt = "HX-Prompt" // hx-prompt extension

  // Responses: https://four.htmx.org/docs/#response-headers
  static readonly HxLocation = "HX-Location"
  static readonly HxPushURL = "HX-Push-Url"
  static readonly HxRedirect = "HX-Redirect"
  static readonly HxRefresh = "HX-Refresh"
  static readonly HxReplaceURL = "HX-Replace-Url"
  static readonly HxReswap = "HX-Reswap"
  static readonly HxRetarget = "HX-Retarget"
  static readonly HxReselect = "HX-Reselect"
  static readonly HxTrigger = "HX-Trigger"
}

/*
 * Functions
 */

export function isHtmxEnabled(request: Request) {
  return request.headers.get(HttpHeader.HxRequest) == "true"
}
