import path, { basename } from 'path'
import fs from 'fs'
import pc from 'picocolors'
import { get as emoji } from 'node-emoji'
import {
  getAllFiles,
  createComponentFromSvg,
  storeComponentList,
  getDeletedComponentList,
  TS_FILE_HEADER,
} from './utilities'

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
  const uniqueFilenames = new Set<string>()
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
  fs.writeFileSync(path.resolve('./src/components/index.ts'), TS_FILE_HEADER, 'utf8')

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

  // Inject the generated array of component names into the `/src/generated-component-list.ts` file
  storeComponentList({
    components: Array.from(generatedComponents),
    save: false,
  })

  // TODO: Check the list of generated components against the components that were created in the last run
  const deletedComponentList = await getDeletedComponentList()

  // If any components were deleted, throw an error and instruct the user to edit the `component-list.ts` file.
  if (deletedComponentList?.length) {
    console.log('')
    console.error(pc.bold(pc.red('Error: Existing components have been removed from the package:')))
    console.log('')
    for (const component of deletedComponentList) {
      console.error(pc.red(`- '${component}'`))
    }
    console.log('')
    console.error('If this is intentional:')
    console.error(' 1. Find the component(s) in the `/src/component-list.ts` file.')
    console.error(' 2. Manually remove the component name(s) from the array.')
    console.error(' 3. Save the file, and commit the changes to your branch.')
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
