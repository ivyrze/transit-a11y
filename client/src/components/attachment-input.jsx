import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { AttachmentPopover } from '@components/attachment-popover';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { useFormWrapperStore } from '@hooks/store';

import '@assets/styles/components/attachment-input.scss';

export const AttachmentInput = props => {
    const { name = "attachments" } = props;
    
    const [
        files,
        setFiles,
        clearFiles
    ] = useFormWrapperStore(state => [
        state.files,
        state.setFiles,
        state.clearFiles
    ]);
    
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': []
        },
        onDrop: acceptedFiles => {
            setFiles(name, acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });
    
    const handleCleanup = file => URL.revokeObjectURL(file.preview);
    const handleDelete = file => setFiles(name, files[name].filter(comp => comp !== file));
    
    useEffect(() => {
        return () => {
            files[name]?.forEach(handleCleanup);
            clearFiles(name);
        };
    }, []);
    
    return (
        <ol className="attachment-input attachment-list">
            { files[name]?.map(file => (
                <li className="attachment" key={ file.preview }>
                    <img
                        src={ file.preview }
                        onLoad={ () => handleCleanup(file) }
                    />
                    <div className="attachment__actions">
                        <AttachmentPopover
                            name={ "attachmentsAlt[" + file.name + "]" }
                            isEditing={ true }
                        />
                        <Button
                            type="button"
                            className="button--overlay"
                            aria-label="Delete attachment"
                            onClick={ () => handleDelete(file) }
                        >
                            <Icon name="close" />
                        </Button>
                    </div>
                </li>
            )) }
            <li
                { ...getRootProps() }
                className="attachment-input__upload"
                role="button"
                aria-label="Choose files"
            >
                <input { ...getInputProps() } />
                <Icon name="upload" />
            </li>
        </ol>
    );
};