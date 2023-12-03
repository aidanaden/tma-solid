import { Component, ComponentProps, splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import { useThemeParams } from "@tma.js/sdk-solid";

export const PageLayout: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class", "classList", "children"]);
  const theme = useThemeParams();
  return (
    <div
      class={cn("p-3", props.class, props.classList)}
      style={{
        color: theme().textColor,
        background: theme().backgroundColor,
      }}
      {...rest}
    >
      {props.children}
    </div>
  );
};
