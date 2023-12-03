import { Link as RouterLink, LinkProps } from "@solidjs/router";
import { splitProps } from "solid-js";

import { cn } from "../../utils/cn";
import styles from "./styles.module.css";

export function Link(props: LinkProps) {
  const [, rest] = splitProps(props, ["class", "classList"]);
  return (
    <RouterLink
      class={cn(props.class, props.classList, { [styles.root]: true })}
      {...rest}
    />
  );
}
