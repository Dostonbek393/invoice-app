import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "../lib/zustand";

export default function ItemList({ info }) {
  const { setItems } = useAppStore();

  const [localItems, setLocalItems] = useState(
    info?.length
      ? info.map((item) => ({
          ...item,
          total: +item.price * +item.quantity,
        }))
      : [
          {
            id: crypto.randomUUID(),
            name: "",
            quantity: 1,
            price: 0,
            total: 0,
          },
        ]
  );

  useEffect(() => {
    setItems(localItems);
  }, [localItems]);

  function handleChange(e, id) {
    const { name, value } = e.target;

    setLocalItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            [name]: value,
          };

          // Totalni faqat quantity yoki price o'zgarsa hisobla
          if (name === "quantity" || name === "price") {
            updatedItem.total = +updatedItem.price * +updatedItem.quantity;
          }

          return updatedItem;
        }
        return item;
      })
    );
  }

  function handleClick(type, id) {
    if (type === "add") {
      const lastItem = localItems.at(-1);
      if (!lastItem.name.trim()) {
        toast.info("Oxirgi item nomini kiriting!");
        return;
      }
      const newItem = {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      };
      setLocalItems((prev) => [...prev, newItem]);
    }

    if (type === "delete") {
      if (localItems.length === 1) {
        toast.warning("Kamida bitta item qolishi kerak!");
        return;
      }
      setLocalItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-[#777F98] text-[18px] font-bold">Item List</h3>

      <div className="flex justify-between mt-4 text-[#7E88C3] font-normal text-[12px]">
        <div className="flex flex-col w-[210px]">Item Name</div>
        <div className="flex flex-col w-[100px]">Qty</div>
        <div className="flex flex-col w-[100px]">Price</div>
        <div className="flex flex-col w-[80px]">Total</div>
        <div className="w-[40px]"></div>
      </div>

      <ul className="flex flex-col gap-4 mt-4">
        {localItems.map(({ id, name, quantity, price, total }) => (
          <li className="flex justify-between items-center" key={id}>
            <Input
              onChange={(e) => handleChange(e, id)}
              value={name}
              type="text"
              name="name"
              placeholder="Item Name"
              className="w-[210px] h-12"
            />
            <Input
              onChange={(e) => handleChange(e, id)}
              value={quantity}
              type="number"
              name="quantity"
              placeholder="Qty"
              className="w-[100px] h-12"
            />
            <Input
              onChange={(e) => handleChange(e, id)}
              value={price}
              type="number"
              name="price"
              placeholder="Price"
              className="w-[100px] h-12"
            />
            <span className="w-[80px] text-[#888EB0]">
              {(+total).toFixed(2)}
            </span>
            <Button
              type="button"
              onClick={() => handleClick("delete", id)}
              variant="destructive"
              size="icon"
              className="cursor-pointer hover:bg-[#EC5757]"
            >
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={() => handleClick("add")}
        className="w-full h-12 cursor-pointer hover:!bg-[#DFE3FA] mt-[18px]"
        variant="secondary"
      >
        <PlusCircle className="mr-2" />
        Add New Item
      </Button>
    </div>
  );
}
