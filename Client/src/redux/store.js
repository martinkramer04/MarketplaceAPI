import { configureStore } from "@reduxjs/toolkit";
import boxSlice from "./boxSlice";
import categorySlice from "./categorySlice";
import userSlice from "./userSlice";
import discountSlice from "./discountSlice";
import providerSolicitationSlice from "./providerSolicitationSlice";
import boxSolicitationSlice from "./boxSolicitationSlice";
import orderSlice from "./orderSlice";
import reviewSlice from "./reviewSlice";
import dashboardSlice from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    boxes: boxSlice,
    categories: categorySlice,
    user: userSlice,
    discount: discountSlice,
    providerSolicitations: providerSolicitationSlice,
    boxSolicitations: boxSolicitationSlice,
    orders: orderSlice,
    reviews: reviewSlice,
    dashboard: dashboardSlice,
  },
});
