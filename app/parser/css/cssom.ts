import type { Parser } from '..'

// @unocss-include

type CssomObject = Record<string, unknown>

const CSSOM_RULE_TYPES: Record<number, string> = {
  1: 'CSSStyleRule',
  2: 'CSSCharsetRule',
  3: 'CSSImportRule',
  4: 'CSSMediaRule',
  5: 'CSSFontFaceRule',
  6: 'CSSPageRule',
  7: 'CSSKeyframesRule',
  8: 'CSSKeyframeRule',
  9: 'CSSMarginRule',
  10: 'CSSNamespaceRule',
  11: 'CSSCounterStyleRule',
  12: 'CSSSupportsRule',
  14: 'CSSFontFeatureValuesRule',
}

function readCssomProperty<T>(source: object, key: string): T | undefined {
  try {
    return (source as Record<string, T>)[key]
  } catch {
    return undefined
  }
}

function addCssomPrimitive(source: object, target: CssomObject, key: string) {
  const value = readCssomProperty<unknown>(source, key)
  if (
    value == null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    target[key] = value
  }
}

function addCssomStringList(source: object, target: CssomObject, key: string) {
  const value = readCssomProperty<ReadonlyArray<string>>(source, key)
  if (Array.isArray(value)) {
    target[key] = [...value]
  }
}

function serializeCssRuleList(rules: CSSRuleList) {
  return Array.from({ length: rules.length }, (_, index) =>
    serializeCssRule(rules.item(index)!),
  )
}

function serializeMediaList(media: MediaList) {
  return {
    mediaText: media.mediaText,
    length: media.length,
    items: Array.from({ length: media.length }, (_, index) =>
      media.item(index),
    ),
  }
}

function serializeStyleDeclaration(style: CSSStyleDeclaration) {
  return {
    cssText: style.cssText,
    length: style.length,
    declarations: Array.from({ length: style.length }, (_, index) => {
      const property = style.item(index)
      return {
        property,
        value: style.getPropertyValue(property),
        priority: style.getPropertyPriority(property),
      }
    }),
  }
}

function getCssRuleType(rule: CSSRule) {
  return (
    readCssomProperty<Function>(rule, 'constructor')?.name ||
    CSSOM_RULE_TYPES[rule.type] ||
    'CSSRule'
  )
}

function serializeCssRule(rule: CSSRule): CssomObject {
  const result: CssomObject = {
    type: getCssRuleType(rule),
    typeCode: rule.type,
    cssText: rule.cssText,
  }

  for (const key of [
    'selectorText',
    'conditionText',
    'containerName',
    'containerQuery',
    'href',
    'layerName',
    'supportsText',
    'namespaceURI',
    'prefix',
    'keyText',
    'name',
    'fontFamily',
    'basePalette',
    'overrideColors',
    'additiveSymbols',
    'fallback',
    'negative',
    'pad',
    'range',
    'speakAs',
    'suffix',
    'symbols',
    'system',
    'syntax',
    'initialValue',
    'navigation',
    'start',
    'end',
    'inherits',
  ]) {
    addCssomPrimitive(rule, result, key)
  }

  addCssomStringList(rule, result, 'nameList')
  addCssomStringList(rule, result, 'types')

  const media = readCssomProperty<MediaList>(rule, 'media')
  if (media) {
    result.media = serializeMediaList(media)
  }

  const style = readCssomProperty<CSSStyleDeclaration>(rule, 'style')
  if (style) {
    result.style = serializeStyleDeclaration(style)
  }

  const cssRules = readCssomProperty<CSSRuleList>(rule, 'cssRules')
  if (cssRules) {
    result.cssRules = serializeCssRuleList(cssRules)
  }

  return result
}

function parseCssom(code: string, options: CSSStyleSheetInit) {
  if (
    typeof CSSStyleSheet === 'undefined' ||
    typeof CSSStyleSheet.prototype.replaceSync !== 'function'
  ) {
    throw new TypeError(
      'CSSStyleSheet.replaceSync is not available in this browser',
    )
  }

  const sheet = new CSSStyleSheet(options)
  sheet.replaceSync(code)

  return {
    type: 'CSSStyleSheet',
    disabled: sheet.disabled,
    href: sheet.href,
    media: serializeMediaList(sheet.media),
    title: sheet.title,
    cssRules: serializeCssRuleList(sheet.cssRules),
  }
}

export const cssom: Parser<void, CSSStyleSheetInit> = {
  id: 'cssom',
  label: 'CSSOM',
  icon: 'i-vscode-icons:file-type-css',
  link: 'https://developer.mozilla.org/docs/Web/API/CSSStyleSheet',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  pkgName: '',
  version: 'Browser API',
  versionOverridable: false,
  init: () => {},
  parse: parseCssom,
}
