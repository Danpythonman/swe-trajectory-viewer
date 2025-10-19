import { TRAJECTORY_FILE_INPUT } from './ids';
import { render } from './trajectory';

function handleFileLoad(event: ProgressEvent<FileReader>): void {
    const result = event.target?.result;
    render(String(result));
}

function uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
        console.error('No file in input');
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', handleFileLoad);
    reader.readAsText(file);
}

export function setUpFileInput() {
    const fileInput = document.getElementById(TRAJECTORY_FILE_INPUT);
    if (!fileInput) {
        console.error('File input element does not exist');
        return;
    }
    fileInput.addEventListener('change', uploadFile);
}
