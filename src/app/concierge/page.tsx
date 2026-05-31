import ConciergeExperience from "@/components/concierge/experience";
import ProtectedRoute from "@/components/auth/protected-route";

export default function ConciergePage() {
    return (
        <ProtectedRoute>
            <ConciergeExperience />
        </ProtectedRoute>
    );
}
