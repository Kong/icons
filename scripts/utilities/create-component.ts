import fs from 'fs'
import path from 'path'
import { load } from 'cheerio'
import pc from 'picocolors'
import { COMPONENT_FILE_HEADER, kebabCase, pascalCase } from './index'

export default function createComponentFromSvg(pathToSvg: string, svgFileName: string): void {
  // @ts-ignore
  let svgFile: string, componentTemplate: string

  // Get the SVG source file
  try {
    svgFile = fs.readFileSync(path.resolve(pathToSvg), 'utf8')
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could not read the svg source file'), err)
    console.log('')
    process.exit(1)
  }

  // The lowercase, kebab-case name of the svg
  const name = kebabCase(`${svgFileName.replace(/([a-zA-Z]+)icon/gi, '$1')}Icon`).replace(/\.svg/, '')
  // The PascalCase component name, without the extension
  const componentName = `${pascalCase(name).replace(/\.vue$/gi, '')}`
  // Convert the name to pascal case, ensure the string `Icon.vue` is at the end of the component name
  const componentFilenameWithExtension = `${componentName}.vue`

  // Load the svg file as XML
  const $cheerio = load(svgFile, {
    xmlMode: true,
  })

  // If the svg is within the `/svg/solid/` directory, replace attribute values as needed to standardize
  const solidIconsDirectory = path.relative(path.resolve('./svg/solid'), pathToSvg)
  const isSolidIcon: boolean = !!solidIconsDirectory && !solidIconsDirectory.startsWith('..') && !path.isAbsolute(solidIconsDirectory)

  // If a `/svg/solid/` icon, modify element attributes
  if (isSolidIcon) {
    const path = $cheerio('path')
    if (path.attr('fill')) {
      path?.attr('fill', 'currentColor')
    }
    if (path.attr('stroke')) {
      path?.attr('stroke', 'currentColor')
    }
  }

  // Get the innerHTML of the <svg> element, stripping any leading or trailing newlines
  const svgInnerHtml = String($cheerio('svg').html() || '').replace(/^\n+|\n+$/g, '')

  try {
    // Import the component template and replace placeholder strings
    componentTemplate = fs.readFileSync(path.resolve('./src/__template__/ComponentTemplate.vue'), 'utf8')
      .replace(/\/\*\* {%%ICON_COMPONENT_FILE_HEADER%%} \*\//g, COMPONENT_FILE_HEADER)
      .replace(/{%%ICON_SVG_INNER_HTML%%}/g, svgInnerHtml)
      .replace(/{%%KONG_COMPONENT_ICON_CLASS%%}/g, name)
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could not import and parse the component template'), err)
    console.log('')
    process.exit(1)
  }

  try {
    // Write the template to the file
    fs.writeFileSync(path.resolve(`./src/components/${componentFilenameWithExtension}`), componentTemplate, 'utf8')
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could not write the component to the new .vue file'), err)
    console.log('')
    process.exit(1)
  }

  try {
    // Add the component export to the `/src/components/index.ts` file
    fs.appendFileSync(path.resolve('./src/components/index.ts'), `export { default as ${componentName} } from './${componentFilenameWithExtension}'\n`)
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could add the component export to `/src/components/index.ts`'), err)
    console.log('')
    process.exit(1)
  }
}
