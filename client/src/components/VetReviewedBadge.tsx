import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  reviewer: string;
  className?: string;
}

export function VetReviewedBadge({ reviewer, className }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="default"
          className={`bg-emerald-600 hover:bg-emerald-600 text-white ${className ?? ""}`}
          data-testid="badge-vet-reviewed"
        >
          <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Vet Reviewed
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        Reviewed by {reviewer} for medical and care accuracy.
      </TooltipContent>
    </Tooltip>
  );
}
