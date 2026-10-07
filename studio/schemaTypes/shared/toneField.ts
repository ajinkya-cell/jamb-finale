import {defineField} from 'sanity'

/**
 * Semantic section tone. The frontend maps each value to a design token
 * (warm #f3f0ed, grey #e3e3e3, taupe #dfdad7) so editors pick from the
 * brand palette instead of entering arbitrary colours.
 */
export const toneField = defineField({
  name: 'tone',
  title: 'Section tone',
  type: 'string',
  options: {
    list: [
      {title: 'Warm', value: 'warm'},
      {title: 'Grey', value: 'grey'},
      {title: 'Taupe', value: 'taupe'},
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'warm',
})
