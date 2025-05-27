import { useState, useEffect } from "react";
import { getInvoices } from "../request";
import CardSkeleton from "../components/CardSkeleton";
import MyCard from "../components/MyCard";
import { useAppStore } from "../lib/zustand";
import NotFoundComponent from "./NotFoundComponent";

export default function InvoiceCards() {
  const { filter, invoices, setInvoices } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log(filter);
    getInvoices(filter)
      .then((res) => {
        setInvoices(res);
      })
      .catch(({ message }) => {
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter]);

  if (loading) {
    return <CardSkeleton />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (invoices.length === 0) {
    return <NotFoundComponent />;
  }

  return (
    <div className="base-container flex flex-col gap-4 mb-6">
      {invoices.map((el) => {
        console.log(el);
        const { createdAt, total, status, clientName, id } = el;

        return (
          <MyCard
            createdAt={createdAt}
            total={total}
            status={status}
            clientName={clientName}
            key={id}
            id={id}
          />
        );
      })}
    </div>
  );
}
