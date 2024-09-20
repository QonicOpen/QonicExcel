export default function classNames(
    ...classes: (string | false | undefined | null)[]
) {
    return classes.filter(Boolean).join(' ')
}
