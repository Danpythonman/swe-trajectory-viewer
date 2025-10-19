import { TRAJECTORY_TEXT_INPUT } from './ids';
import { render } from './trajectory';

function uploadText(event: Event): void {
    const input = event.target as HTMLInputElement;
    const text = input.value;
    if (!text) {
        console.error('No text in input');
        return;
    }
    render(String(text));
}

export function setUpTextInput() {
    const textInput = document.getElementById(TRAJECTORY_TEXT_INPUT);
    if (!textInput) {
        console.error('File input element does not exist');
        return;
    }
    textInput.addEventListener('input', uploadText);
}
