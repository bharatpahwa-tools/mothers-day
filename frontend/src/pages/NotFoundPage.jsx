import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6 text-center">
      <div>
        <div className="font-cormorant text-7xl text-[#E07A5F]">404</div>
        <p className="mt-3 text-[#2C362B]/70">
          This card doesn&apos;t exist or was removed.
        </p>
        <Link to="/">
          <Button
            data-testid="not-found-home-btn"
            className="mt-6 rounded-full bg-[#E07A5F] px-6 text-white hover:bg-[#d06a4f]"
          >
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
