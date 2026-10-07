'use client'

import {useState} from 'react'
import {stegaClean} from 'next-sanity'

type Props = {videoId: string; title: string; poster: string; portrait: boolean}

/** Shows a poster with a play button; loads the YouTube iframe only on click. */
export function VideoPlayer({videoId, title, poster, portrait}: Props) {
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  return (
    <div
      className={`relative overflow-hidden ${
        portrait ? 'mx-auto aspect-[9/16] w-full max-w-md' : 'aspect-video w-full'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube/Sanity poster */}
      <img
        src={poster}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none"
          aria-label={`Play video: ${stegaClean(title)}`}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <svg
              className="h-16 w-16 rounded-full bg-black/40 p-2 text-white drop-shadow-md backdrop-blur-md transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      ) : (
        <>
          {loading && <div className="absolute inset-0 bg-black/50" role="status" aria-label="Loading video" />}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setLoading(false)}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </>
      )}
    </div>
  )
}
