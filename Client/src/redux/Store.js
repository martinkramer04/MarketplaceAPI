import { configureStore } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import boxReducer from './slices/BoxSlice';
import categoryReducer from './slices/CategorySlice';
import orderReducer from './slices/OrderSlice';
import productReducer from './slices/ProductSlice';
import userReducer from './slices/UserSlice';
import paymentMethodsReducer from './slices/PaymentMethodsSlice';
import providerSolicitationsReducer from './slices/ProviderSolicitationsSlice';
import reviewReducer from './slices/ReviewSlice';
import discountReducer from './slices/DiscountSlice';

export const store = configureStore({
    reducer: {
        // SLICES
        boxes: boxReducer,
        categories: categoryReducer,
        orders: orderReducer,
        products: productReducer,
        user: userReducer,
        paymentMethods: paymentMethodsReducer,
        providerSolicitations: providerSolicitationsReducer,
        reviews: reviewReducer,
        discounts: discountReducer,
    }
});