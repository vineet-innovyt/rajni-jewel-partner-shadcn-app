
import { QueryClient } from '@tanstack/react-query';

const ezzyCommMerchantApi = process.env.NEXT_PUBLIC_EZZY_COMM_MERCHANT_API;
const ezzyCommProductApi = process.env.NEXT_PUBLIC_EZZY_COMM_PRODUCT_API;
const ezzyCommCustomerApi = process.env.NEXT_PUBLIC_EZZY_COMM_INVENTORY_API;

const ezzyCommClientKey =
    process.env.NEXT_PUBLIC_EZZY_COMM_PARTNER_WEB_CLIENT_KEY || '';
const ezzyCommClientSec =
    process.env.NEXT_PUBLIC_EZZY_COMM_PARTNER_WEB_CLIENT_SECRET || '';

export const QUERY_KEYS = {
    Partners: 'partners',
    Orders: 'orders',
    ProductCategorys: 'product-categorys',
    TopCategorysWithProduct: 'top-product-categorys',

    ProductCategoryById: 'product-category-id',
    Products: 'products',
    ProductTypes: 'product-types',
    RefData: 'ref-data',
    ProductById: 'product-by-id',

    Cart: 'cart',
    LineItem: 'line-item',
    User: 'user',
    MyOrders: 'my-orders',
    PartnerSettings: 'partner-settings'
};

export const EZZY_TOKEN_NAME = 'ezzy-comm-access-token';

let tenantCode = '';
let accessToken = '';
// localStorage ? localStorage.getItem(EZZY_TOKEN_NAME) : '';

const getHeaders: () => Record<string, string> = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'client-key': ezzyCommClientKey,
        'client-secret': ezzyCommClientSec,
        'tenant-code': 'rajni-jewel',

    }
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return headers;
}

export const appQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
            staleTime: 0,
            gcTime: 0,
        }
    }
});

export const getWhoAmIApi = async () => {
    const dataUrl = ezzyCommMerchantApi + '/api/v1/partner/who-am-i';
    console.log('ggg', getHeaders())
    return fetch(dataUrl, {
        headers: getHeaders(),
        cache: 'no-store',
    });
};
