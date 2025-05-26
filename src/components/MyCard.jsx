import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";
import pathcopy from "../assets/Path-Copy.svg";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyCard({ createdAt, clientName, total, status, id }) {
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
          <CardTitle className="text-[#7E88C3]">
            #
            <span className="text-black" style={{ color: "var(--home-text)" }}>
              {id}
            </span>
          </CardTitle>
          <CardDescription
            className="text-[#888EB0]"
            style={{ color: "var(--home-text)" }}
          >
            Due {formatDate(createdAt)}
          </CardDescription>
          <span
            className="text-[#858BB2]"
            style={{ color: "var(--home-text)" }}
          >
            {clientName}
          </span>
          <span
            className="text-[#0C0E16] font-bold text-[16px]"
            style={{ color: "var(--home-text)" }}
          >
            £{total.toFixed(2)}
          </span>
          <StatusBadge status={status} />
          <img src={pathcopy} />
        </div>
      </CardHeader>
    </Card>
  );
}
