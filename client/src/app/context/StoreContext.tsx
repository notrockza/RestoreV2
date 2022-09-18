import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/Basket";
interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}
//ก ำหนดค่ำไว้ก่อน(สร้ำงห้องครัวเปล่ำๆ)
export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);
//2.ถูกเรียกใช้จำกภำยนอก
export function useStoreContext() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw Error("Oops - we do not seem to be inside the provider");
  }
  return context;
}
//1.สร้ำงสเตทไว้ภำยใน และน ำไปครอบ { children } ที่ต้องกำรใช้(Index.tsx)
export function StoreProvider({ children }: PropsWithChildren<any>) {
  const [basket, setBasket] = useState<Basket | null>(null);
  function removeItem(productId: number, quantity: number) {
    if (!basket) return;
    const items = [...basket.items];
    const itemIndex = items.findIndex((i) => i.productId === productId);
    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;
      if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1);
      setBasket((prevState) => {
        return { ...prevState!, items };
      });
    }
  }
  return (
    //value แมบจับคู่กับ interface StoreContextValue
    // {children} ที่ถูกครอบจะสำมำรถเข้ำถึงค่ำของ value ได้
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}
