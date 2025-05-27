import { useNavigate, useParams } from "react-router-dom";
import { deleteById, getInvoice, updateById } from "../request";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "../components/ui/button";
import StatusBadge from "../components/StatusBadge";
import path1 from "../assets/Path1.svg";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useAppStore } from "../lib/zustand";

export default function Details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateInvoices, setEditedData, setSheetOpen } = useAppStore();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [invoice, setInvoice] = useState([]);

  useEffect(() => {
    setLoading(true);
    getInvoice(id)
      .then((res) => {
        setInvoice(res);
      })
      .catch(({ message }) => {
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleDelete(id) {
    setDeleteLoading(true);
    deleteById(id)
      .then((res) => {
        navigate("/");
      })
      .catch(({ message }) => {
        toast.error(message);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  }

  function handleUpdate(id, data) {
    setUpdateLoading(true);
    updateById(id, data)
      .then((res) => {
        updateInvoices(res);
        navigate(-1);
      })
      .catch(({ message }) => {
        toast.error(message);
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  }

  function handleEdit(data) {
    setSheetOpen();
    setEditedData(data);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatPostCode(postCode) {
    if (!postCode) return "";
    const cleaned = postCode.toUpperCase().replace(/\s+/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length >= 5 && cleaned.length <= 8) {
      const part1 = cleaned.slice(0, -3);
      const part2 = cleaned.slice(-3);
      return `${part1} ${part2}`;
    }
    return postCode;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="py-5">
      <div className="base-container">
        <div className="flex items-center gap-7">
          <img src={path1} />
          <p
            onClick={() => navigate("/")}
            className="text-[#0C0E16] font-bold text-[12px] cursor-pointer"
          >
            Go back
          </p>
        </div>
        <Card className="mb-6 mt-8">
          <CardContent className="flex justify-between items-center flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span>Status: </span>
              <StatusBadge status={invoice.status} />
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end fixed bottom-0 left-0 right-0 bg-white border-t p-4 sm:static sm:border-none z-50">
              <Button
                className="cursor-pointer hover:!bg-[#DFE3FA] h-12 rounded-2xl"
                onClick={() => handleEdit(invoice)}
                variant="ghost"
              >
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-2xl cursor-pointer hover:!bg-[#FF9797] h-12 flex items-center justify-center">
                    Delete
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete invoice #{invoice.id}?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-3">
                    <DialogClose
                      className={`${buttonVariants({
                        variant: "ghost",
                      })} cursor-pointer rounded-2xl`}
                    >
                      Cancel
                    </DialogClose>
                    <Button
                      className="cursor-pointer rounded-2xl"
                      onClick={() => handleDelete(invoice.id)}
                      variant="destructive"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Loading..." : "Delete"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {invoice.status === "pending" && (
                <Button
                  className="cursor-pointer hover:!bg-[#9277FF] h-12 rounded-2xl"
                  onClick={() => handleUpdate(invoice.id, { status: "paid" })}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Loading..." : "Mark as Paid"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="p-12">
          <div className="flex justify-between">
            <div>
              <h3 className="mb-2 font-semibold text-[16px] text-[#888EB0]">
                #<span className="text-black">{invoice.id}</span>
              </h3>
              <h3 className="text-[#7E88C3] text-[12px]">
                {invoice.description}
              </h3>
            </div>
            <div className="text-end text-[12px] text-[#7E88C3]">
              <p>{invoice.senderAddress?.street}</p>
              <p>{invoice.senderAddress?.city}</p>
              <p>{formatPostCode(invoice.senderAddress?.postCode)}</p>
              <p>{invoice.senderAddress?.country}</p>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-[12px] text-[#7E88C3]">
            <div>
              <p>Invoice Date</p>
              <h3 className="text-[15px] text-black font-bold">
                {formatDate(invoice.createdAt)}
              </h3>
              <p className="mt-8">Payment Due</p>
              <h3 className="text-[15px] text-black font-bold">20 Sep 2021</h3>
            </div>
            <div>
              <p>Bill To</p>
              <h3 className="mt-3 mb-2 text-[15px] text-black font-bold">
                {invoice.clientName}
              </h3>
              <p>{invoice.clientAddress?.street}</p>
              <p>{invoice.clientAddress?.city}</p>
              <p>{formatPostCode(invoice.clientAddress?.postCode)}</p>
              <p>{invoice.clientAddress?.country}</p>
            </div>
            <div>
              <p>Sent to</p>
              <h3 className="mt-3 text-[15px] text-black font-bold">
                {invoice.clientEmail}
              </h3>
            </div>
          </div>

          <div>
            <div className="mt-10 p-8 bg-[#F9FAFE] rounded-t-2xl">
              <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground mb-6">
                <span>Item Name</span>
                <span className="text-center">QTY.</span>
                <span className="text-center">Price</span>
                <span className="text-end">Total</span>
              </div>
              {invoice.items?.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 text-sm py-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-center text-muted-foreground">
                    {item.quantity}
                  </span>
                  <span className="text-center text-muted-foreground">
                    £ {Number(item.price).toFixed(2)}
                  </span>
                  <span className="text-end font-semibold">
                    £ {Number(item.total).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between rounded-b-2xl p-7 bg-[#373B53] text-white">
              <p className="font-normal text-[11px]">Amount Due</p>
              <h2 className="font-bold text-[24px]">
                £ {Number(invoice.total).toFixed(2)}
              </h2>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
