import { PrismaClient } from '@prisma/client';
import gravatar from 'gravatar';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getStatePriority } from '../a11y-states.js';

export const prisma = new PrismaClient().$extends({
    result: {
        stop: {
            agencyId: {
                needs: { id: true },
                compute: stop => {
                    return stop.id.split("-")[0];
                }
            }
        },
        route: {
            agencyId: {
                needs: { id: true },
                compute: route => {
                    return route.id.split("-")[0];
                }
            }
        },
        reviewAttachment: {
            filename: {
                needs: { id: true, type: true },
                compute: attachment => {
                    return attachment.id + '.' + attachment.type.split('/')[1];
                }
            }
        },
        user: {
            avatar: {
                needs: { email: true },
                compute: user => {
                    const options = { size: 200, protocol: 'https', default: 'mp' };
                    return gravatar.url(user.email, options);
                }
            }
        }
    },
    model: {
        stop: {
            consensus: async id => {
                let reviews = (await prisma.stop.findUnique({
                    select: {
                        reviews: { select: {
                            accessibility: true,
                            tags: true,
                            timestamp: true
                        } }
                    },
                    where: {
                        id
                    }
                })).reviews;
                let tags = reviews.map(review => review.tags).flat();
                
                // Use state with the biggest consensus or most recent timestamp
                // to determine the overall accessibility
                let states = reviews.reduce((result, current) => {
                    current.accessibility.forEach(state => {
                        if (state == 'unknown') { return; }
                        
                        result[state] ??= {
                            count: 0,
                            priority: getStatePriority(state)
                        };
                        result[state].count++;
                        result[state].timestamp = Math.max(
                            new Date(result[state]?.timestamp ?? 0),
                            new Date(current.timestamp)
                        );
                    });
                    
                    return result;
                }, {});
                
                states = Object.entries(states);
                states.sort((a, b) => {
                    return (b[1].count - a[1].count) ||
                        (b[1].timestamp - a[1].timestamp) ||
                        (a[1].priority - b[1].priority);
                });
                
                const accessibility = states[0]?.[0] ?? 'unknown';
                
                // Mark any accessibility features that have over 75% consensus
                const frequencies = tags.reduce((result, current) => {
                    result[current] = result[current] ? ++result[current] : 1;
                    return result;
                }, {});
                
                tags = tags.filter(tag => (frequencies[tag] / reviews.length) >= 0.75);
                tags = [ ...new Set(tags) ];
                
                // Update the stop object with consensus values
                const newValues = { accessibility, tags };
                await prisma.stop.update({
                    data: newValues,
                    where: { id }
                });
                
                return newValues;
            }
        },
        review: {
            cleanupAndDelete: async id => {
                const review = await prisma.review.findUnique({
                    select: { attachments: { select: { id: true } } },
                    where: { id }
                });
                await Promise.all(review.attachments.map(attachment => {
                    return prisma.reviewAttachment.cleanupAndDelete(attachment.id);
                }));
                await prisma.review.delete({ where: { id } });
            }
        },
        reviewAttachment: {
            cleanupAndDelete: async id => {
                const { filename } = await prisma.reviewAttachment.findUnique({
                    select: { filename: true },
                    where: { id }
                });
                
                const client = new S3Client();
                const qualities = [ 'original', 'large', 'small' ];
                await Promise.all(qualities.map(quality => {
                    return client.send(new DeleteObjectCommand({
                        Key: quality + '/' + filename,
                        Bucket: process.env.AWS_BUCKET_NAME
                    }));
                }))
                
                await prisma.reviewAttachment.delete({ where: { id } });
            }
        }
    }
});