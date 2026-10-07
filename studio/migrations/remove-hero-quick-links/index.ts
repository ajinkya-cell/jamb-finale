import {at, defineMigration, unset} from 'sanity/migrate'

/**
 * Removes `quickLinks` from hero sections. The field was copied from Jamb's
 * own schema but is never rendered, so it was dropped from the content model.
 *
 *   npx sanity migration run remove-hero-quick-links            (dry run)
 *   npx sanity migration run remove-hero-quick-links --no-dry-run
 */
export default defineMigration({
  title: 'Remove unused hero quickLinks',
  documentTypes: ['homePage', 'page'],
  filter: 'count(pageBuilder[_type == "heroSection" && defined(quickLinks)]) > 0',
  migrate: {
    // Patches returned from a node handler are applied relative to that node.
    object(node) {
      if (node._type === 'heroSection' && 'quickLinks' in node) {
        return at('quickLinks', unset())
      }
    },
  },
})
