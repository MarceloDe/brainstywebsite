import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const pillars = [
  {
    title: 'Know Your Real Cost',
    description:
      "Don't pay for estimates. Brainsty queries 5 billion+ actual negotiated rates from hospital transparency data to show what procedures REALLY cost on your plan — and tells you when cash-pay is cheaper.",
    imageId: 'mission-translate',
  },
  {
    title: 'Stop Surprise Bills',
    description:
      'Brainsty monitors every bill against your plan terms and actual negotiated rates. Unfair charges get flagged and disputes get built automatically — even before the bill reaches your mailbox.',
    imageId: 'mission-integrate',
  },
  {
    title: 'Optimize Your Benefits',
    description:
      'Your always-on agent inspects your plan, tracks your deductible progress, alerts you to benefit opportunities, and gives you data-backed talking points for employer benefit negotiations.',
    imageId: 'mission-delivery',
  },
];

export default function MissionSection() {
  return (
    <section id="how-it-works" className="py-[80px] bg-canvas">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[48px] font-bold font-display text-ink leading-[1.1]">
            How It Works
          </h2>
          <p className="mt-4 text-[18px] font-light text-body leading-[1.55]">
            Empowering you with the intelligence needed to navigate the healthcare financial system.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === pillar.imageId
            );
            return (
              <div
                key={pillar.title}
                className="flex flex-col group bg-canvas"
              >
                {image && (
                  <div className="relative h-[240px] w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )}
                <div className="p-[24px] flex flex-col flex-grow">
                  <h3 className="font-display text-[18px] font-bold text-ink leading-[1.4]">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-[16px] font-light text-body leading-[1.55]">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
