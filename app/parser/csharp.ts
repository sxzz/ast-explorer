import { csharpTemplate } from './template'
import type { LanguageOption } from './index'

export const csharp: LanguageOption = {
  label: 'C#',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-csharp',
  parsers: [treeSitterCSharp],
  codeTemplate: csharpTemplate,
}
