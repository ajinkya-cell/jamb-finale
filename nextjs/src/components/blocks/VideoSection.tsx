import {urlFor} from '@/sanity/image'
import {toneClass} from '@/lib/tone'
import {VideoPlayer} from '../VideoPlayer'
import type {VideoSectionBlock} from '@/sanity/types-helpers'

function parseYouTube(url: string) {
  const match = url.match(/(?:shorts\/|embed\/|watch\?v=|youtu\.be\/)([\w-]{6,})/)
  return {id: match?.[1], isShort: url.includes('/shorts/')}
}

export function VideoSection({block}: {block: VideoSectionBlock}) {
  const {id, isShort} = parseYouTube(block.url)
  if (!id) return null
  const poster = block.poster?.asset
    ? urlFor(block.poster).width(900).url()
    : `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

  return (
    <section className={toneClass(block.tone)}>
      <div className="page-container py-[76px]">
        <div className="mx-auto max-w-full">
          <VideoPlayer videoId={id} title={block.title} poster={poster} portrait={isShort} />
        </div>
      </div>
    </section>
  )
}
