import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircleIcon } from "lucide-react";
import { useAppStore } from "../lib/zustand";
import { queryGenerator } from "../lib/utils";
import path2 from "../assets/Path2.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { setSheetOpen, setFilter } = useAppStore();
  const [items, setItems] = useState({
    draft: false,
    paid: false,
    pending: false,
  });

  function handleChange(key) {
    setItems((prev) => {
      return { ...prev, [key]: !prev[key] };
    });
  }

  useEffect(() => {
    const query = queryGenerator(items);
    setFilter(query);
  }, [JSON.stringify(items)]);

  return (
    <header>
      <div className="base-container flex items-center justify-between py-10">
        <div>
          <h1
            className="text-[#0C0E16] font-bold text-[32px]"
            style={{ color: "var(--home-text)" }}
          >
            Invoices
          </h1>
          <p
            className="mt-2 text-[#888EB0]"
            style={{ color: "var(--home-text)" }}
          >
            Theare are 7 total invoices
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="ml-auto mr-4 md:mr-10 items-center gap-2 md:gap-4 cursor-pointer"
              variant="ghost"
            >
              <span className="hidden md:inline">Filter by status</span>
              <span className="inline md:hidden">Filter</span>
              <img src={path2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 cursor-pointer">
            <DropdownMenuLabel>Statuses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col">
              {Object.entries(items).map(([key, value]) => {
                return (
                  <label
                    key={key}
                    className={`${buttonVariants({
                      variant: "ghost",
                    })} justify-start capitalize cursor-pointer`}
                    htmlFor={key}
                  >
                    <Checkbox
                      className="cursor-pointer"
                      value={key}
                      checked={value}
                      onCheckedChange={() => handleChange(key)}
                      id={key}
                    />
                    {key}
                  </label>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={setSheetOpen}
          className="rounded-2xl w-[90px] md:w-[150px] h-12 cursor-pointer flex items-center gap-2 justify-center"
        >
          <PlusCircleIcon />
          <span className="hidden md:inline">New Invoice</span>
          <span className="inline md:hidden">New</span>
        </Button>
      </div>
    </header>
  );
}
