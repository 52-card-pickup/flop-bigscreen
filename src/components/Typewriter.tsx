import { onMount } from "solid-js";
import TypewriterCore from "typewriter-effect/dist/core";
import type {
  TypewriterClass,
  Options as TypewriterOptions,
} from "typewriter-effect";

type PropOptions = Exclude<
  TypewriterOptions,
  | "devMode"
  | "wrapperClassName"
  | "cursorClassName"
  | "onCreateTextNode"
  | "onRemoveNode"
>;

interface TypewriterProps extends PropOptions {
  children?: string;
  onInit?: (typewriter: TypewriterClass) => void;
}

export function Typewriter(props: TypewriterProps) {
  let elem: HTMLSpanElement;

  onMount(() => {
    const { onInit, children, ...remaining } = props;
    const options: Partial<PropOptions> = remaining;
    const values = props.children
      ? [props.children]
      : props.strings
      ? props.strings
      : null;

    const typewriter: TypewriterClass = values
      ? new TypewriterCore(elem, {
          strings: values,
          loop: true,
          autoStart: true,
          ...options,
        } satisfies TypewriterOptions)
      : new TypewriterCore(elem, {
          loop: true,
          ...options,
        } satisfies TypewriterOptions);

    onInit?.(typewriter);
  });

  return <span ref={elem}></span>;
}

export { TypewriterClass, TypewriterOptions };
