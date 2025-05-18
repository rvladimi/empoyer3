// @shared
import { Heap } from "@app/heap";

export const imagesTable = Heap.Table("pictures", {
  title: Heap.String(),
  description: Heap.String(),
  image: Heap.ImageFile(),
  rank: Heap.Number(),
});
