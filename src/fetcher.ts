import type { FetchResult } from "./types";

export async function fetchHtml(url: string): Promise<FetchResult> {
  let normalizedUrl: string;

  try {
    normalizedUrl = new URL(url).toString();
  } catch (error: unknown) {
    throw new Error(`Invalid URL "${url}": ${getErrorMessage(error)}`);
  }

  let response: Response;
  try {
    response = await fetch(normalizedUrl, {
      redirect: "follow",
      headers: {
        "user-agent": "web-grab-cli/1.0",
      },
    });
  } catch (error: unknown) {
    throw new Error(`Failed to fetch "${normalizedUrl}": ${getErrorMessage(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
  }

  try {
    return {
      html: await response.text(),
      finalUrl: response.url || normalizedUrl,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to read response body: ${getErrorMessage(error)}`);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
