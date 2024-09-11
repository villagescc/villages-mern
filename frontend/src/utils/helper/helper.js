
import { v4 as UIDV4 } from 'uuid';
export const generate16CharacterKey = () => {
    const uuid = UIDV4().replace(/-/g, ''); // Remove hyphens
    return uuid.slice(0, 16); // Get the first 16 characters
};

// Function to generate a 32-character key using uuidv4
export const generate32CharacterKey = () => {
    const uuid1 = UIDV4().replace(/-/g, ''); // Remove hyphens from the first UUID
    const uuid2 = UIDV4().replace(/-/g, ''); // Remove hyphens from the second UUID
    return (uuid1 + uuid2).slice(0, 32); // Concatenate and slice to get 32 characters
};


export function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        function () {
            console.log('Text copied to clipboard: ', text);
        },
        function (err) {
            console.error('Failed to copy text to clipboard: ', err);
        }
    );
}
