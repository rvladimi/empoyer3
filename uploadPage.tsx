// @shared
import { jsx } from "@app/html-jsx";
import { UiHtmlLayout } from "@html/layout";
import Styles from "./style.css";
import { Upload } from "./Upload";
import { rankPage } from "./rankPage";

// @shared-route
export const uploadPage = app.html("/", async (ctx, req) => {
  return (
    <UiHtmlLayout>
      <Upload ctx={ctx} />
      <Styles />
    </UiHtmlLayout>
  );
});
