export default function cn(
    className: string,
    ...args: (string | boolean | undefined)[]
): string {
    return [className, ...args].filter(Boolean).join(" ");
}
