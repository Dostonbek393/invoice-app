import LogoImage from "../assets/logo.svg";
import { useAppStore } from "../lib/zustand";
import ThemesToggle from "./ThemesToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Form from "./Form";

export default function Sidebar() {
  const { sheetOpen, setSheetOpen, editedData } = useAppStore();
  return (
    <>
      <div className="bg-[#373B53] flex items-center justify-between md:fixed md:flex-col md:h-full md:left-0 md:bottom-0 md:top-0 md:z-[999]">
        <img src={LogoImage} />
        <div className="mr-5 md:mr-0 md: mb-5">
          <ThemesToggle />
        </div>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="ml-[100px] min-w-[calc(80%-72px)] min-h-[calc(100%-56px)] overflow-y-auto"
          side="left"
        >
          <SheetHeader className="sticky top-0 w-full bg-white border-b">
            <SheetTitle>Are you absolutely sure?</SheetTitle>
          </SheetHeader>
          <Form setSheetOpen={setSheetOpen} info={editedData} />
        </SheetContent>
      </Sheet>
    </>
  );
}
