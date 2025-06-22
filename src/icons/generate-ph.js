import { icons } from '@phosphor-icons/core'
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'

const weights = ['regular', 'bold', 'light', 'thin', 'fill', 'duotone']

if (existsSync('ph')) {
  rmSync('ph', { recursive: true, force: true })
}
mkdirSync('ph', { recursive: true })

icons.forEach(icon => {
  console.log(icon);
  weights.forEach(async weight => {
    let path = `./ph/${icon.name}-${weight}.svelte`;
    try {
      const raw = await import(`@phosphor-icons/core/assets/${weight}/${icon.name}-${weight}.svg?raw`)
      const data = raw.default.replace(/<svg([^>]*)>/s, '<svg $1 {...slot}>')
      writeFileSync(`${path}`, `
<script>
 const { ...slot } = $props();
</script>
${data}
`)
    } catch (e) {
      console.log(`Failed exporting ${path}: ${e}`);
    }
  })
})
