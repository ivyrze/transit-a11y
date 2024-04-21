import { useRef, useCallback } from 'react';
import { Stack, TextArea, Button } from '@sanity/ui';
import { set, unset } from 'sanity';

export const ShapeInput = props => {
    const { elementProps, onChange, value = "" } = props;

    const fileInputRef = useRef();

    const setValue = useCallback(value => {
        onChange(value ? set(value) : unset());
    }, [ onChange ]);

    const handleInputChange = useCallback(event => {
        setValue(event.currentTarget.value);
    }, [ setValue ]);

    const handleFileChange = useCallback(async event => {
        const files = await event.currentTarget.files;
        if (!files?.length) { return; }

        const geojson = JSON.parse(await files[0].text());

        // Combine multi-line string into single line, and
        // put it into a new feature GeoJSON
        const lineString = geojson.features[0].geometry.coordinates.flat();

        const feature = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: lineString
            }
        };

        console.log(event, feature);
        setValue(JSON.stringify(feature));
    }, [ setValue ]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <Stack space={2}>
            <TextArea
                { ...elementProps }
                onChange={ handleInputChange }
                value={ value }
            />
            <Button
                text="Import from Felt file"
                onClick={ handleClick }
            />
            <input
                ref={ fileInputRef }
                onChange={ handleFileChange }
                type="file"
                accept=".geojson,.json"
                hidden
            />
        </Stack>
    );
};