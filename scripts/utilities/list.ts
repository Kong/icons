import fs from 'fs'
import path, { basename } from 'path'
import { get as emoji } from 'node-emoji'
import pc from 'picocolors'
import { getAllFiles, COMPONENT_LIST_FILE_HEADER, TS_FILE_HEADER } from './index'

interface StoreComponentListOptions {
  /** The array of components to store */
  components: string[]
  /** Are we updating the exported component list (only on release)? */
  update?: boolean
}

/**
 * Store the list of components, either permanently in the `src/component-list.ts` file,
 * or temporarily in the `src/temp-generated-component-list.ts` file (not in source control).
 */
export const storeComponentList = ({
  components,
  update = false,
}: StoreComponentListOptions) => {
  try {
    components.sort()
    const componentsArray = components.map(component => `  '${component}',`)
    const filepath = update ? path.resolve('./src/component-list.ts') : path.resolve('./src/temp-generated-component-list.ts')

    // Inject the generated array of component names into the `/src/component-list.ts` file
    fs.writeFileSync(filepath, `${update ? COMPONENT_LIST_FILE_HEADER : TS_FILE_HEADER}\nexport default [\n${componentsArray.join('\n')}\n]\n`, 'utf8')
  } catch (err: any) {
    console.error(pc.red('An error occurred while attempting to store the component list: '), err)
    console.log('')
    process.exit(1)
  }
}

/**
 * Get an array of component filenames that have been deleted since the last run
 */
export const getDeletedComponentList = async (): Promise<string[]> => {
  try {
    const tokenListPath = './src/component-list.ts'
    if (!fs.existsSync(tokenListPath)) {
      console.log('')
      console.log(pc.yellow('Cannot detect missing components because'))
      console.log(pc.yellow('the `/src/component-list.ts` file is missing.'))
      console.log('')
      console.log(pc.yellow('Generating the `/src/component-list.ts` file now; you'))
      console.log(pc.yellow('will need to verify no components were unintentionally deleted.'))
      updateComponentList(false)
      return []
    }
    const { default: existingComponents } = await import(path.resolve(tokenListPath))
    const { default: generatedComponents } = await import(path.resolve('./src/temp-generated-component-list.ts'))
    const deletedComponents = existingComponents.filter((component: string) => generatedComponents.indexOf(component) === -1)

    return deletedComponents
  } catch (err: any) {
    console.error(pc.red('An error occurred while attempting to check for deleted components: '), err)
    console.log('')
    process.exit(1)
  }
}

/**
 * Store a list of the components that were generated
 */
export const updateComponentList = async (displayHeader: boolean = true) => {
  try {
    const componentsPath = path.resolve('./src/components')
    if (!fs.existsSync(componentsPath)) {
      console.error(pc.red('You must run `pnpm generate` before updating the component list.'))
      console.log('')
      process.exit(1)
    }

    // Only display the command header if called standalone
    if (displayHeader) {
      console.log('')
      console.log(pc.cyan(pc.bold(`${emoji('sparkles')} Kong Icons ${emoji('sparkles')}`)))
      console.log('')
      console.log('Updating `/src/component-list.ts`...')
    }

    const allComponents = getAllFiles(componentsPath, 'vue')
    const uniqueComponentNames = new Set<string>()

    // Loop through component list
    for (const component of allComponents) {
      const name = basename(component)
      uniqueComponentNames.add(name)
    }

    storeComponentList({
      components: Array.from(uniqueComponentNames),
      update: true,
    })
    console.log('')
  } catch (err: any) {
    console.error(pc.red('An error occurred while attempting to store the component list: '), err)
    console.log('')
    process.exit(1)
  }
}
