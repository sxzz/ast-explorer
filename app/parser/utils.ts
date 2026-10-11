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
  return importModule(getJsdelivrUrl(pkg, path))
}

export function importModule<T = any>(
  url: string,
  {
    sandbox,
    patchWorker,
    importMap,
  }: {
    sandbox?: boolean
    importMap?: ImportMap
    patchWorker?: boolean
  } = {},
): Promise<T> {
  if (patchWorker) sandbox = true
  if (sandbox) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'about:blank'
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')
    document.body.parentElement!.append(iframe)
    const window = iframe.contentWindow as (Window & typeof globalThis) | null
    if (!window) throw new Error('Failed to create sandboxed iframe')

    if (importMap) {
      appendImportMap(window.document, importMap)
    }
    if (patchWorker) {
      window.eval(`${hackWorker.toString()};\nhackWorker();`)
    }
    const mod: Promise<any> = window.eval(`import(${JSON.stringify(url)})`)
    return mod.finally(() => iframe.remove())
  }

  if (importMap) {
    appendImportMap(document, importMap)
  }
  return import(/* @vite-ignore */ url)
}

function hackWorker() {
  const workerPatchKey = Symbol.for('ast-explorer.worker-patch')

  // @ts-expect-error - missing type for globalThis
  if (globalThis[workerPatchKey]) return

  // eslint-disable-next-line unicorn/no-unnecessary-global-this
  const NativeWorker = globalThis.Worker

  // eslint-disable-next-line unicorn/no-global-object-property-assignment
  globalThis.Worker = new Proxy(NativeWorker, {
    construct(Target, [input, options]): Worker {
      const url = new URL(String(input), location.href)
      const link = JSON.stringify(url.href)

      const bootstrap = `${options.type === 'module' ? 'import' : 'importScripts'}(${link})`
      const blobURL = URL.createObjectURL(
        new Blob([bootstrap], { type: 'text/javascript' }),
      )

      try {
        const worker: Worker = Reflect.construct(Target, [blobURL, options])
        const nativeTerminate = worker.terminate.bind(worker)

        worker.terminate = () => {
          nativeTerminate()
          URL.revokeObjectURL(blobURL)
        }

        return worker
      } catch (error) {
        URL.revokeObjectURL(blobURL)
        throw error
      }
    },
  })

  // @ts-expect-error - missing type for globalThis
  // eslint-disable-next-line unicorn/no-global-object-property-assignment
  globalThis[workerPatchKey] = NativeWorker
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
