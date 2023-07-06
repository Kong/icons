import fs from 'fs'
import { createIconComponent } from './utilities/index.js'

const svgFiles = fs.readdirSync('./svg')

if (svgFiles.length) {
  // Delete the `/src/components/` directory (to remove old generated components)
  fs.rmSync('src/components', { force: true, recursive: true })

  // Recreate the `src/components` directory
  if (!fs.existsSync('src/components')) {
    fs.mkdirSync('src/components')
  }

}

for (const file of svgFiles) {
  createIconComponent(file)
}
