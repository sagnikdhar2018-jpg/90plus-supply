import { createHash } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";

const MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

export type WsClient = {
  send: (text: string) => void;
  ping: () => void;
  close: () => void;
};

function acceptKey(key: string) {
  return createHash("sha1").update(key + MAGIC).digest("base64");
}

function writeFrame(socket: Duplex, payload: Buffer, opcode = 0x1) {
  const len = payload.length;
  let header: Buffer;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x80 | opcode;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  if (!socket.destroyed) socket.write(Buffer.concat([header, payload]));
}

export function acceptInventorySocket(req: IncomingMessage, socket: Duplex): WsClient | null {
  const key = req.headers["sec-websocket-key"];
  if (!key || String(req.headers.upgrade || "").toLowerCase() !== "websocket") {
    socket.destroy();
    return null;
  }
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${acceptKey(String(key))}\r\n` +
      "\r\n",
  );

  let buf = Buffer.alloc(0);
  socket.on("data", (chunk: Buffer) => {
    buf = Buffer.concat([buf, chunk]);
    while (buf.length >= 2) {
      const opcode = buf[0] & 0x0f;
      const masked = (buf[1] & 0x80) !== 0;
      let len = buf[1] & 0x7f;
      let offset = 2;
      if (len === 126) {
        if (buf.length < 4) return;
        len = buf.readUInt16BE(2);
        offset = 4;
      } else if (len === 127) {
        if (buf.length < 10) return;
        len = Number(buf.readBigUInt64BE(2));
        offset = 10;
      }
      const maskLen = masked ? 4 : 0;
      if (buf.length < offset + maskLen + len) return;
      let payload = buf.subarray(offset + maskLen, offset + maskLen + len);
      if (masked) {
        const mask = buf.subarray(offset, offset + 4);
        payload = Buffer.from(payload);
        for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i % 4]!;
      }
      buf = buf.subarray(offset + maskLen + len);
      if (opcode === 0x8) {
        socket.end();
        return;
      }
      if (opcode === 0x9) writeFrame(socket, payload, 0xa);
    }
  });

  return {
    send(text: string) {
      writeFrame(socket, Buffer.from(text), 0x1);
    },
    ping() {
      writeFrame(socket, Buffer.from("tick"), 0x9);
    },
    close() {
      try {
        writeFrame(socket, Buffer.alloc(0), 0x8);
      } catch {
        /* closed */
      }
      socket.end();
    },
  };
}
