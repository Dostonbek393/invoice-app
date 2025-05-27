import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "../lib/zustand";

export default function ItemList({ info }) {
  const { setItems } = useAppStore();
  const [localItems, setLocalItems] = useState(
    info
      ? info
      : [
          {
            id: crypto.randomUUID(),
            name: "",
            quantity: 1,
            price: 0,
            get total() {
              return +this.price * +this.quantity;
            },
          },
        ]
  );

  useEffect(() => {
    setItems(localItems);
  }, [JSON.stringify(localItems)]);

  function handleChange(e, id) {
    const changedItem = localItems.find((el) => {
      return el.id === id;
    });
    changedItem[e.target.name] = e.target.value;
    setLocalItems((prev) => {
      const mapped = prev.map((el) => {
        if (el.id === changedItem.id) {
          return changedItem;
        } else {
          return el;
        }
      });
      return mapped;
    });
  }

  const handleClick = (type, id) => {
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
      const updated = localItems.filter((item) => item.id !== id);
      setLocalItems(updated);
    }
  };

  useEffect(() => {
    setItems(localItems);
  }, [localItems]);

  return (
    <div className="mt-8">
      <h3 className="text-[#777F98] text-[18px] font-bold">Item List</h3>
      <div className="flex justify-between mt-4 text-[#7E88C3] font-normal text-[12px]">
        <div className="flex flex-col w-[210px]">
          <span>Item Name</span>
        </div>
        <div className="flex flex-col w-[100px]">
          <span>Qty</span>
        </div>
        <div className="flex flex-col w-[100px]">
          <span>Price</span>
        </div>
        <div className="flex flex-col w-[80px]">
          <span>Total</span>
        </div>
        <div className="w-[40px]"></div>
      </div>
      <ul className="flex flex-col gap-4 mt-4">
        {localItems.map(({ name, quantity, price, total, id }) => (
          <li className="flex justify-between items-center" key={id}>
            <Input
              onChange={(e) => handleChange(e, id)}
              defaultValue={name}
              type="text"
              name="name"
              placeholder="Item Name"
              className="w-[210px] h-12"
            />
            <Input
              onChange={(e) => handleChange(e, id)}
              defaultValue={quantity}
              className="w-[100px] h-12"
              type="number"
              name="quantity"
              placeholder="Qty"
            />
            <Input
              onChange={(e) => handleChange(e, id)}
              defaultValue={price}
              className="w-[100px] h-12"
              type="number"
              name="price"
              placeholder="Price"
            />
            <span className="w-[80px] text-[#888EB0]">{total.toFixed(2)}</span>
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
        onClick={() => handleClick("add", crypto.randomUUID())}
        className="w-full h-12 cursor-pointer hover:!bg-[#DFE3FA] mt-[18px]"
        variant="secondary"
      >
        <PlusCircle className="mr-2" />
        Add New Item
      </Button>
    </div>
  );
}
