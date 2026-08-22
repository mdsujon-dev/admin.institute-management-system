import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

/** Puts the Redux store on the tree. Nothing else belongs in here. */
export default function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
