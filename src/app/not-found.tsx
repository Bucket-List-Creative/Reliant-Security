import { NotFoundContent } from "@/components/sections/NotFoundContent";

// Fallback 404 for routes outside the (site) group. Uses the root layout only,
// so it centers the branded card on the surface with no nav/footer.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <NotFoundContent />
    </div>
  );
}
