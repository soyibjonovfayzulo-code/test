// Minimal browser shim for node 'stream' (faqat instanceof Stream tekshiruvi uchun)
export default {
  Stream: function Stream() {},
  Readable: function Readable() {},
  Writable: function Writable() {},
  Duplex: function Duplex() {},
  Transform: function Transform() {}
};
