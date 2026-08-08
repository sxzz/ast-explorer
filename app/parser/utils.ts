const JSDELIVR_PREFIX = 'https://cdn.jsdelivr.net/npm/'

export async function fetchVersion(pkg: string) {
  const raw = await fetch(`${JSDELIVR_PREFIX}${pkg}/package.json`).then((r) =>
    r.json(),
  )
  return raw.version
}

export function getJsdelivrUrl(pkg: string, path: string = '/+esm'): string {
  return `${JSDELIVR_PREFIX}${pkg}${path || ''}`
}

export function importJsdelivr<T = any>(
  pkg: string,
  path?: string,
): Promise<T> {
  return importUrl(getJsdelivrUrl(pkg, path))
}

export function importUrl<T = any>(
  url: string,
  sandbox?: boolean,
  importMap?: ImportMap,
): Promise<T> {
  if (sandbox) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'about:blank'
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')
    document.body.parentElement!.append(iframe)
    const window = iframe.contentWindow
    if (!window) throw new Error('Failed to create sandboxed iframe')
    if (importMap) appendImportMap(window.document, importMap)
    const mod: Promise<any> = (window as any).eval(
      `import(${JSON.stringify(url)})`,
    )
    return mod.finally(() => iframe.remove())
  }

  if (importMap) {
    appendImportMap(document, importMap)
  }
  return import(/* @vite-ignore */ url)
}

function appendImportMap(document: Document, importMap: ImportMap) {
  const script = document.createElement('script')
  script.type = 'importmap'
  script.textContent = JSON.stringify(importMap)
  document.head.append(script)
}

export function del<T extends Array<any>>(arr: T, values: T[number][]): T {
  return arr.filter((v) => !values.includes(v)) as T
}

export async function resolveDefault(p: Promise<any>) {
  return (await p).default
}
