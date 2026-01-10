
import { QueryClient } from '@tanstack/react-query';
import { UserSignInDto } from './dto';
import { PaginatedResultEntity, ProductEntity, SignInSuccessEntity } from './entities';
import { UserContextEntity } from './entities/user-context.entity';
import { AUTH_TOKEN_KEY } from '@/lib/constants';

const rajniApi = process.env.NEXT_PUBLIC_RAJNI_API_ENDPOINT || '';

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



// localStorage ? localStorage.getItem(EZZY_TOKEN_NAME) : '';

const getHeaders: () => Record<string, string> = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'client-key': ezzyCommClientKey,
        'client-secret': ezzyCommClientSec,
        'tenant-code': 'rajni-jewel',

    }
    const accessToken = localStorage.getItem(AUTH_TOKEN_KEY);
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

export const getWhoAmIApi = async (): Promise<UserContextEntity> => {
    const dataUrl = rajniApi + '/api/v1/auth/who-am-i';
    const response = await fetch(dataUrl, {
        headers: getHeaders(),
        cache: 'no-store',
    });

    if (!response.ok) throw new Error(response.statusText);
    return response.json();
};

export const userSignInApi = async (dto: UserSignInDto): Promise<SignInSuccessEntity> => {
    const dataUrl = rajniApi + '/api/v1/auth/user/signin';
    const response = await fetch(dataUrl, {
        method: 'POST',
        body: JSON.stringify(dto),
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
};

export const productSearchApi = async (pageIndex?: number, pageSize?: number): Promise<PaginatedResultEntity<ProductEntity>> => {
    const dataUrl = rajniApi + `/api/v1/product/search?page-index=${pageIndex}&page-size=${pageSize}`;
    const response = await fetch(dataUrl, {
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
};
