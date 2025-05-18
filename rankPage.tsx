// @shared
import { jsx } from "@app/html-jsx";
import { imagesTable } from "./imagesTable";
import { UiHtmlLayout } from "@html/layout";
import Styles from "./style.css";

// @shared-route
export const rankPage = app.html("/", async (ctx, req) => {
  const items = await imagesTable.findAll(ctx);

  // сортировка исходных данных почему-то не работает
  // const items = await imagesTable.findAll(ctx, {
  //   orderBy: [{ field: 'rank', direction: 'desc' }]
  // });

  const compareFn = (a, b) => b.rank - a.rank;
  items.sort(compareFn);

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
        <div class="wrapper">
          <div class="header-name">Рейтинг картинок</div>
          <div class="pictures">
            {items.map((item) => (
              <div>
                <img src={item.image?.getThumbnailUrl(300, 200)} />
                <div class="card-title">{item.title}</div>
                <div class="card-description">{item.description}</div>
              </div>
            ))}
          </div>

          <div class="buttons">
            <button onclick={ctx.account.navigate("/")}>Голосовать</button>
            <button onclick={ctx.account.navigate("/uploadPage")}>
              Участвовать в рейтинге
            </button>
          </div>
        </div>
      </body>
      <Styles />
    </UiHtmlLayout>
  );
});
