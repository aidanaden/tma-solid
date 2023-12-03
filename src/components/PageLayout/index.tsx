import { Component, ComponentProps, splitProps } from "solid-js";
import { cn } from "../../utils/cn";

export const PageLayout: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class", "classList", "children"]);
  return (
    <div class={cn("p-3", props.class, props.classList)} {...rest}>
      {props.children}
    </div>
  );
};
