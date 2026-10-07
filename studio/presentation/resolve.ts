import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

const HOME = {title: 'Home', href: '/'}

/** The front end currently renders a single route, so every site-wide document lives on Home. */
const onHome = defineLocations({locations: [HOME]})

export const resolve: PresentationPluginOptions['resolve'] = {
  // Opening "/" in the preview opens the home page document beside it.
  mainDocuments: defineDocuments([{route: '/', filter: `_id == "homePage"`}]),
  // "Used on" badges in the document editor.
  locations: {
    homePage: onHome,
    navigation: onHome,
    footer: onHome,
    settings: onHome,
  },
}
