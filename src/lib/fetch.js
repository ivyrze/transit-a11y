import { error } from "@sveltejs/kit";

export const jsonFetch = async options => {
    const {
        url,
        body,
        fetch: svelteFetch = fetch,
        ...passthroughOptions
    } = options;

    const response = await svelteFetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options?.headers
        },
        body: JSON.stringify(body),
        ...passthroughOptions
    });

    if (response.status != 200) {
        return error(response.status);
    }

    return await response.json();
};

export const formDataFetch = async options => {
    const {
        form,
        url = form.action,
        method = form.method,
        ...passthroughOptions
    } = options;

    const body = new FormData(form);
    for (const [ key, value ] of body) {
        if (value instanceof File && value.size === 0) {
            body.delete(key);
        } else if (value instanceof File && value.size > 4 * 1024**2) {
            alert("Files over 4MB are not supported (for now!)"); return;
        }
    }

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            ...options?.headers
        },
        method,
        body,
        ...passthroughOptions
    });

    if (response.status != 200 && response.status != 400) {
        return error(response.status);
    }

    return await response.json();
};