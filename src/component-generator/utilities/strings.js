/**
 * @description Capitalize a string.
 * @param {string} str
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @description Checks whether the given string has symbols.
 * @param {string} str
 */
function hasSymbols(str) {
  return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(str) // without " ", "$", "-" and "_"
}

/**
 * @description Convert text to PascalCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
export function pascalCase(str) {
  return capitalize(camelCase(kebabCase(str)))
}

/**
 * @description Convert text to camelCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
export function camelCase(str) {
  if (isPascalCase(str)) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
  return str.replace(/[-_](\w)/gu, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * @description Checks whether the given string is PascalCase.
 * @param {string} str
 */
export function isPascalCase(str) {
  if (
    hasSymbols(str) ||
    /^[a-z]/u.exec(str) ||
    /-|_|\s/u.exec(str) // kebab or snake or space
  ) {
    return false
  }
  return true
}

/**
 * @description Transform a given string into a lowercase, kebab-case version of the string.
 * @param {string} str - The string to kebab-case.
 * @return {string} Lowercase and kebab-case version of the input string.
 */
export function kebabCase(str = '') {
  if (!str || str.trim() === '') {
    return ''
  }

  return str.trim().replace(/ /g, '-').replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()).replace(/--+/g, '-').replace(/-+$/g, '')
}
