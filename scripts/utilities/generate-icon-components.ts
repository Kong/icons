import path, { basename } from 'path'
import fs from 'fs'
import pc from 'picocolors'
import { get as emoji } from 'node-emoji'
import {
  createComponentFromSvg,
  getAllFiles,
  getSubdirectories,
  getDeletedComponentList,
  storeComponentList,
  TS_FILE_HEADER,
} from './index'

/**
 * Generate Vue icon components from the /svg/* directory files.
 */
export default async function generate() {
  try {
    console.log('')
    console.log(pc.cyan(pc.bold(`${emoji('sparkles')} Kong Icons ${emoji('sparkles')}`)))
    console.log('')

    const svgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    const svgCount = svgFiles.length

    // Directories and files
    const componentsDirectory = path.resolve('./src/components')
    const componentsIndex = path.resolve('./src/components/index.ts')

    // Delete the `./src/components/` directory (to remove old generated components)
    fs.rmSync(componentsDirectory, { force: true, recursive: true })

    console.log(`Verifying ${svgCount.toLocaleString()} svg files...`)

    // If no SVG files are found, exit
    if (!svgCount) {
      console.log(pc.yellow('No SVG files found in the /svg/ directory.'))
      console.log('')
      process.exit(0)
    }

    // Check if there are duplicate SVG filenames
    const uniqueFilenames = new Set<string>()
    for (const filepath of svgFiles) {
      const name = basename(filepath)
      if (!uniqueFilenames.has(name)) {
        uniqueFilenames.add(name)
      } else {
        console.log(pc.red(`Duplicate SVG filename '${name}' found. All SVG source files must have a unique name.`))
        console.log('')
        process.exit(1)
      }
    }

    console.log(`Generating ${svgCount.toLocaleString()} icon components...`)

    // Recreate the `./src/components` directory
    if (!fs.existsSync(componentsDirectory)) {
      fs.mkdirSync(componentsDirectory)
    }

    // Create the `./src/components/index.ts` entry file
    fs.writeFileSync(componentsIndex, TS_FILE_HEADER, 'utf8')

    // Loop through each subdirectory and create an export
    const svgSubdirectories = getSubdirectories(path.resolve('./svg'))
    for (const subdirectory of svgSubdirectories) {
      const subdirectoryPath = path.resolve(`./svg/${subdirectory}`)
      // Ensure path exists
      if (!fs.existsSync(subdirectoryPath)) {
        continue
      }

      const subdirectoryFileCount = getAllFiles(subdirectoryPath, 'svg')
      // If there are no files in the directory, skip it
      if (!subdirectoryFileCount.length) {
        continue
      }

      // Create `/src/components/{subdirectory}` if it doesn't exist
      if (!fs.existsSync(path.resolve(`./src/components/${subdirectory}`))) {
        fs.mkdirSync(path.resolve(`./src/components/${subdirectory}`))
      }
      // Create ${subdirectory}/index.ts
      fs.writeFileSync(path.resolve(`./src/components/${subdirectory}/index.ts`), TS_FILE_HEADER, 'utf8')
      // Export all from subdirectory
      fs.appendFileSync(componentsIndex, `export * from './${subdirectory}'\n`, 'utf8')
    }

    // Create a Set to store generated icon component names
    const generatedComponents = new Set<string>()

    // Loop through each `./svg/*` file and create an icon component in `/src/components/`
    for (const filepath of svgFiles) {
      const componentName: string = createComponentFromSvg(filepath, basename(filepath))

      // If no componentName, exit early
      if (!componentName) {
        console.error(pc.red('A componentName was not returned'))
        console.log('')
        process.exit(1)
      }

      // Add the component name to the Set
      generatedComponents.add(componentName)
    }

    // Inject the generated array of component names into the `/src/temp-generated-component-list.ts` file
    storeComponentList({
      components: Array.from(generatedComponents),
      update: false,
    })

    // Generate a the list of components that were deleted since the last run
    const deletedComponentList = await getDeletedComponentList()

    // If any components were deleted since the last run, throw an error and instruct the user to edit the `component-list.ts` file.
    if (deletedComponentList?.length) {
      console.log('')
      console.error(pc.bold(pc.red('Error: Existing components have been removed from the package:')))
      console.log('')
      for (const component of deletedComponentList) {
        console.error(pc.red(`- '${component}'`))
      }
      console.log('')
      console.error('If this is intentional, run `pnpm update-component-list` and')
      console.error('commit the changes to your branch.')
      console.log('')
      console.error(`In most cases, removing a component is a ${pc.bold('breaking change')} and`)
      console.error('should initiate a new major version via semantic-release.')
      console.log('')
      process.exit(1)
    }

    console.log(pc.green(`${emoji('rocket')} Successfully generated ${svgCount.toLocaleString()} icon components.`))
    console.log('')
  } catch (err: any) {
    console.error(pc.red('An error occurred in generating the icon components: '), err)
    console.log('')
    process.exit(1)
  }
}
