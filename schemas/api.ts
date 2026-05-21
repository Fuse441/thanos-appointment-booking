import { HttpMethod } from "@/types";

export interface IRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  cache?: RequestCache;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
}
