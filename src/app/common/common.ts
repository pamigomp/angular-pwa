export function objectToQuerystring(obj) {
  return Object.keys(obj).reduce((str, key, i) => {
    let val: string;
    const delimiter = (i === 0) ? '?' : '&';
    key = encodeURIComponent(key);
    val = encodeURIComponent(obj[key]);
    return [str, delimiter, key, '=', val].join('');
  }, '');
}
