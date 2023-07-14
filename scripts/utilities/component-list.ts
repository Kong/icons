import fs from 'fs'
import path from 'path'
import pc from 'picocolors'
import { COMPONENT_LIST_FILE_HEADER, TS_FILE_HEADER } from './index'

interface StoreComponentListOptions {
  /** The array of components to store */
  components: string[]
  /** Are we updating the exported component list (only on release)? */
  update?: boolean
}

export const storeComponentList = ({
  components,
  update = false,
}: StoreComponentListOptions) => {
  try {
    components.sort()
    const componentsArray = components.map(component => `  '${component}',`)
    const filepath = update ? path.resolve('./src/component-list.ts') : path.resolve('./src/generated-component-list.ts')

    // Inject the generated array of component names into the `/src/component-list.ts` file
    fs.writeFileSync(filepath, `${update ? COMPONENT_LIST_FILE_HEADER : TS_FILE_HEADER}\nexport default [\n${componentsArray.join('\n')}\n]\n`, 'utf8')
  } catch (err: any) {
    console.error(pc.red('An error occurred while attempting to store the component list: '), err)
    console.log('')
    process.exit(1)
  }
}

export const getDeletedComponentList = async (): Promise<string[]> => {
  try {
    const tokenListPath = './src/component-list.ts'
    if (!fs.existsSync(tokenListPath)) {
      console.log('')
      console.log(pc.yellow('The `/src/component-list.ts` file does not exist.'))
      console.log(pc.yellow('Cannot detect missing components.'))
      console.log('')
      console.log(pc.yellow('After this generate command completes, please run:'))
      console.log(pc.yellow('$ yarn update:component-list'))
      console.log('')
      return []
    }
    const { default: existingComponents } = await import(path.resolve(tokenListPath))
    const { default: generatedComponents } = await import(path.resolve('./src/generated-component-list.ts'))
    const deletedComponents = existingComponents.filter((component: string) => generatedComponents.indexOf(component) === -1)

    return deletedComponents
  } catch (err: any) {
    console.error(pc.red('An error occurred while attempting to check for deleted components: '), err)
    console.log('')
    process.exit(1)
  }
}
