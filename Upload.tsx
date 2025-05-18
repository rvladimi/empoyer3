// @shared
import { createSignal, Show, jsx, createSolidComponent } from "@app/solid-js";
import { getUploadUrl } from "../api";
import { getThumbnailUrl } from "@app/storage";
import { Input, Textarea } from "@solid/ui";
import { imagesTable } from "./imagesTable";

const submitData = app.post("submit", async (ctx, req) => {
  await imagesTable.create(ctx, {
    title: req.body.name,
    description: req.body.description,
    image: req.body.image,
    rank: req.body.rank,
  });
});

export const Upload = createSolidComponent((props: { ctx: app.Ctx }) => {
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [statusMessage, setStatusMessage] = createSignal<string>("");
  const [uploadedFileHash, setUploadedFileHash] = createSignal<string>("");

  const onFileSelected = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setStatusMessage(`Выбран файл: ${event.target.files[0]?.name}`);
  };

  const uploadFile = async () => {
    const file = selectedFile();
    if (!file) {
      setStatusMessage("Пожалуйста, выберите файл");
      return;
    }

    try {
      setStatusMessage("Получение URL для загрузки...");

      // Вызываем маршрут с помощью апи метода
      const data = await getUploadUrl.run(ctx);

      if (!data.success || !data.uploadUrl) {
        throw new Error(data.error || "Не удалось получить URL для загрузки");
      }

      setStatusMessage("Загрузка файла...");

      // Загружаем файл на полученный URL
      const formData = new FormData();
      formData.append("Filedata", file);

      const response = await fetch(data.uploadUrl, {
        method: "post",
        body: formData,
      });

      const hash = await response.text();
      const button = document.getElementById("submit-button");
      if (hash && button) {
        button?.setAttribute("disabled", "");
        button.style.cursor = "not-allowed";
      }

      const pictureName = document.getElementById("pictureName")?.value || "";
      const description =
        document.getElementById("pictureDescription")?.value || "";
      const pictureData = {
        name: pictureName,
        description: description,
        image: hash,
        rank: 1200,
      };

      await submitData.run(ctx, pictureData);

      setUploadedFileHash(hash);
      setStatusMessage("Картинка успешно загружена!");
    } catch (error: any) {
      setStatusMessage(`Ошибка: ${error.message}`);
      console.error("Ошибка загрузки:", error);
    }
  };

  return (
    <div class="wrapper upload-container">
      <div class="content-block">
        <div class="header-name">Загрузите картинку</div>
        <input
          class="centered"
          type="file"
          accept="image/*"
          onChange={onFileSelected}
        />
      </div>

      <div class="centered">{statusMessage()}</div>

      <Show when={uploadedFileHash()}>
        <div class="centered">
          <img
            src={getThumbnailUrl(ctx, uploadedFileHash(), 300, 200)}
            alt="Thumbnail"
          />
        </div>
      </Show>

      <div class="content-block">
        <div class="header-name">Название картинки</div>
        <Input id="pictureName" class="centered" />
      </div>

      <div class="content-block">
        <div class="header-name">Описание картинки</div>
        <Textarea id="pictureDescription" class="centered" autosize={true} />
      </div>

      <div class="buttons">
        <button
          id="submit-button"
          onClick={uploadFile}
          disabled={!selectedFile()}
          data-primary="true"
        >
          отправить
        </button>

        <a href="https://rvladimi.chatium.com/rankPage">
          общий рейтинг картинок
        </a>

        <a href="https://rvladimi.chatium.com/index">голосование</a>
      </div>
    </div>
  );
});
