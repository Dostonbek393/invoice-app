import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardSkeleton({ length = 7 }) {
  return (
    <div className="flex flex-col gap-4 base-container">
      {Array(length)
        .fill(0)
        .map((_, index) => {
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <Skeleton className="w-[72px] h-4 rounded-md bg-slate-300" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="w-[109px] h-5 rounded-md bg-slate-300" />
                  </CardDescription>
                  <span>
                    <Skeleton className="w-[104px] h-6 rounded-md bg-slate-300" />
                  </span>
                  <span>
                    <Skeleton className="w-[63px] h-6 rounded-md bg-slate-300" />
                  </span>
                  <Skeleton className="w-[104px] h-9 rounded-md bg-slate-300" />
                  <ArrowRight className="text-[#7C5DFA]" />
                </div>
              </CardHeader>
            </Card>
          );
        })}
    </div>
  );
}
