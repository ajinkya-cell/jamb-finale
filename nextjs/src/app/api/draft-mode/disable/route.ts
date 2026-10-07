import {draftMode} from 'next/headers'
import {type NextRequest, NextResponse} from 'next/server'

/** Leaves preview mode and returns to the published site. */
export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL('/', request.url))
}
