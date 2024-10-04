import { Application, Router } from "https://deno.land/x/oak@v17.0.0/mod.ts";
import { getAccessToken, getUserInfo, addRoleToUser } from "./utils.ts";
import { saveToken } from "./database.ts";

const app = new Application();
const router = new Router();

// 環境変数をDeno Deployから取得
const clientId = Deno.env.get("DISCORD_CLIENT_ID");
const redirectUri = Deno.env.get("DISCORD_REDIRECT_URI");

router.get("/", (context) => {
  // OAuth2認証のリンクを生成
  context.response.body = `<a href="https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri!
  )}&scope=identify guilds.join guilds">Login with Discord</a>`;
});

router.get("/callback", async (context) => {
  const code = context.request.url.searchParams.get("code");
  if (code) {
    try {
      // アクセストークンを取得
      const accessToken = await getAccessToken(code);
      const userInfo = await getUserInfo(accessToken);

      // ユーザーにロールを追加
      const roleAdded = await addRoleToUser(userInfo.id, accessToken);
      if (roleAdded) {
        await saveToken(userInfo.id, accessToken);
        context.response.body = "Successfully authenticated and role assigned!";
      } else {
        context.response.body = "Failed to assign role.";
      }
    } catch (error) {
      console.error(error);
      context.response.body = "Error occurred during authentication.";
    }
  } else {
    context.response.body = "Failed to authenticate.";
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
