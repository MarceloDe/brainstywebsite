import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
                <CardDescription>Join Brainsty and take control of your health journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />
                 <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/login">Log in</Link>
                    </Button>
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
