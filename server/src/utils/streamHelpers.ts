// utils/streamHelpers.ts
import { Readable } from "stream";
import type { Response } from "express";
import type { StreamingBlobPayloadOutputTypes } from "@smithy/types";

/**
 * Converts AWS SDK v3 stream types to Node.js Readable stream
 * and pipes it to Express response
 */
export async function streamToResponse(
  body: StreamingBlobPayloadOutputTypes,
  res: Response
): Promise<void> {
  // Type 1: Already a Node.js Readable stream (most common in Node.js)
  if (body instanceof Readable) {
    return new Promise((resolve, reject) => {
      body.pipe(res);
      body.on("end", resolve);
      body.on("error", reject);
    });
  }

  // Type 2: Web ReadableStream (in some environments like CloudFlare Workers)
  if (typeof (body as any).getReader === "function") {
    const webStream = body as ReadableStream<Uint8Array>;
    const reader = webStream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          res.end();
          break;
        }

        // Write chunk and handle backpressure
        if (!res.write(Buffer.from(value))) {
          await new Promise((resolve) => res.once("drain", resolve));
        }
      }
    } catch (error) {
      reader.cancel();
      throw error;
    }

    return;
  }

  // Type 3: Async iterable (Blob or other types)
  if (Symbol.asyncIterator in body) {
    for await (const chunk of body as AsyncIterable<Uint8Array>) {
      if (!res.write(Buffer.from(chunk))) {
        await new Promise((resolve) => res.once("drain", resolve));
      }
    }
    res.end();
    return;
  }

  // Fallback: This shouldn't happen, but just in case
  throw new Error(`Unsupported stream type: ${typeof body}`);
}

/**
 * Alternative: Convert stream to Buffer (less memory efficient)
 * Use this only for small files or as a fallback
 */
export async function streamToBuffer(
  body: StreamingBlobPayloadOutputTypes
): Promise<Buffer> {
  const chunks: Uint8Array[] = [];

  if (body instanceof Readable) {
    for await (const chunk of body) {
      chunks.push(chunk);
    }
  } else if (Symbol.asyncIterator in body) {
    for await (const chunk of body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
  } else {
    throw new Error(`Unsupported stream type: ${typeof body}`);
  }

  return Buffer.concat(chunks);
}
