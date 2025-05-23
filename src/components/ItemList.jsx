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

  function handleClick(type, id) {
    if (type === "add") {
      if (localItems.at(-1).name.trim() !== "") {
        setLocalItems((prev) => {
          return [
            ...prev,
            {
              id,
              name: "",
              quantity: 1,
              price: 0,
              get total() {
                return this.price * this.quantity;
              },
            },
          ];
        });
      } else {
        toast.info("Oxirgi nameni kiriting");
      }
    } else if (type === "delete") {
      if (localItems.length === 1) {
        toast.info("Eng kamida bitta element bo'lishi kerak");
      } else {
        const filtered = items.filter((el) => el.id !== id);
        setLocalItems(filtered);
      }
    }
  }

  return (
    <div>
      <h3>Item List</h3>
      <div className="flex items-center justify-between">
        <span>Item Name</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
      </div>
      <ul className="flex flex-col gap-5 mb-5">
        {localItems.map(({ name, quantity, price, total, id }) => {
          return (
            <li className="flex items-center justify-between" key={id}>
              <Input
                onChange={(e) => handleChange(e, id)}
                defaultValue={name}
                type="text"
                name="name"
                placeholder="Item Name"
                className="w-[210px]"
              />
              <Input
                onChange={(e) => handleChange(e, id)}
                defaultValue={quantity}
                className="w-[100px]"
                type="number"
                name="quantity"
                placeholder="Qty"
              />
              <Input
                onChange={(e) => handleChange(e, id)}
                defaultValue={price}
                className="w-[100px]"
                type="number"
                name="price"
                placeholder="Price"
              />
              <span>{total.toFixed(2)}</span>
              <Button
                type="button"
                onClick={() => handleClick("delete", id)}
                variant="destructive"
                size="icon"
              >
                <Trash2 />
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        type="button"
        onClick={() => handleClick("add", crypto.randomUUID())}
        className="w-full"
        variant="secondary"
      >
        <PlusCircle /> Add New Item
      </Button>
    </div>
  );
}
