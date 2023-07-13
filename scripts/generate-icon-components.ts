import path, { basename } from 'path'
import fs from 'fs'
import pc from 'picocolors'
import { get as emoji } from 'node-emoji'
import { getAllFiles, createComponentFromSvg, COMPONENTS_INDEX_FILE_HEADER } from './utilities'

try {
  console.log('')
  console.log(pc.cyan(pc.bold(`${emoji('sparkles')} Kong Icons ${emoji('sparkles')}`)))
  console.log('')

  const svgFiles = getAllFiles(path.resolve('./svg'), 'svg')
  const svgCount = svgFiles.length

  // Delete the `./src/components/` directory (to remove old generated components)
  fs.rmSync(path.resolve('./src/components'), { force: true, recursive: true })

  console.log(`Verifying ${svgCount.toLocaleString()} svg files...`)

  // If no svg files are found, exit
  if (!svgCount) {
    console.log(pc.yellow('No svg files found in the /svg/ directory.'))
    console.log('')
    process.exit(0)
  }

  // Check if there are duplicate svg filenames
  const uniqueFilenames = new Set()
  for (const filepath of svgFiles) {
    const name = basename(filepath)
    if (!uniqueFilenames.has(name)) {
      uniqueFilenames.add(name)
    } else {
      console.log(pc.red(`Duplicate svg filename '${name}' found. All svg source files must have a unique name.`))
      console.log('')
      process.exit(1)
    }
  }

  console.log(`Generating ${svgCount.toLocaleString()} icon components...`)

  // Recreate the `./src/components` directory
  if (!fs.existsSync(path.resolve('./src/components'))) {
    fs.mkdirSync(path.resolve('./src/components'))
  }

  // Create the `./src/components/index.ts` entry file
  fs.writeFileSync(path.resolve('./src/components/index.ts'), COMPONENTS_INDEX_FILE_HEADER, 'utf8')

  // Loop through each `./svg/*` file and create an icon component in `/src/components/`
  for (const filepath of svgFiles) {
    createComponentFromSvg(filepath, basename(filepath))
  }

  console.log(pc.green(`${emoji('rocket')} Successfully generated ${svgCount.toLocaleString()} icon components.`))
  console.log('')
} catch (err: any) {
  console.error('An error occurred in generating the icon components: ', err)
  console.log('')
  process.exit(1)
}
