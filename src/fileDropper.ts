import { FILE_HOVERING } from './classes';
import { TRAJECTORY_FILE_INPUT, FILE_INPUT_LABEL } from './ids';

function prevent(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export function setUpFileDropper() {
    const fileInput = document.getElementById(TRAJECTORY_FILE_INPUT);
    if (!fileInput) {
        console.error('File input element does not exist');
        return;
    }

    const fileInputLabel = document.getElementById(FILE_INPUT_LABEL);
    if (!fileInputLabel) {
        console.error('File input label element does not exist');
        return;
    }

    fileInputLabel.addEventListener('dragenter', (e: DragEvent) => {
        prevent(e);
        fileInputLabel.classList.add(FILE_HOVERING);
    });
    fileInputLabel.addEventListener('dragover', (e: DragEvent) => {
        prevent(e);
        fileInputLabel.classList.add(FILE_HOVERING);
    });

    fileInputLabel.addEventListener('dragleave', (e: DragEvent) => {
        prevent(e);
        fileInputLabel.classList.remove(FILE_HOVERING);
    });
    fileInputLabel.addEventListener('drop', (e: DragEvent) => {
        prevent(e);
        fileInputLabel.classList.remove(FILE_HOVERING);

        const first = e.dataTransfer?.files?.[0] ?? null;
        if (!first) {
            alert('No file uploaded');
            return;
        }

        const dt = new DataTransfer();
        dt.items.add(first);
        (fileInput as HTMLInputElement & { files: FileList }).files = dt.files;

        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Block the page from navigating on file drops outside the zone
    window.addEventListener('dragover', (e: DragEvent) => e.preventDefault());
    window.addEventListener('drop', (e: DragEvent) => e.preventDefault());
}
