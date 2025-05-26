import LogoImage from "../assets/logo.svg";
import { useAppStore } from "../lib/zustand";
import ThemesToggle from "./ThemesToggle";
import oval from "../assets/Oval.png";
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
      <div className="bg-[#373B53] flex items-center justify-between md:fixed md:flex-col md:h-full md:left-0 md:bottom-0 md:top-0 md:z-[999] rounded-r-[20px]">
        <img src={LogoImage} />
        <div className="flex items-center gap-6 md:flex-col md:gap-0 md:mb-5">
          <ThemesToggle />
          <div className="hidden md:block w-full">
            <div className="border-t border-[#494E6E] mt-8 pt-6 w-full flex justify-center">
              <img src={oval} className="w-10 h-10" />
            </div>
          </div>
          <div className="md:hidden md:mr-8">
            <img src={oval} className="w-10 h-10 mr-6" />
          </div>
        </div>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="ml-[100px] min-w-[calc(80%-72px)] min-h-[calc(100%-56px)] overflow-y-auto"
          side="left"
        >
          <SheetHeader className="sticky top-0 w-full border-b">
            <SheetTitle className="font-bold text-[24px]">
              New Invoice
            </SheetTitle>
          </SheetHeader>
          <Form setSheetOpen={setSheetOpen} info={editedData} />
        </SheetContent>
      </Sheet>
    </>
  );
}
