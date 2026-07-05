import { getExtensionFromMimeType, isValidUrl } from '@/lib/common-utils';
import { IUploadFileCloudResult } from '@/lib/types';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const DEFAULT_CONTAINER = 'images';

class CdnService {

    readonly BasePath = 'rajni-jewel';
    readonly DefaultContainer = 'rajni-jewel-partner';

    getSasUrl() {
        return process.env.NEXT_PUBLIC_CDN_SAS_URL || '';
    }

    getCdnUrl() {
        return process.env.NEXT_PUBLIC_CDN_URL || '';
    }

    public getContainerClient = (tenantCode: string, containerName = DEFAULT_CONTAINER): ContainerClient => {
        const blobServiceClient = new BlobServiceClient(this.getSasUrl());
        const containerClient = blobServiceClient.getContainerClient(`${this.BasePath}/` + tenantCode + '/' + containerName);
        return containerClient;
    }

    public async uploadFileToCloud(tenantCode: string, file: File, containerName?: string): Promise<IUploadFileCloudResult> {

        try {
            const getExt = (fileName?: string): string => {
                const parts = fileName?.split('.') || [];
                return parts.length > 1 ? parts[parts.length - 1] : '';
            }

            let ext = getExt(file.name);
            if (!ext) {
                ext = getExtensionFromMimeType(file.type) || '.png';
            }

            const blobName = 'img-' + new Date().getTime() + (ext ? '.' + ext : '');

            const containerClient = cdnService.getContainerClient(tenantCode, containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const res = await blockBlobClient.uploadData(file);

            return {
                blobName,
                isUploaded: true,
                url: this.toImageUrl(tenantCode, blobName, containerName)
            };

        } catch (error) {
            console.log('Failed to uploadFileToCloud', error);
            throw error
        }
    }

    public async uploadMultipleFilesToCloud(tenantCode: string, files: File[], containerName?: string): Promise<IUploadFileCloudResult[]> {

        const results: IUploadFileCloudResult[] = [];
        for (const file of files) {
            try {
                const res = await this.uploadFileToCloud(tenantCode, file, containerName);
                results.push(res);
            } catch (ex) {
                console.log(ex)
                results.push({
                    blobName: "",
                    url: ""
                })
            }
        }
        return results;
    }

    public toImageUrl(tenantCode: string, fileName: string, containerName = DEFAULT_CONTAINER) {
        return `${this.getCdnUrl()}/${this.BasePath}/${tenantCode}/${containerName}/${fileName}`;
    }

    /// PendingUpload
    PendingUploadHash: Record<string, File[]> = {};
    public setPendingUploads(key: string, e: File[]) {
        this.PendingUploadHash[key] = e;
    }
    public async completePendingUploads(tenantCode: string, key: string, containerName?: string) {
        return await this.uploadMultipleFilesToCloud(tenantCode, this.PendingUploadHash[key] || [], containerName);
    }
    public clearPendingUploads(key: string) {
        delete this.PendingUploadHash[key];
    }
    //----  PendingUpload

    public async getBlobFromObjectURL(objectURL: string) {
        try {
            const response = await fetch(objectURL);
            const blob = await response.blob();
            return blob as File;
        } catch (error) {
            console.error("Error fetching blob from object URL:", error);
            return null;
        }
    }
    public async uploadObjectUrls(tenantCode: string, files?: string[], containerName?: string): Promise<IUploadFileCloudResult[] | undefined> {
        if (!files?.length) return;

        const results: IUploadFileCloudResult[] = [];
        for (const fileUrl of files) {
            if (fileUrl.startsWith('blob:') || fileUrl.startsWith('data:image/')) {
                const file = await this.getBlobFromObjectURL(fileUrl);
                if (file != null) {
                    const uploadData = await this.uploadMultipleFilesToCloud(tenantCode, [file], containerName);
                    if (uploadData?.length) {
                        results.push(uploadData[0]);
                    }
                }
            } else {
                results.push({
                    blobName: "",
                    url: fileUrl, isUploaded: false
                });
            }
        }
        return results;
    }

    public async uploadObjectUrl(tenantCode: string, file?: string | undefined, containerName?: string): Promise<IUploadFileCloudResult | undefined> {

        if (!file) return;

        const results = await this.uploadObjectUrls(tenantCode, [file], containerName);
        return results?.[0]
    }

    public async uploadBase64ToCloud(tenantCode: string, file: string, containerName?: string) {
        try {
            const base64Response = await fetch(file);
            const blob = await base64Response.blob();
            const fileObj = new File([blob], 'image-' + new Date().getTime() + '.png', { type: blob.type });
            const res = await this.uploadFileToCloud(tenantCode, fileObj, containerName);
            return res;
        } catch (error) {
            console.log('Failed to uploadBase64ToCloud', error);
        }
        return null;
    }

    public async deleteFile(tenantCode: string, fileName?: string, containerName?: string): Promise<boolean> {
        if (isValidUrl(fileName)) return false;
        const containerClient = this.getContainerClient(tenantCode, containerName || DEFAULT_CONTAINER);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName as string);
        const res = await blockBlobClient.deleteIfExists();
        return res.succeeded;
    };
}

export const cdnService = new CdnService();
