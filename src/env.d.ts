export declare namespace PDF {
  interface Page {
    pageIndex: any;
    pageInfo: any;
    getTextContent: (opts: any) => Promise<PageContent>;
    // items: PageEntry;
    // styles: any;
    // getTextContent: () =>
  }

  interface PageContent {
    items: ContentItem[];
  }

  interface ContentItem {
    str: string;
    dir: string;
    width: number;
    height: number;
    transform: any[];
    fontName: string;
  }
}
