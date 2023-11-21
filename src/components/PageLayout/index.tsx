import { Component, ComponentProps, splitProps } from "solid-js";

export const PageLayout: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["children"]);
  return (
    <div class="p-3 bg-neutral-100 text-neutral-800" {...others}>
      {local.children}
    </div>
  );
};
