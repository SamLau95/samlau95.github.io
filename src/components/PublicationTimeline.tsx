type PaperLink = {
  name: string;
  url: string;
};

export type Paper = {
  id: string;
  order: number;
  year: number;
  title: string;
  authors: string;
  venue: string;
  award?: string;
  blurb: string;
  type: string;
  pdf: string;
  links?: PaperLink[];
};

function shortVenue(venue: string) {
  return venue.match(/\(([^()]*)\)$/)?.[1] ?? venue;
}

type TimelineEntry = {
  year: number;
  title: string;
  authors: string;
  venue: string;
  award?: string;
  description: string;
  type: string;
  pdf: string;
  links?: PaperLink[];
  fullVenue?: string;
};

type PublicationTimelineProps = {
  papers: Paper[];
};

// Renders the vertical gray timeline
function TimelineRail() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-stone-300 before:absolute before:top-0 before:h-6 before:w-px before:bg-linear-to-t before:from-transparent before:to-offwhite before:content-[''] after:absolute after:bottom-0 after:h-6 after:w-px after:bg-linear-to-b after:from-transparent after:to-offwhite after:content-['']"
    />
  );
}

// Renders a bullet on the timeline
function TimelineBullet() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 z-10 mt-4 size-2 -translate-x-1/2 rounded-sm bg-offblack outline-2 outline-offwhite"
    />
  );
}

export default function PublicationTimeline({ papers }: PublicationTimelineProps) {
  const entries: TimelineEntry[] = papers.map((paper) => ({
    year: paper.year,
    title: paper.title,
    authors: paper.authors,
    venue: shortVenue(paper.venue),
    fullVenue: paper.venue,
    award: paper.award,
    description: paper.blurb,
    type: paper.type,
    pdf: paper.pdf,
    links: paper.links,
  }));

  return (
    <section aria-label="Publications">
      <div className="py-1">
        <ol className="relative grid list-none gap-y-4">
          <TimelineRail />
          {entries.map((entry, index) => (
            <li className="relative pl-4" key={entry.title}>
              {entry.year !== entries[index - 1]?.year && (
                <time
                  className="absolute top-3 right-full mr-3 hidden text-xs font-medium text-stone-500 tabular-nums lg:block"
                  dateTime={entry.year.toString()}
                >
                  {entry.year}
                </time>
              )}
              <TimelineBullet />
              <article className="min-w-0 border border-offblack bg-offwhite p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <h3 className="text-xs leading-snug font-bold text-offblack">
                    <a
                      className="underline decoration-offblack/30 transition-colors hover:decoration-offblack hover:decoration-2"
                      href={entry.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.title}
                    </a>
                  </h3>
                  <span className="hidden text-right text-xs text-stone-500 sm:inline">
                    {entry.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-600">{entry.authors}</p>
                <p className="mt-1 text-xs text-stone-600 italic">
                  <span title={entry.fullVenue}>{entry.venue}</span>{" "}
                  <time className="tabular-nums" dateTime={entry.year.toString()}>
                    {entry.year}
                  </time>
                </p>
                {entry.award && (
                  <p className="mt-1 text-xs font-bold text-red-800">{entry.award}</p>
                )}
                <p className="mt-1 text-xs text-stone-500 sm:hidden">{entry.type}</p>
                <p className="mt-3 text-xs text-stone-600">{entry.description}</p>
                <p className="mt-3 text-xs text-stone-600">
                  <a
                    className="underline decoration-offblack/30 transition-colors hover:decoration-offblack hover:decoration-2"
                    href={entry.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [PDF]
                  </a>
                  {entry.links?.map((link) => (
                    <span key={`${link.name}-${link.url}`}>
                      {" "}
                      <a
                        className="underline decoration-offblack/30 transition-colors hover:decoration-offblack hover:decoration-2"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        [{link.name}]
                      </a>
                    </span>
                  ))}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
