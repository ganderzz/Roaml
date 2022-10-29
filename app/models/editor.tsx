import * as React from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";

type Props = {
  initialValue?: Descendant[];
  readOnly?: boolean;
  onChange?: (value: Descendant[]) => void;
};

export const INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export const Editor = ({
  initialValue = INITIAL_VALUE,
  readOnly = false,
  onChange,
}: Props) => {
  const [editor] = React.useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} value={initialValue} onChange={onChange}>
      <Editable
        className={`h-full min-h-max ${readOnly ? "" : "cursor-text"} rounded`}
        placeholder={readOnly ? "" : "Enter content..."}
        readOnly={readOnly}
      />
    </Slate>
  );
};
