import { create } from "zustand";

export const useAppStore = create((set) => {
  return {
    filter: "",
    invoices: [],
    themes: ["default", "rose", "blue"],
    items: [],
    sheetOpen: false,
    editedData: null,
    setEditedData(editedData) {
      return set(() => {
        return { editedData };
      });
    },

    setSheetOpen() {
      return set((state) => {
        return { sheetOpen: !state.sheetOpen };
      });
    },

    setInvoices(invoices) {
      return set(() => ({
        invoices: Array.isArray(invoices) ? invoices : [],
      }));
    },

    addInvoiceToStore(newInvoice) {
      return set((state) => {
        return { invoices: [...state.invoices, newInvoice] };
      });
    },

    updateInvoices(newData) {
      return set((state) => {
        const mapped = state.invoices.map((el) => {
          if (el.id === newData.id) {
            return newData;
          } else {
            return el;
          }
        });
        return { invoices: mapped };
      });
    },

    setFilter(value) {
      return set(() => {
        return { filter: value };
      });
    },
    setItems(items) {
      return set(() => {
        return { items };
      });
    },
  };
});
