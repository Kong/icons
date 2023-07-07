import { COMPONENT_FILE_HEADER, kebabCase, pascalCase } from './index.js'
import fs from 'fs'
import { load } from 'cheerio'

export default function createComponentFromSvg(svgFileName) {
  let svgFile, componentTemplate
  // Get the SVG source file
  try {
    svgFile = fs.readFileSync(`svg/${svgFileName}`, 'utf8')
  } catch (err) {
    console.log('TODO: Add error messaging 1')
    return
  }

  // The kebab-case name of the svg
  const name = kebabCase(svgFileName).replace(/\.svg/, '')
  // The PascalCase component name, without the extension
  const componentName = `${pascalCase(name).replace(/icon/gi, '').replace(/\.vue$/gi, '')}Icon`
  // Convert the name to pascal case, ensure the string `Icon.vue` is at the end of the component name
  const componentFilenameWithExtension = `${componentName}.vue`

  const $ = load(svgFile, {
    xmlMode: true,
  })

  const svgPathDefinition = $('path')?.attr('d') || ''

  try {
    // Import the component template and replace placeholder strings
    componentTemplate = fs.readFileSync('src/utilities/ComponentTemplate.vue', 'utf8')
      .replace(/\/\*\* {%%KONG_ICONS_COMPONENT_FILE_HEADER%%} \*\//g, COMPONENT_FILE_HEADER)
      .replace(/{%%KONG_ICONS_SVG_PATH%%}/g, svgPathDefinition)
  } catch (err) {
    console.log('TODO: Add error messaging 2')
    return
  }

  try {
    // Write the template to the file
    fs.writeFileSync(`src/components/${componentFilenameWithExtension}`, componentTemplate, 'utf8')
  } catch (err) {
    console.log('TODO: Add error messaging 3')
  }

  try {
    // Add the component export to the `/src/components/index.ts` file
    fs.appendFileSync('src/components/index.ts', `export { default as ${componentName} } from './${componentFilenameWithExtension}'\n`)
  } catch (err) {
    console.log('TODO: Add error messaging 4')
    // eslint-disable-next-line no-useless-return
    return

  }
}
