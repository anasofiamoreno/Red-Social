import { pages } from '../lib/templates.js';

export const obj_main = document.createElement('main');

export function fnPageSignUp() {
    window.history.pushState({}, '', pages.singUp.path);
}
