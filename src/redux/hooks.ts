import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** Typed replacements for `useDispatch` / `useSelector`. Always use these. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
