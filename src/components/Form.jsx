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
  const { addInvoiceToStore, updateInvoices } = useAppStore();
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
            addInvoiceToStore(res);
            navigate("/");
          } else {
            updateInvoices(res);
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
    <form onSubmit={handleSubmit} className="p-6 sm:p-14 w-full">
      <div>
        <h3 className="text-[12px] font-bold text-[#7C5DFA]">Bill From</h3>
        <div className="flex flex-col">
          <div className="grid w-full max-w-full items-center">
            <Label
              htmlFor="senderAddress-street"
              className="mt-6 text-[#7E88C3]"
            >
              Street Address
            </Label>
            <Input
              defaultValue={info && senderAddress.street}
              type="text"
              id="senderAddress-street"
              name="senderAddress-street"
              placeholder="Street Addres"
              className="cursor-pointer hover:!border-[#9277FF] mt-2 h-12"
            />
          </div>

          <div className="flex justify-between gap-6 mt-6">
            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="senderAddress-city" className="text-[#7E88C3]">
                City
              </Label>
              <Input
                defaultValue={info && senderAddress.city}
                type="text"
                id="senderAddress-city"
                name="senderAddress-city"
                placeholder="City"
                className="mt-2 h-12"
              />
            </div>

            <div className="grid w-full max-w-sm items-center">
              <Label
                htmlFor="senderAddress-postCode"
                className="text-[#7E88C3]"
              >
                Post Code
              </Label>
              <Input
                defaultValue={info && senderAddress.postCode}
                type="text"
                id="senderAddress-postCode"
                name="senderAddress-postCode"
                placeholder="Post Code"
                className="mt-2 h-12"
              />
            </div>

            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="senderAddress-country" className="text-[#7E88C3]">
                Country
              </Label>
              <Input
                defaultValue={info && senderAddress.country}
                type="text"
                id="senderAddress-country"
                name="senderAddress-country"
                placeholder="Country"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-[12px] font-bold text-[#7C5DFA]">Bill To</h3>
        <div className="flex flex-col gap-5 mb-5">
          <div className="grid w-full max-w-full items-center">
            <Label
              htmlFor="clientName"
              className="hover:!text-[#EC5757] mt-6 text-[#7E88C3]"
            >
              Client's Name
            </Label>
            <Input
              defaultValue={info && clientName}
              type="text"
              id="clientName"
              name="clientName"
              placeholder="Client's Name"
              className="cursor-pointer hover:!border-[#EC5757] mt-2 h-12"
            />
          </div>

          <div className="grid w-full max-w-full items-center mt-2">
            <Label htmlFor="clientEmail" className="text-[#7E88C3]">
              Client's Email
            </Label>
            <Input
              defaultValue={info && clientEmail}
              type="text"
              id="clientEmail"
              name="clientEmail"
              placeholder="Client's Email"
              className="cursor-pointer hover:!border-[#EC5757] mt-2 h-12"
            />
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="grid w-full max-w-full items-center">
            <Label htmlFor="clientAddress-street" className="text-[#7E88C3]">
              Street Address
            </Label>
            <Input
              defaultValue={info && clientAddress.street}
              type="text"
              id="clientAddress-street"
              name="clientAddress-street"
              placeholder="Street Addres"
              className="cursor-pointer hover:!border-[#EC5757] mt-2 h-12"
            />
          </div>

          <div className="flex justify-between mt-6 gap-6">
            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="clientAddress-city" className="text-[#7E88C3]">
                City
              </Label>
              <Input
                defaultValue={info && clientAddress.city}
                type="text"
                id="clientAddress-city"
                name="clientAddress-city"
                placeholder="City"
                className="mt-2 h-12"
              />
            </div>

            <div className="grid w-full max-w-sm items-center">
              <Label
                htmlFor="clientAddress-postCode"
                className="text-[#7E88C3]"
              >
                Post Code
              </Label>
              <Input
                defaultValue={info && clientAddress.postCode}
                type="text"
                id="clientAddress-postCode"
                name="clientAddress-postCode"
                placeholder="Post Code"
                className="mt-2 h-12"
              />
            </div>

            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="clientAddress-country" className="text-[#7E88C3]">
                Country
              </Label>
              <Input
                defaultValue={info && clientAddress.country}
                type="text"
                id="clientAddress-country"
                name="clientAddress-country"
                placeholder="Country"
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="grid w-full max-w-sm items-center">
            <Label
              htmlFor="createdAt"
              className="text-[12px] text-[#7E88C3] font-normal"
            >
              Invoice date
            </Label>
            <Input
              defaultValue={info && createdAt}
              type="date"
              id="createdAt"
              name="createdAt"
              placeholder="Invoice date"
              className="cursor-pointer hover:!border-[#7C5DFA] mt-2 w-60 h-12"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="paymentTerms"
              className="text-[12px] text-[#7E88C3] font-normal"
            >
              Payment Terms
            </label>
            <Select
              name="paymentTerms"
              defaultValue={info ? paymentTerms.toString() : undefined}
            >
              <SelectTrigger className="cursor-pointer hover:!border-[#7C5DFA] w-60 min-h-[3rem] py-3">
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
        </div>

        <div className="grid w-full max-w-full items-center mt-6">
          <Label htmlFor="description" className="text-[#7E88C3]">
            Project description
          </Label>
          <Input
            defaultValue={info && description}
            type="text"
            id="description"
            name="description"
            placeholder="Project description"
            className="mt-2 h-12"
          />
        </div>
      </div>

      <ItemList info={info && info.items} />

      {info ? (
        <div className="flex justify-end gap-5 mt-10">
          <Button
            onClick={() => setSheetOpen(false)}
            type="button"
            variant={"outline"}
            className="cursor-pointer rounded-2xl w-[96px] h-12"
          >
            Cancel
          </Button>
          <Button
            id="edit"
            disabled={loading}
            className="bg-[#7C5DFA] cursor-pointer rounded-2xl w-[138px] h-12"
          >
            {loading ? "Loading..." : "Save Change"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-10">
          <div>
            <Button
              type="button"
              variant={"outline"}
              className="cursor-pointer rounded-2xl w-[84px] sm:w-[96px] h-12"
            >
              Discard
            </Button>
          </div>
          <div className="flex gap-[7px] sm:gap-6">
            <Button
              disabled={loading}
              id="draft"
              variant={"secondary"}
              className="bg-[#0C0E16] cursor-pointer text-white hover:text-black rounded-2xl w-[117px] sm:w-[133px] h-12"
            >
              {loading ? "Loading..." : "Save as draft"}
            </Button>
            <Button
              disabled={loading}
              id="pending"
              className="bg-[#7C5DFA] cursor-pointer rounded-2xl w-[112px] sm:w-[128px] h-12"
            >
              {loading ? "Loading..." : "Save & Send"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
