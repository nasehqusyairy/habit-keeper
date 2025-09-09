export function formToObj<T>(formData: FormData): T {
    const obj = {} as T;
    formData.forEach((value, key) => {
        // @ts-ignore
        obj[key] = value;
    });
    return obj;
}