import React from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css'

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
    
    const children = images.map(image => {
        return props => {
            return pug`img(
                src=image.small.url
                ref=props.ref
                onClick=props.open
            )`;
        };
    });
    
    return pug`
        Gallery(options={
            mainClass: 'image-gallery',
            bgOpacity: 1,
            arrowPrev: false,
            arrowNext: false,
            padding: { top: 40, right: 15, bottom: 40, left: 15 },
            wheelToZoom: true
        })
            .attachment-list
                for child, index in children
                    Item(
                        key=index
                        children=child
                        original=images[index].large.url
                        thumbnail=images[index].small.url
                        width=images[index].large.width
                        height=images[index].large.height
                    )
    `;
};