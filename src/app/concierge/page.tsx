import ConciergeClient from "@/components/concierge/concierge-client";
import ProtectedRoute from "@/components/auth/protected-route";

export default function ConciergePage() {
    return (
        <ProtectedRoute>
            <ConciergeClient />
        </ProtectedRoute>
    );
}
