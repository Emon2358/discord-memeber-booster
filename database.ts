// Deno KV (簡単なキー・バリューのデータ保存の例)
export async function saveToken(userId: string, accessToken: string) {
  // Deno KVや他のデータベースにトークンを保存する処理
  try {
    const kv = await Deno.openKv();
    await kv.set(["tokens", userId], { accessToken });
    console.log("Token saved successfully.");
  } catch (error) {
    console.error("Failed to save token:", error);
  }
}
