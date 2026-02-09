import fs from 'fs'
import path from 'path'
import pc from 'picocolors'
import { load } from 'cheerio'
import { optimize } from 'svgo'
import { COMPONENT_FILE_HEADER, kebabCase, pascalCase, capitalize, getIconType } from './index'

export default function createComponentFromSvg(pathToSvg: string, svgFileName: string): string {
  let svgFile: string
  let componentTemplate: string

  // Get the SVG source file
  try {
    svgFile = fs.readFileSync(path.resolve(pathToSvg), 'utf8')

    // Optimize the SVG with SVGO
    const optimizedSvg = optimize(svgFile, {
      multipass: true,
      plugins: [
        'preset-default',
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeEditorsNSData',
        'cleanupAttrs',
        'mergeStyles',
        'inlineStyles',
        'minifyStyles',
        'cleanupIds',
        'removeUselessDefs',
        'cleanupNumericValues',
        'convertColors',
        'removeUnknownsAndDefaults',
        'removeNonInheritableGroupAttrs',
        'removeUselessStrokeAndFill',
        'removeViewBox',
        'cleanupEnableBackground',
        'removeHiddenElems',
        'removeEmptyText',
        'convertShapeToPath',
        'convertEllipseToCircle',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'collapseGroups',
        'convertPathData',
        'convertTransform',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'mergePaths',
        'removeUnusedNS',
        'sortAttrs',
        'sortDefsChildren',
        'removeTitle',
        'removeDesc',
      ],
    })

    svgFile = optimizedSvg.data
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could not read the svg source file'), err)
    console.log('')
    process.exit(1)
  }

  // Determine the top-level subdirectory within `/svg/`
  const iconSubdirectory = getIconType(pathToSvg)

  // The lowercase, kebab-case name of the svg, e.g. `add-icon`
  const name = kebabCase(`${iconSubdirectory === 'flags' ? 'Flag' : ''}${capitalize(svgFileName).replace(/([a-zA-Z]+)icon/gi, '$1')}Icon`).replace(/\.svg/, '')
  // The PascalCase component name, without the extension, e.g. `AddIcon`
  const componentName = `${pascalCase(name).replace(/\.vue$/gi, '')}`
  // Convert the name to pascal case, ensure the string `Icon.vue` is at the end of the component name
  const componentFilenameWithExtension = `${componentName}.vue`

  // Load the SVG file as XML
  const $cheerio = load(svgFile, {
    xml: true,
  })

  // If a `/svg/solid/` icon, modify element attributes as needed to standardize
  if (iconSubdirectory === 'solid') {
    const path = $cheerio('path')
    if (path.attr('fill')) {
      path?.attr('fill', 'currentColor')
    }
    if (path.attr('stroke')) {
      path?.attr('stroke', 'currentColor')
    }
    // Add animation for ProgressIcon
    if (name === 'progress-icon') {
      // Add spin style
      path.attr('style', 'transform-origin: 50% 50%; animation: kong-icon-spin 1.5s linear infinite;')
      $cheerio('svg').prepend('<style>@keyframes kong-icon-spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }</style>')
    }
  }

  // Get the innerHTML of the <svg> element, stripping any leading or trailing newlines
  const svgInnerHtml = String($cheerio('svg').html() || '').replace(/^\n+|\n+$/g, '')

  // Import the component template
  try {
    // Replace placeholder strings in component template
    componentTemplate = fs.readFileSync(path.resolve('./src/__template__/ComponentTemplate.vue'), 'utf8')
      // Replace the file header first so it can be parsed by other replacements
      .replace(/\/\*\* {%%ICON_COMPONENT_FILE_HEADER%%} \*\//g, COMPONENT_FILE_HEADER)
      .replace(/{%%ICON_SVG_INNER_HTML%%}/g, svgInnerHtml)
      .replace(/{%%KONG_COMPONENT_ICON_CLASS%%}/g, name)
      .replace(/{%%KONG_GENERATED_FILENAME%%}/g, componentFilenameWithExtension)
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could not import and parse the component templates'), err)
    console.log('')
    process.exit(1)
  }

  // Write the Vue template to the component file
  try {
    fs.writeFileSync(path.resolve(`./src/components/${iconSubdirectory}/${componentFilenameWithExtension}`), componentTemplate, 'utf8')
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could not write the component to the new .vue file'), err)
    console.log('')
    process.exit(1)
  }

  try {
    // Add the component export to the `/src/components/index.ts` file
    fs.appendFileSync(path.resolve(`./src/components/${iconSubdirectory}/index.ts`), `export { default as ${componentName} } from './${componentFilenameWithExtension}'\n`)
  } catch (err: any) {
    console.log(pc.red('createComponentFromSvg: could add the component export to `/src/components/index.ts`'), err)
    console.log('')
    process.exit(1)
  }

  // If everything is successful, return the generated component name
  return componentFilenameWithExtension
}
