import * as React from "react";

type Props = {
  buttonType?: "default" | "primary" | "error";
} & React.PropsWithChildren<React.HTMLProps<HTMLButtonElement>>;

export const Button = ({
  children,
  buttonType = "default",
  ...rest
}: Props) => {
  let buttonClassNames = "rounded py-2 px-4  transition-colors";

  if (buttonType === "primary") {
    buttonClassNames = `${buttonClassNames} bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-400`;
  } else if (buttonType === "error") {
    buttonClassNames = `${buttonClassNames} bg-red-300 text-gray-600 hover:bg-red-100 focus:bg-red-400"`;
  } else {
    buttonClassNames = `${buttonClassNames} bg-gray-500 text-white hover:bg-gray-600 focus:bg-gray-400`;
  }

  return (
    <button className={buttonClassNames} {...rest}>
      {children}
    </button>
  );
};
