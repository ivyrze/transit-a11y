import ms from 'ms';
import { getStatePriority } from '$lib/a11y-states';

export const seconds = milliseconds => ms(milliseconds) / 1000;

export const uniqueId = prefix => {
    const uuid = crypto.randomUUID().slice(0, 5);
    return `${prefix}-${uuid}`;
};

export const statePrioritySort = (a, b) => {
    return getStatePriority(a) - getStatePriority(b);
};