// Minimal browser shim for node 'util' (faqat util.inspect kerak bo'ladi - printf pkg)
export default {
  inspect: function inspect(v) {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return v.indexOf('\'') === -1 ? "'" + v + "'" : '"' + v + '"';
    if (Array.isArray(v)) return '[ ' + v.map(function (x) { return inspect(x); }).join(', ') + ' ]';
    if (typeof v === 'object') {
      var parts = [];
      for (var k in v) {
        if (Object.prototype.hasOwnProperty.call(v, k)) parts.push(k + ': ' + inspect(v[k]));
      }
      return '{ ' + parts.join(', ') + ' }';
    }
    return String(v);
  }
};
