import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      hot: {
        preserveLocalState: true,
        noDispose: true
      }
    })
  ]
})