export default {
  test: (val) => !!val, // && val.tagName === 'svg',
  print: (val, serialize) => {
    const clone = val.cloneNode(true)
    const attributesToIgnore = ['id', 'url']

    // Replace 'id' attributes with a placeholder
    attributesToIgnore.forEach(attr => {
      const elements = clone.querySelectorAll(`[${attr}]`)
      elements.forEach((el: HTMLElement) => {
        const attrValue = el.getAttribute(attr)
        el.setAttribute(attr, 'ANY_STRING') // Replace with a placeholder

        // If the attribute is 'url', modify its content
        if (attr === 'url') {
          const pattern = new RegExp(`url$begin:math:text$#${attrValue}\\$end:math:text$`, 'g')
          clone.innerHTML = clone.innerHTML.replace(pattern, 'url(#ANY_STRING)')
        }
      })
    })

    return serialize(clone)
  },
}
