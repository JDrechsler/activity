import { writable } from 'svelte/store';

export const count = writable(1);
export const firstname = writable('');
export const gender = writable('male');
