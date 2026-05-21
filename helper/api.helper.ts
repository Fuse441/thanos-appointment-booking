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

export async function streamToJson(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }

  return JSON.parse(result || "[]");
}
