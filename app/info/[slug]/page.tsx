import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { infoPages } from '@/lib/pages';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return Object.keys(infoPages).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Props): Metadata {
  const page = infoPages[params.slug];
  return page ? { title: page.title, description: page.description } : {};
}

export default function InfoPage({ params }: Props) {
  const page = infoPages[params.slug];
  if (!page) notFound();

  return (
    <article className="container prose">
      <h1 className="display">{page.title}</h1>
      {page.sections.map((s, i) => (
        <section key={i}>
          {s.heading && <h2>{s.heading}</h2>}
          {s.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
