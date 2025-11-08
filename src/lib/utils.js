
export async function sha256(string) {
  const textAsBuffer = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
