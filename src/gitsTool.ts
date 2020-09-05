const styleRuleInsertLog: WeakMap<Document, boolean> = new WeakMap();
export class GistTools {
  public static getInstance(element: HTMLDivElement): GistTools | null {
    GistTools.insertStyleRule();
    const files: OneFile[] = [];
    for (let e of element.children) {
      if (!e.classList.contains("gist-file") || !(e instanceof HTMLDivElement)) {
        return null;
      }
      files.push(new OneFile(e));
    }
    return new GistTools(files);
  }
  /** documentにcssのルールを定義する。何度呼んでも良い */
  private static insertStyleRule() {
    if (styleRuleInsertLog.has(document)) {
      return;
    }
    styleRuleInsertLog.set(document, true);
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleEl.sheet.insertRule(".gist .header{display:flex;font-size: 12px;align-items: center;}");
    styleEl.sheet.insertRule(".gist .header >* {padding:0 3px;}");
    styleEl.sheet.insertRule(".gist .header .filename{font-family: monospace;padding:0 10px;}");
    styleEl.sheet.insertRule(".gist .header .space{flex:1 1 0;}");
    styleEl.sheet.insertRule(".gist .header button{line-height: 13px;}");
    styleEl.sheet.insertRule(".gist .gist-data{border-radius:0 0 6px 6px !important;}");
    styleEl.sheet.insertRule(".gist .blob-num{line-height: 13px !important;}");
    styleEl.sheet.insertRule(".gist .blob-code{line-height: 13px !important;}");
  }
  private constructor(private readonly files: OneFile[]) {
  }
}
class OneFile {
  /** ファイル名 */
  private fileName: string;
  /** ファイルへのリンク https://gist.github.com/xxxx/xxxx#xxxx */
  private fileLink: string;
  /** ファイルの中身への直リンク https://gist.githubusercontent.com/xxxxx/xxxxxx/raw/xxxx/xxx.txt */
  private fileRawLink: string;
  /** レポジトリ自体へのリンク。 https://gist.github.com/xxxxx/xxxx */
  private repoLink: string;
  /** gistのID。16進数のハッシュ値 */
  private gistId: string;
  private textValue: string;
  constructor(private readonly element: HTMLDivElement) {
    const footerData = this.getFooterData(element.querySelector(".gist-meta"));
    this.fileName = footerData.fileName;
    this.fileLink = footerData.fileLink;
    this.fileRawLink = footerData.fileRawLink;
    this.repoLink = footerData.repoLink;
    this.gistId = footerData.gistId;
    this.textValue = this.getInnerText(element.querySelector(".gist-data"));
    const topBrotherElement = document.createElement("div");
    topBrotherElement.classList.add("header");
    topBrotherElement.innerHTML = `
    <div class="filename">hoge.txt</div>
    <div class="space"></div>
    <a class="file-link" href="http://example.com">file</a>
    <a class="raw-link" href="http://example.com">raw</a>
    <a class="repo-link" href="http://example.com">repo</a>
    <a class="edit-link" href="http://example.com">edit</a>
    <button filename>filename</button>
    <button text>text</button>
    <button git-clone>git clone command</button>
    <button download-zip-repo style="display:none;">download zip repo</button>
    `;
    topBrotherElement.querySelector<HTMLElement>(".filename").innerText = this.fileName;
    topBrotherElement.querySelector<HTMLAnchorElement>(".file-link").href = this.fileLink;
    topBrotherElement.querySelector<HTMLAnchorElement>(".raw-link").href = this.fileRawLink;
    topBrotherElement.querySelector<HTMLAnchorElement>(".repo-link").href = this.repoLink;
    topBrotherElement.querySelector<HTMLAnchorElement>(".edit-link").href = this.repoLink + "/edit";
    topBrotherElement.querySelector<HTMLButtonElement>("[filename]").setAttribute("title", this.fileName);
    topBrotherElement.querySelector<HTMLButtonElement>("[filename]").addEventListener("click", () => { this.copyText(this.fileName); })
    topBrotherElement.querySelector<HTMLButtonElement>("[text]").setAttribute("title", this.textValue);
    topBrotherElement.querySelector<HTMLButtonElement>("[text]").addEventListener("click", () => { this.copyText(this.textValue); })
    topBrotherElement.querySelector<HTMLButtonElement>("[git-clone]").setAttribute("title", `git clone git@gist.github.com:${this.gistId}.git .`);
    topBrotherElement.querySelector<HTMLButtonElement>("[git-clone]").addEventListener("click", () => { this.copyText(`git clone git@gist.github.com:${this.gistId}.git .`); })
    topBrotherElement.querySelector<HTMLButtonElement>("[download-zip-repo]").setAttribute("title", `download zip file`);
    topBrotherElement.querySelector<HTMLButtonElement>("[download-zip-repo]").addEventListener("click", () => { alert("wip") })
    element.insertBefore(topBrotherElement, element.children[0]);
    // hide footer
    element.querySelector<HTMLElement>(".gist-meta")!.style.display = "none";
  }
  private getInnerText(bodyElement: HTMLElement) {
    return bodyElement.innerText.split(/\n/).map(a => {
      return a.replace(/^\t/, "");
    }).join("\n");
  }
  private copyText(text: string) {
    navigator.clipboard.writeText(text);
  }
  /** 元のgistのfooterのエレメントから必要な情報を返す */
  private getFooterData(footerElement: HTMLDivElement) {
    const fileRawLink = footerElement.children[0].getAttribute("href");
    if (fileRawLink == null) { throw new Error(); }
    let m: RegExpMatchArray;
    if (!(m = fileRawLink.match(/(^.+?gist\.github\.com\/.+?)\/raw\//))) {
      throw new Error();
    }
    const repoLink = m[1];
    if (!(m = repoLink.match(/(\w+)$/))) {
      throw new Error("gist hash id not found");
    }
    const gistId = m[1];
    const fileLink = (footerElement.children[1] as HTMLAnchorElement).href;
    const fileName = (footerElement.children[1] as HTMLElement).innerText
    return { fileRawLink, repoLink, gistId, fileName, fileLink };
  }
}
