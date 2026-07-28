import { x } from 'tinyexec'

console.log('Pushing to release branch')
await x('git', ['update-ref', 'refs/heads/release', 'refs/heads/main'], {
  nodeOptions: { stdio: 'inherit' },
  throwOnError: true,
  nodePath: false,
})
await x('git', ['push', 'origin', 'release'], {
  nodeOptions: { stdio: 'inherit' },
  throwOnError: true,
  nodePath: false,
})
