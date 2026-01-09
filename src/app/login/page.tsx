import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
                <CardDescription>Log in to access your Health Navigator.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/signup">Sign up</Link>
                    </Button>
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
