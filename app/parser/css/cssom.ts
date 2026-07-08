import type { Parser } from '..'

const cached = new WeakMap<object, any>()

function serializeCssRuleList(rules: CSSRuleList) {
  const values = Array.from({ length: rules.length }, (_, index) =>
    serialize(rules.item(index)!),
  )
  ;(values as any)['#name'] = getConstructorName(rules)
  return values
}

function serializeMediaList(media: MediaList) {
  return {
    '#name': getConstructorName(media),
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

function serializeMediaRule(rule: CSSMediaRule) {
  return {
    '#name': getConstructorName(rule),
    media: serializeMediaList(rule.media),
    cssRules: serializeCssRuleList(rule.cssRules),
  }
}

function serialize(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value

  if (cached.has(value)) {
    return cached.get(value)
  }

  let result: unknown
  if (value instanceof MediaList) {
    result = serializeMediaList(value)
  } else if (value instanceof CSSRuleList) {
    result = serializeCssRuleList(value)
  } else if (value instanceof CSSStyleDeclaration) {
    result = serializeStyleDeclaration(value)
  } else if (value instanceof CSSMediaRule) {
    result = serializeMediaRule(value)
  } else if (value instanceof StylePropertyMap) {
    result = newObject(value, {
      length: value.size,
      properties: Array.from(value.entries()).map(([property, value]) => ({
        property,
        value: Array.from(value).map(serialize),
      })),
    })
  } else if (value instanceof CSSUnitValue) {
    result = newObject(value, {
      value: value.value,
      unit: value.unit,
    })
  } else if (value instanceof CSSStyleValue) {
    result = newObject(value, { value: value.toString() })
  } else {
    const newObj: Record<string, unknown> = {}
    cached.set(value, newObj)
    toPlainObject(value, newObj, serialize)
    result = newObj
  }

  cached.set(value, result)
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
  return serialize(sheet)
}

export const cssom: Parser<void, CSSStyleSheetInit> = {
  id: 'cssom',
  label: 'CSSOM',
  // @unocss-include
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
  nodeTitle: '#name',
  hideKeys: ['#name'],
}

function newObject(obj: object, newObj: any) {
  return {
    '#name': getConstructorName(obj),
    ...newObj,
  }
}

function toPlainObject<T extends object>(
  obj: T,
  newObj: any,
  mapper?: (value: any) => any,
) {
  newObj['#name'] = getConstructorName(obj)
  for (const key of getPrototypeKeys(obj)) {
    const value = obj[key as keyof T]
    if (typeof value === 'function') continue
    newObj[key] = mapper ? mapper(value) : value
  }
}

function getConstructorName(obj: object): string {
  return obj.constructor.name
}

const ALL_UPPERCASE = /^[A-Z0-9_]+$/

function getPrototypeKeys(obj: object): Set<string> {
  const keys = new Set<string>()
  let prototype = Object.getPrototypeOf(obj)
  do {
    if (prototype && prototype !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(prototype)) {
        if (key === 'constructor') continue
        if (ALL_UPPERCASE.test(key)) continue
        keys.add(key)
      }
    }
  } while ((prototype = Object.getPrototypeOf(prototype)))
  return keys
}
