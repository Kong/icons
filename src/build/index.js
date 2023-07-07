import path from 'path'
import fs from 'fs'
import pc from 'picocolors'
import { get as emoji } from 'node-emoji'
import { createComponentFromSvg, COMPONENTS_INDEX_FILE_HEADER } from './utilities/index.js'

console.log('')
console.log(pc.cyan(pc.bold(`${emoji('sparkles')} Kong Icons ${emoji('sparkles')}`)))
console.log('')

const svgFiles = fs.readdirSync('./svg')
const svgCount = svgFiles.length

console.log(`Generating ${svgCount.toLocaleString()} icon components...`)

// If no svg files are found, exit
if (!svgCount) {
  console.log('No svg files found in the `svg/` directory.')
  process.exit(0)
}

// Delete the `./src/components/` directory (to remove old generated components)
fs.rmSync(path.resolve('./src/components'), { force: true, recursive: true })

// Recreate the `./src/components` directory
if (!fs.existsSync(path.resolve('./src/components'))) {
  fs.mkdirSync(path.resolve('./src/components'))
}

// Create the `./src/components/index.ts` entry file
fs.writeFileSync(path.resolve('./src/components/index.ts'), COMPONENTS_INDEX_FILE_HEADER, 'utf8')

// Loop through each `./svg/*` file and create an icon component in `/src/components/`
for (const file of svgFiles) {
  createComponentFromSvg(file)
}

console.log(pc.green(`${emoji('rocket')} Successfully generated ${svgCount.toLocaleString()} icon components.`))
console.log('')
