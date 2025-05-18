import { jsx } from "@app/html-jsx";
import { UiHtmlLayout } from "@html/layout";
import Styles from "./style.css";

export const ok = app.html("/", async (ctx, req) => {
  return (
    <UiHtmlLayout>
      <head>
        <title>Up or Down</title>
        <meta
          charset="utf-8"
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </head>
      <body>
        <div class="wrapper ok">
          <div class="ok-content">
            <div class="ok-message">Ваш голос принят!</div>
          </div>

          <div class="buttons">
            <button onclick={ctx.account.navigate("/")}>Голосовать еще</button>
            <button onclick={ctx.account.navigate("/uploadPage")}>
              Участвовать в рейтинге
            </button>
            <button onclick={ctx.account.navigate("/rankPage")}>
              Общий рейтинг картинок
            </button>
          </div>
        </div>
      </body>
      <Styles />
    </UiHtmlLayout>
  );
});
