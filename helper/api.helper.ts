// /src/helper/api.helper.ts

import { IApiResponse, IRequestOptions } from "@/schemas/api";

export async function api<TResponse = unknown, TBody = unknown>(
  url: string,
  options?: IRequestOptions<TBody>,
): Promise<IApiResponse<TResponse>> {
  const response = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: options?.cache ?? "no-store",
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Something went wrong");
  }

  return json;
}
