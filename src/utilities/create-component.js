import { COMPONENT_FILE_HEADER, pascalCase } from './index.js'
import fs from 'fs'
import { load } from 'cheerio'

export default function createIconComponent(svgFileName) {
  let svgFile, componentTemplate
  // Get the SVG source file
  try {
    svgFile = fs.readFileSync(`svg/${svgFileName}`, 'utf8')
  } catch (err) {
    console.log('TODO: Add error messaging 1')
    return
  }
  const name = svgFileName.toLowerCase().replace(/\.svg/, '').replace(' ', '-')
  // Convert the name to pascal case, ensure the string `Icon.vue` is at the end of the component name
  const componentFileName = `${pascalCase(name).replace(/icon/gi, '').replace(/\.vue$/gi, '')}Icon.vue`

  const $ = load(svgFile, {
    xmlMode: true,
  })

  const svgPathDefinition = $('path')?.attr('d') || ''

  try {
    // Import the component template and replace placeholder strings
    componentTemplate = fs.readFileSync('src/utilities/ComponentTemplate.vue', 'utf8')
      .replace(/{%%KONG_ICONS_COMPONENT_FILE_HEADER%%}/g, COMPONENT_FILE_HEADER)
      .replace(/{%%KONG_ICONS_SVG_PATH%%}/g, svgPathDefinition)
  } catch (err) {
    console.log('TODO: Add error messaging 2')
    return
  }

  try {
    // Write the template to the file
    fs.writeFileSync(`src/components/${componentFileName}`, componentTemplate, 'utf8')
  } catch (err) {
    console.log('TODO: Add error messaging 3')
    // eslint-disable-next-line no-useless-return
    return
  }
}
