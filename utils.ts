// 環境変数の取得
const clientId = Deno.env.get("DISCORD_CLIENT_ID");
const clientSecret = Deno.env.get("DISCORD_CLIENT_SECRET");
const redirectUri = Deno.env.get("DISCORD_REDIRECT_URI");
const botToken = Deno.env.get("DISCORD_BOT_TOKEN");
const guildId = Deno.env.get("DISCORD_GUILD_ID");
const roleId = Deno.env.get("DISCORD_ROLE_ID");

export async function getAccessToken(code: string) {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri!,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch access token.");
  }

  const data = await response.json();
  return data.access_token;
}

export async function getUserInfo(accessToken: string) {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info.");
  }

  return await response.json();
}

export async function addRoleToUser(userId: string) {
  const response = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`, // Botトークンを使用
      },
    }
  );

  return response.status === 204;
}
