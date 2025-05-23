import { ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MyCard({
  createdAt = "Due 19 Aug 2021",
  clientName = "Jensen Huang",
  total = "£ 1,800.90",
  status = "draft",
  id = "1",
}) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(`/${id}`);
      }}
      className="border-2 border-transparent hover:border-blue-400 transition-colors"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>#{id}</CardTitle>
          <CardDescription>{createdAt}</CardDescription>
          <span>{clientName}</span>
          <span>£{total}</span>
          <StatusBadge status={status} />
          <ArrowRight className="text-[#7C5DFA]" />
        </div>
      </CardHeader>
    </Card>
  );
}
