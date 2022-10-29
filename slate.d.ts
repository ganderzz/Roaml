export * from "slate";

export type CustomText = {
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
};

export type Paragraph = { type: "paragraph"; children: CustomText[] };

export type Elements = Paragraph;

declare module "slate" {
  interface CustomTypes {
    Element: Elements;
    Text: CustomText;
  }
}
