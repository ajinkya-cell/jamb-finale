import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {toneField} from '../shared/toneField'

const YOUTUBE_URL = /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/

export const videoSectionType = defineType({
  name: 'videoSection',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Describes the video for screen readers. Not shown on the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'A video or Short, e.g. https://youtube.com/shorts/…',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['https']})
          .custom((value) =>
            !value || YOUTUBE_URL.test(value) ? true : 'Must be a YouTube video or Short URL',
          ),
    }),
    defineField({
      name: 'poster',
      type: 'imageWithAlt',
      description: 'Optional cover image. Defaults to the YouTube thumbnail.',
    }),
    toneField,
  ],
  preview: {
    select: {title: 'title', url: 'url', media: 'poster'},
    prepare({title, url, media}) {
      return {title: title || 'Video', subtitle: url ? `Video · ${url}` : 'Video', media: media ?? PlayIcon}
    },
  },
})
