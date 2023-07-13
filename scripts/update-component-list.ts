import { getAllFiles, storeComponentList } from './utilities'
import path, { basename } from 'path'
import pc from 'picocolors'

/**
 * Store a list of the components that were generated
 */
try {
  const allComponents = getAllFiles(path.resolve('./src/components'), 'vue')
  const uniqueComponentNames = new Set<string>()

  // Loop through component list
  for (const component of allComponents) {
    const name = basename(component)
    uniqueComponentNames.add(name)
  }

  storeComponentList({
    components: Array.from(uniqueComponentNames),
    save: true,
  })

} catch (err: any) {
  console.error(pc.red('An error occurred while attempting to store the component list: '), err)
  console.log('')
  process.exit(1)
}
