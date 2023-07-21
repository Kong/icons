/**
 * @description Capitalize a string.
 * @param {string} str
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @description Checks whether the given string has symbols.
 * @param {string} str
 */
function hasSymbols(str: string) {
  return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(str) // without " ", "$", "-" and "_"
}

/**
 * @description Convert text to PascalCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
export const pascalCase = (str: string): string => {
  return capitalize(camelCase(str))
}

/**
 * @description Convert text to camelCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
export const camelCase = (str: string): string => {
  const modifiedInputString = kebabCase(str)
  if (isPascalCase(modifiedInputString)) {
    return modifiedInputString.charAt(0).toLowerCase() + modifiedInputString.slice(1)
  }
  return modifiedInputString.replace(/[-_](\w)/gu, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * @description Checks whether the given string is PascalCase.
 * @param {string} str
 */
export const isPascalCase = (str: string): boolean => {
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
export const kebabCase = (str: string = ''): string => {
  if (!str || str.trim() === '') {
    return ''
  }

  return str.trim().replace(/ /g, '-').replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()).replace(/--+/g, '-').replace(/-+$/g, '')
}
