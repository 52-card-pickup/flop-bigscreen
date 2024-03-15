import { children } from "solid-js";

export function FlopContainer(props) {
    const safeChildren = children(() => props.children);

    return (
        <div
            class="flex flex-col justify-center items-center gap-4"
            data-component-name="FlopContainer"
        >
            <h1 class="text-4xl font-bold my-6 shadow-sm text-center">flop.</h1>
            {safeChildren()}
        </div>
    );
}
