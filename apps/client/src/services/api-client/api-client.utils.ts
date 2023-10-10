import joinUrlParts from "url-join";
import { RequestFailedError } from "./api-client.errors";
import {
  SendApiRequestOptions,
  SendApiRequestResult,
} from "./api-client.types";

export async function sendApiRequest<T = unknown>(
  options: SendApiRequestOptions,
): Promise<SendApiRequestResult<T>> {
  let fullUrl = joinUrlParts(
    `http://${window.location.hostname}:5000/api`,
    options.path,
  );

  if (options.query) {
    fullUrl += "?" + options.query.toString();
  }

  const payload: Parameters<typeof fetch>[1] = {
    method: options.method || "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (options.body) {
    payload.body = JSON.stringify(options.body);
  }

  let fetchResponse;
  try {
    fetchResponse = await fetch(fullUrl, payload);
  } catch (error) {
    throw new RequestFailedError({ cause: error });
  }

  const body = await fetchResponse.json();
  if (fetchResponse.status !== 200 && !options.ignoreBadStatusCode) {
    throw RequestFailedError.fromApiResponse(body.error, fetchResponse.status);
  }

  return {
    body: body as T,
    response: fetchResponse,
  };
}
