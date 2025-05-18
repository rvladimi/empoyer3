// @shared
import { jsx } from "@app/html-jsx";
import { imagesTable } from "./imagesTable";
import { UiHtmlLayout } from "@html/layout";
import Styles from "./style.css";
import { ok } from "./ok";

function random(min: number, max: number) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// @shared-route
export const mainPage = app.html("/", async (ctx, req) => {
  const items = await imagesTable.findAll(ctx);
  const index1 = random(0, items.length - 1);
  let index2 = random(0, items.length - 1);
  while (index1 === index2) {
    index2 = random(0, items.length - 1);
  }

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
          <div class="header-name">Кликните лучшую картинку</div>
          <div class="pictures">
            <form method={"post"} action={editSubmitRoute.url()}>
              <button type="submit">
                <div class="card">
                  <img src={items[index1].image?.getThumbnailUrl(300, 200)} />
                  <div class="card-info">
                    <div class="card-title">{items[index1].title}</div>
                    <div class="card-description">
                      {items[index1].description}
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name="winnerId"
                    value={items[index1].id}
                  />
                  <input
                    type="hidden"
                    name="winnerRank"
                    value={items[index1].rank}
                  />
                  <input
                    type="hidden"
                    name="loserId"
                    value={items[index2].id}
                  />
                  <input
                    type="hidden"
                    name="loserRank"
                    value={items[index2].rank}
                  />
                </div>
              </button>
            </form>

            <form method={"post"} action={editSubmitRoute.url()}>
              <button type="submit">
                <div class="card">
                  <img src={items[index2].image?.getThumbnailUrl(300, 200)} />
                  <div class="card-info">
                    <div class="card-title">{items[index2].title}</div>
                    <div class="card-description">
                      {items[index2].description}
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name="winnerId"
                    value={items[index2].id}
                  />
                  <input
                    type="hidden"
                    name="winnerRank"
                    value={items[index2].rank}
                  />
                  <input
                    type="hidden"
                    name="loserId"
                    value={items[index1].id}
                  />
                  <input
                    type="hidden"
                    name="loserRank"
                    value={items[index1].rank}
                  />
                </div>
              </button>
            </form>
          </div>

          <div class="buttons">
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

const editSubmitRoute = app.apiCall("/submit", async (ctx, req) => {
  const winnerRank = Number(req.body.winnerRank);
  const loserRank = Number(req.body.loserRank);

  const winnerPredictedRank =
    1 / (1 + Math.pow(10, (loserRank - winnerRank) / 400));
  let winner_K = 40;
  if (winnerRank >= 2400) winner_K = 10;
  if (winnerRank < 2400) winner_K = 20;
  if (winnerRank === 1200) winner_K = 40;
  const winnerNewRank = winnerRank + winner_K * (1 - winnerPredictedRank);

  const loserPredictedRank =
    1 / (1 + Math.pow(10, (winnerRank - loserRank) / 400));
  let loser_K = 40;
  if (loserRank >= 2400) loser_K = 10;
  if (loserRank < 2400) loser_K = 20;
  if (loserRank === 1200) loser_K = 40;
  const loserNewRank = loserRank - loser_K * loserPredictedRank;

  await imagesTable.update(ctx, {
    id: req.body.winnerId,
    rank: winnerNewRank,
  });

  await imagesTable.update(ctx, {
    id: req.body.loserId,
    rank: loserNewRank,
  });

  return ctx.resp.redirect(ok.url());
});
