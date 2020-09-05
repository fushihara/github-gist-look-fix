import { GistTools } from "./gitsTool";

init();
function init() {
  const elments = document.querySelectorAll(".gist");
  for (let element of elments) {
    if (element instanceof HTMLDivElement) {
      GistTools.getInstance(element);
    }
  }
}