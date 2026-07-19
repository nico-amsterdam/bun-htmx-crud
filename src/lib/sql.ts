export function toLikePattern(input: string): string {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/\*/g, '%')
        .replace(/\?/g, '_')
}
