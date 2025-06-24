import { icons } from '@phosphor-icons/core'
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'

const weights = ['regular', 'bold', 'light', 'thin', 'fill', 'duotone']

if (existsSync('ph')) {
  rmSync('ph', { recursive: true, force: true })
}
mkdirSync('ph', { recursive: true })

icons.forEach(icon => {
  weights.forEach(async weight => {
    const id = `${icon.name}-${weight}`;
    const path = `./ph/${id}.svelte`;
    try {
      const raw = await import(`@phosphor-icons/core/assets/${weight}/${id}.svg?raw`)
      const data = raw.default.replace(/<svg([^>]*)>/s, '<svg $1 class={className}>')
      writeFileSync(`${path}`, `
<script>
 const { class: className } = $props();
</script>
${data}
`)
    } catch (e) {
      console.log(`Failed exporting ${path}: ${e}`);
    }
  })
})
