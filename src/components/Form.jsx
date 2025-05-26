import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import ItemList from "./ItemList";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "../lib/zustand";
import { prepareData } from "../lib/utils";
import { addInvoice, updateById } from "../request";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Form({ info, setSheetOpen }) {
  const { items: zustandItems } = useAppStore();
  const {
    senderAddress,
    clientAddress,
    clientEmail,
    clientName,
    paymentTerms,
    description,
    createdAt,
    paymentDue,
    items,
  } = info || {};
  const navigate = useNavigate();
  const { updateInvoices } = useAppStore();
  const [sending, setSending] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = {
      senderAddress: {},
      clientAddress: {},
    };
    if (!info) {
      result.status = e.nativeEvent.submitter.id;
    }
    formData.forEach((value, key) => {
      if (key.startsWith("senderAddress-")) {
        result.senderAddress[key.replace("senderAddress-", "")] = value;
      } else if (key.startsWith("clientAddress-")) {
        result.clientAddress[key.replace("clientAddress-", "")] = value;
      } else if (
        key === "quantity" ||
        key === "price" ||
        key === "paymentTerms"
      ) {
        result[key] = Number(value);
      } else {
        result[key] = value;
      }
    });
    result.items = zustandItems;
    const readyData = prepareData(result);

    setSending({
      mode: e.nativeEvent.submitter.id === "edit" ? "edit" : "add",
      data: readyData,
    });
  }

  useEffect(() => {
    if (sending) {
      setLoading(true);
      const request =
        sending.mode === "add"
          ? addInvoice(sending.data)
          : updateById(info?.id, sending.data);
      request
        .then((res) => {
          updateInvoices(res);
          toast.success(
            `Successfully ${sending.mode === "add" ? "added" : "updated"} 👌✅`
          );
          if (sending.mode === "add") {
            navigate("/");
          } else {
            navigate(-1);
          }
          setSheetOpen(false);
        })
        .catch(({ message }) => {
          toast.error(message);
        })
        .finally(() => {
          setLoading(false);
          setSending(null);
        });
    }
  }, [sending]);

  return (
    <form onSubmit={handleSubmit} className="p-4 pt-14">
      <div className="mb-10">
        <h3 className="text-2xl font-medium">Bill From</h3>
        <div className="flex flex-col gap-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="senderAddress-street">Street Address</Label>
            <Input
              defaultValue={info && senderAddress.street}
              type="text"
              id="senderAddress-street"
              name="senderAddress-street"
              placeholder="Street Addres"
            />
          </div>

          <div className="flex justify-between gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="senderAddress-city">City</Label>
              <Input
                defaultValue={info && senderAddress.city}
                type="text"
                id="senderAddress-city"
                name="senderAddress-city"
                placeholder="City"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="senderAddress-postCode">Post Code</Label>
              <Input
                defaultValue={info && senderAddress.postCode}
                type="text"
                id="senderAddress-postCode"
                name="senderAddress-postCode"
                placeholder="Post Code"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="senderAddress-country">Country</Label>
              <Input
                defaultValue={info && senderAddress.country}
                type="text"
                id="senderAddress-country"
                name="senderAddress-country"
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-medium">Bill To</h3>
        <div className="flex flex-col gap-5 mb-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="clientName">Client's Name</Label>
            <Input
              defaultValue={info && clientName}
              type="text"
              id="clientName"
              name="clientName"
              placeholder="Client's Name"
            />
          </div>

          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="clientEmail">Client's Email</Label>
            <Input
              defaultValue={info && clientEmail}
              type="text"
              id="clientEmail"
              name="clientEmail"
              placeholder="Client's Email"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="clientAddress-street">Street Address</Label>
            <Input
              defaultValue={info && clientAddress.street}
              type="text"
              id="clientAddress-street"
              name="clientAddress-street"
              placeholder="Street Addres"
            />
          </div>

          <div className="flex justify-between gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="clientAddress-city">City</Label>
              <Input
                defaultValue={info && clientAddress.city}
                type="text"
                id="clientAddress-city"
                name="clientAddress-city"
                placeholder="City"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="clientAddress-postCode">Post Code</Label>
              <Input
                defaultValue={info && clientAddress.postCode}
                type="text"
                id="clientAddress-postCode"
                name="clientAddress-postCode"
                placeholder="Post Code"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="clientAddress-country">Country</Label>
              <Input
                defaultValue={info && clientAddress.country}
                type="text"
                id="clientAddress-country"
                name="clientAddress-country"
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 mb-10">
        <div className="flex gap-10 items-end">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="createdAt">Invoice date</Label>
            <Input
              defaultValue={info && createdAt}
              type="date"
              id="createdAt"
              name="createdAt"
              placeholder="Invoice date"
            />
          </div>

          <Select
            name="paymentTerms"
            defaultValue={info && paymentTerms.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Terms</SelectLabel>
                <SelectItem value="1">Net 1 Days</SelectItem>
                <SelectItem value="7">Net 7 Days</SelectItem>
                <SelectItem value="14">Net 14 Days</SelectItem>
                <SelectItem value="30">Net 30 Days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full max-w-full items-center gap-1.5">
          <Label htmlFor="description">Project description</Label>
          <Input
            defaultValue={info && description}
            type="text"
            id="description"
            name="description"
            placeholder="Project description"
          />
        </div>
      </div>

      <ItemList info={info && info.items} />

      {info ? (
        <div className="flex justify-end gap-5 mt-10">
          <Button variant={"outline"}>Cancel</Button>
          <Button id="edit" disabled={loading}>
            {loading ? "Loading..." : "Save Change"}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-5 mt-10">
          <Button type="button" variant={"outline"}>
            Discard
          </Button>
          <Button disabled={loading} id="draft" variant={"secondary"}>
            {loading ? "Loading..." : "Save as draft"}
          </Button>
          <Button disabled={loading} id="pending">
            {loading ? "Loading..." : "Save & Send"}
          </Button>
        </div>
      )}
    </form>
  );
}
