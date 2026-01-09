"use client";

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { curateResearchPapers } from '@/ai/flows/curate-research-papers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BrainstyLogo } from '@/components/shared/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ResearchClient() {
  const { isLoggedIn } = useAuth();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearch = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!query.trim()) {
      setError('Please enter a topic to research.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await curateResearchPapers({ query });
      setResult(response.summary);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching research. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Curated Research</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter a medical topic, and our AI will summarize relevant scientific papers into an easy-to-understand explanation.
        </p>
      </div>

      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="e.g., 'Latest treatments for migraines'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="text-base"
          aria-label="Research Topic"
        />
        <Button onClick={handleSearch} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5 mr-2 hidden md:inline-block" />
              Search
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/>
            <p className="text-muted-foreground mt-2">Curating research...</p>
        </div>
      )}

      {result && (
        <Card className="mt-8">
            <CardHeader className="flex-row items-center gap-3">
                <BrainstyLogo className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold font-headline">Research Summary</h2>
            </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground font-body">
              {result.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
