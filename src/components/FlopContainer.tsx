import { children } from "solid-js";
import { FlopBrandLogoText } from "./FlopBrandLogoText";

export function FlopContainer(props) {
  const safeChildren = children(() => props.children);

  return (
    <div
      class="grid justify-center items-center gap-4 relative"
      data-component-name="FlopContainer"
    >
      <FlopBrandLogoText class="absolute left-8 bottom-6 w-16 xl:w-24" />
      {safeChildren()}
    </div>
  );
}
