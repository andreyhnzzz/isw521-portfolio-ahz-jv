export class TokenPort {
  issue(_ttlSeconds) { throw new Error("TokenPort.issue no implementado"); }
  read() { throw new Error("TokenPort.read no implementado"); }
  clear() { throw new Error("TokenPort.clear no implementado"); }
}
