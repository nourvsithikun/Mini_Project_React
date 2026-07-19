import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const fetchBaseQueryCustom = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_ISHOP_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const ecommerceApi = createApi({
  reducerPath: "ecommerceApi",
  baseQuery: fetchBaseQueryCustom,
  tagTypes: ["Products", "Product"],
  endpoints: () => ({}),
});
