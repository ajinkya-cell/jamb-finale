import type {PortableTextBlock} from 'next-sanity'
import {getSite} from '@/sanity/fetch'
import {RichText} from '../RichText'
import {SanityLink} from '../SanityLink'
import {NewsletterForm} from './NewsletterForm'
import {SocialIcon} from './SocialIcon'

export async function Footer() {
  const {settings, footer} = await getSite()

  return (
    <footer className="w-full">
      <section className="bg-stone py-8">
        <div className="page-container px-5">
          <div className="mb-7 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="col-span-2 grid grid-cols-1 gap-6 font-medium text-ash md:grid-cols-2 lg:gap-10">
              <div className="text-base leading-6">
                {settings?.phone && <p className="mb-0">Tel: {settings.phone}</p>}
                {settings?.address?.split('\n').map((line) => (
                  <p key={line} className="mb-0">
                    {line}
                  </p>
                ))}
              </div>
              <div className="text-base leading-6">
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="mb-3 block transition-colors hover:text-slate">
                    {settings.email}
                  </a>
                )}
                <div className="flex gap-4">
                  {settings?.socialLinks?.map((social) => (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="capitalize transition-colors hover:text-black"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="hidden md:block" />
            {footer?.newsletter && (
              <div className="col-span-2 w-full max-w-xl">
                <NewsletterForm
                  heading={footer.newsletter.heading}
                  body={footer.newsletter.body}
                  buttonLabel={footer.newsletter.buttonLabel}
                  consent={<RichText value={footer.newsletter.consent as PortableTextBlock[]} />}
                />
              </div>
            )}
          </div>

          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
              {footer?.columns?.map((column) => (
                <div key={column._key}>
                  {column.groups?.map((group) => (
                    <div key={group._key} className="mb-10 border-t border-gray-400 pt-[14px] last:mb-0">
                      {group.heading && (
                        <SanityLink
                          link={group.headingLink}
                          className="mb-1 block text-base leading-8 font-medium text-black underline-offset-2 transition-colors hover:underline"
                        >
                          {group.heading}
                        </SanityLink>
                      )}
                      <ul className="space-y-1">
                        {group.links?.map((cta) => (
                          <li key={cta._key}>
                            <SanityLink
                              link={cta.link}
                              className="text-base leading-8 font-medium text-ash transition-colors hover:text-black"
                            >
                              {cta.label}
                            </SanityLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </section>
    </footer>
  )
}
