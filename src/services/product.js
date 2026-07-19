import { ecommerceApi } from "./api";

export const productService = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    // Read all products
    getAllProducts: builder.query({
      query: ({ page = 0, size = 8, name = "" } = {}) =>
        `/products?page=${page}&size=${size}&name=${name}`,
      providesTags: ["Products"],
    }),

    // Read a single product by UUID
    getSingleProductByUUID: builder.query({
      query: (uuid) => `/products/${uuid}`,
      providesTags: ["Product"],
    }),

    // Create a new product
    createNewProduct: builder.mutation({
      query: ({ newProduct }) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update a product by UUID
    updateProductByUUID: builder.mutation({
      query: ({ updatedProduct, uuid }) => ({
        url: `/products/${uuid}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: ["Products", "Product"],
    }),

    // Delete a product by UUID
    deleteProductByUUID: builder.mutation({
      query: ({ uuid }) => ({
        url: `/products/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Data used by the create product form
    getAllBrands: builder.query({
      query: () => "/brands?page=0&size=100&name=",
    }),
    getAllCategories: builder.query({
      query: () => "/categories?page=0&size=100&name=",
    }),
    getAllSuppliers: builder.query({
      query: () => "/suppliers?page=0&size=100&name=",
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductByUUIDQuery,
  useCreateNewProductMutation,
  useUpdateProductByUUIDMutation,
  useDeleteProductByUUIDMutation,
  useGetAllBrandsQuery,
  useGetAllCategoriesQuery,
  useGetAllSuppliersQuery,
} = productService;
