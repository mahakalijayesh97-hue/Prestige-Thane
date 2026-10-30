/**
 * Polyfill / Guard for Node.js 20+ and Node.js 24+ WebStreams in Next.js 13.x/14.x
 *
 * When a browser closes a tab, reloads, or navigates away while Next.js is streaming
 * React Server Components (RSC), Node.js WebStreams throws:
 *   TypeError [ERR_INVALID_STATE]: Invalid state: ReadableStream is already closed
 *
 * This patch wraps `enqueue` and `close` on WebStream controllers to gracefully
 * ignore writes to closed streams rather than throwing unhandled server errors.
 */

function patchStreamController(ctor: any) {
  if (!ctor || !ctor.prototype) return;
  const proto = ctor.prototype;
  if (proto.__nextjs_stream_patched) return;

  const origEnqueue = proto.enqueue;
  proto.enqueue = function (this: any, chunk: any) {
    try {
      return origEnqueue.call(this, chunk);
    } catch (err: any) {
      if (
        err &&
        (err.code === 'ERR_INVALID_STATE' ||
          (typeof err.message === 'string' && err.message.includes('already closed')))
      ) {
        // Ignore enqueue on client-aborted streams
        return;
      }
      throw err;
    }
  };

  const origClose = proto.close;
  proto.close = function (this: any) {
    try {
      return origClose.call(this);
    } catch (err: any) {
      if (
        err &&
        (err.code === 'ERR_INVALID_STATE' ||
          (typeof err.message === 'string' && err.message.includes('already closed')))
      ) {
        // Ignore double close or close on client-aborted streams
        return;
      }
      throw err;
    }
  };

  proto.__nextjs_stream_patched = true;
}

if (typeof globalThis !== 'undefined') {
  if (typeof (globalThis as any).ReadableByteStreamController !== 'undefined') {
    patchStreamController((globalThis as any).ReadableByteStreamController);
  }
  if (typeof (globalThis as any).ReadableStreamDefaultController !== 'undefined') {
    patchStreamController((globalThis as any).ReadableStreamDefaultController);
  }
}

export {};

