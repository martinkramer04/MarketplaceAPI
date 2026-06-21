import { configureStore } from "@reduxjs/toolkit";
import boxSlice from "./boxSlice";
import categorySlice from "./categorySlice";
import userSlice from "./userSlice";
import discountSlice from "./discountSlice";

export const store = configureStore({
  reducer: {
    boxes: boxSlice,
    categories: categorySlice,
    user: userSlice,
    discount: discountSlice,
  },
});
