import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-headline">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Empowering you with the intelligence needed to navigate the healthcare financial system.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === pillar.imageId
            );
            return (
              <Card
                key={pillar.title}
                className="overflow-hidden flex flex-col group"
              >
                {image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    {pillar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
