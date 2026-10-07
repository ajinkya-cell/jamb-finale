import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {BlockContentIcon} from '@sanity/icons/BlockContent'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {MenuIcon} from '@sanity/icons/Menu'
import {BasketIcon} from '@sanity/icons/Basket'
import {SINGLETON_TYPES} from '../schemaTypes'

function singleton(S: StructureBuilder, typeName: string, title: string, icon: ComponentType) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'homePage', 'Home page', HomeIcon),
      S.divider(),
      singleton(S, 'navigation', 'Header navigation', MenuIcon),
      singleton(S, 'footer', 'Footer', BlockContentIcon),
      singleton(S, 'settings', 'Site settings', CogIcon),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.listItem()
        .title('Catalogue')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Catalogue')
            .items([
              S.documentTypeListItem('product').title('Products'),
              S.documentTypeListItem('category').title('Categories'),
            ]),
        ),
      // Anything added to the schema later shows up here automatically.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return !!id && !SINGLETON_TYPES.has(id) && !['page', 'product', 'category'].includes(id)
      }),
    ])
