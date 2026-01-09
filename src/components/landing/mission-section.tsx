import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const pillars = [
  {
    title: 'Translate',
    description:
      'We translate complex, evidence-based research into useful, understandable knowledge for the average person.',
    imageId: 'mission-translate',
  },
  {
    title: 'Integrate',
    description:
      'We integrate modern technology (like AI, wearables, and apps) to build sustainable and engaging health and wellness solutions.',
    imageId: 'mission-integrate-new',
  },
  {
    title: 'Delivery',
    description:
      'We deliver reliable, personalized knowledge that empowers users to make informed health decisions.',
    imageId: 'mission-delivery',
  },
];

export default function MissionSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Our Mission, Your Empowerment
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are founded on three core principles to guide you through the
            complexities of healthcare.
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
