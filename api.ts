import { obtainStorageFilePutUrl } from "@app/storage";

// @shared route
export const getUploadUrl = app.get(
  "/api/get-upload-url",
  async (ctx: app.Ctx, req: app.Req) => {
    try {
      // ( Про хардкод не я писал, а разработчик из Chatium ))
      // Временный хардкод для ссылки на загрузку
      // В продакшене нужно использовать метод obtainStorageFilePutUrl
      return {
        success: true,
        uploadUrl: "https://fs.chatium.io/upload?accountId=" + ctx.account.id,
      };

      const uploadUrl = await obtainStorageFilePutUrl(ctx);

      return {
        success: true,
        uploadUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  }
);
