export abstract class HttpHeader {
  // Requests: https://htmx.org/docs/#request-headers
  static readonly HxBoosted = "HX-Boosted"
  static readonly HxCurrentUrl = "HX-Current-URL"
  static readonly HxHistoryRestoreRequest = "HX-History-Restore-Request"
  static readonly HxPrompt = "HX-Prompt"
  static readonly HxRequest = "HX-Request"
  static readonly HxTarget = "HX-Target"
  static readonly HxTriggerName = "HX-Trigger-Name"
  static readonly HxTrigger = "HX-Trigger"

  // Responses: https://htmx.org/docs/#response-headers
  static readonly HxLocation = "HX-Location"
  static readonly HxPushURL = "HX-Push-Url"
  static readonly HxRedirect = "HX-Redirect"
  static readonly HxRefresh = "HX-Refresh"
  static readonly HxReplaceURL = "HX-Replace-Url"
  static readonly HxReswap = "HX-Reswap"
  static readonly HxRetarget = "HX-Retarget"
  static readonly HxReselect = "HX-Reselect"
  // HxTrigger = "HX-Trigger"  already defined
  static readonly HxTriggerAfterSettle = "HX-Trigger-After-Settle"
  static readonly HxTriggerAfterSwap = "HX-Trigger-After-Swap"
}

export function isHtmxEnabled(request: Request) {
  return request.headers.get(HttpHeader.HxRequest) == "true"
}
