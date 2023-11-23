import { Component, ComponentProps, splitProps } from "solid-js";

export const PageLayout: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["children"]);
  return (
    <div class="p-3" {...others}>
      {local.children}
    </div>
  );
};
