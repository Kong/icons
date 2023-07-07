import fs from 'fs'
import path from 'path'
import { load } from 'cheerio'
import { COMPONENT_FILE_HEADER, kebabCase, pascalCase } from './index.js'

export default function createComponentFromSvg(svgFileName) {
  let svgFile, componentTemplate
  // Get the SVG source file
  try {
    svgFile = fs.readFileSync(path.resolve(`./svg/${svgFileName}`), 'utf8')
  } catch (err) {
    console.log('TODO: Add error messaging 1')
    return
  }

  // The kebab-case name of the svg
  const name = kebabCase(`${svgFileName.replace(/icon/gi, '')}Icon`).replace(/\.svg/, '')
  // The PascalCase component name, without the extension
  const componentName = `${pascalCase(name).replace(/\.vue$/gi, '')}`
  // Convert the name to pascal case, ensure the string `Icon.vue` is at the end of the component name
  const componentFilenameWithExtension = `${componentName}.vue`

  const cheerio = load(svgFile, {
    xmlMode: true,
  })

  const svgPathDefinition = cheerio('path')?.attr('d') || ''

  try {
    // Import the component template and replace placeholder strings
    componentTemplate = fs.readFileSync(path.resolve('./src/component-generator/utilities/__template__/ComponentTemplate.vue'), 'utf8')
      .replace(/\/\*\* {%%ICON_COMPONENT_FILE_HEADER%%} \*\//g, COMPONENT_FILE_HEADER)
      .replace(/{%%ICON_SVG_PATH%%}/g, svgPathDefinition)
      .replace(/{%%KONG_COMPONENT_ICON_CLASS%%}/g, name)
  } catch (err) {
    console.log('TODO: Add error messaging 2')
    return
  }

  try {
    // Write the template to the file
    fs.writeFileSync(path.resolve(`./src/components/${componentFilenameWithExtension}`), componentTemplate, 'utf8')
  } catch (err) {
    console.log('TODO: Add error messaging 3')
  }

  try {
    // Add the component export to the `/src/components/index.ts` file
    fs.appendFileSync(path.resolve('./src/components/index.ts'), `export { default as ${componentName} } from './${componentFilenameWithExtension}'\n`)
  } catch (err) {
    console.log('TODO: Add error messaging 4')
    // eslint-disable-next-line no-useless-return
    return
  }
}
