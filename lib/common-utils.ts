
export function isValidUrl(val?: string) {
    try {
        if (!val) return false;
        new URL(val);
        return true;
    } catch (e) {
        return false;
    }
}

export function getExtensionFromMimeType(mimeType: string) {
    if (!mimeType) {
        return ''; // Handle cases where mimeType is not available
    }
    const parts = mimeType.split('/');
    if (parts.length > 1) {
        const subtype = parts[1];
        // Basic mapping for common types
        switch (subtype) {
            case 'plain': return 'txt';
            case 'jpeg': return 'jpg';
            case 'png': return 'png';
            case 'gif': return 'gif';
            case 'pdf': return 'pdf';
            case 'svg+xml': return 'svg';
            // Add more mappings as needed
            default: return subtype; // Use subtype as extension if no specific mapping
        }
    }
    return '';
}
