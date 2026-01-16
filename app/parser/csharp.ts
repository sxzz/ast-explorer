import { csharpTemplate } from './template'
import type { LanguageOption } from './index'

export const csharp: LanguageOption = {
  label: 'C#',
  icon: 'i-vscode-icons:file-type-csharp',
  parsers: [treeSitterCSharp],
  codeTemplate: csharpTemplate,
}
