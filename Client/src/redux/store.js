import { configureStore } from "@reduxjs/toolkit";
import boxSlice from "./boxSlice";
import categorySlice from "./categorySlice";

export const store = configureStore({
  reducer: {
    boxes: boxSlice,
    categories: categorySlice,
  },
});
