import { upload } from "@vercel/blob/client";
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

export const formAttachmentFetch = async options => {
    const { form, ...passthroughOptions } = options;

    const body  = new FormData(form);
    const attachmentBody = new FormData();

    let cleanupKeys = [];
    for (const [ key, value ] of body) {
        if (key == 'attachments' || key.startsWith('attachmentsAlt')) {
            attachmentBody.append(key, value);
            cleanupKeys.push(key);
        }
    }
    cleanupKeys.forEach(key => body.delete(key));

    const response = await formDataFetch({
        form,
        body,
        ...passthroughOptions
    });

    const attachments = attachmentBody.getAll('attachments').filter(file => file.size);
    if (!attachments.length) { return response; }

    try {
        await Promise.all(attachments.map(async attachment => {
            const extension = attachment.type.split('/')[1];
            const path = 'original/' + crypto.randomUUID() + '.' + extension;

            return await upload(path, attachment, {
                access: 'public',
                handleUploadUrl: '/api/upload-attachment',
                clientPayload: JSON.stringify({
                    id: response.id,
                    alt: attachmentBody.get('attachmentsAlt[' + attachment.name + ']')
                })
            });
        }));
    } catch {
        return { errors: { attachments: 'Error uploading attachments' }};
    }

    return response;
};