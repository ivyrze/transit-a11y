import React from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { Button } from '@components/button';

import 'photoswipe/dist/photoswipe.css'
import '@assets/styles/components/attachment-viewer.scss';

export const AttachmentViewer = props => {
    const { attachments } = props;
    
    const qualities = [ 'large', 'small' ];
    
    const images = attachments.map(attachment => {
        let sizes = {};
        qualities.forEach(quality => {
            sizes[quality] = attachment.sizes.find(size => size.quality === quality);
            sizes[quality].url = "/api/attachment/" + quality + "/" + attachment.filename;
        });
        
        return sizes;
    });
    
    return (
        <Gallery options={{
            mainClass: 'image-gallery',
            bgOpacity: 1,
            arrowPrev: false,
            arrowNext: false,
            padding: { top: 40, right: 15, bottom: 40, left: 15 },
            wheelToZoom: true
        }} >
            <div className="attachment-list">
                { images.map((image, index) => (
                    <Item
                        key={ index }
                        original={ image.large.url }
                        thumbnail={ image.small.url }
                        width={ image.large.width }
                        height={ image.large.height }
                    >
                        { props => (
                            <Button
                                onClick={ props.open }
                                aria-label="Enlarge image attachment"
                            >
                                <img
                                    src={ image.small.url }
                                    ref={ props.ref }
                                />
                            </Button>
                        ) }
                    </Item>
                )) }
            </div>
        </Gallery>
    );
};