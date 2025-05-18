"use client";

import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Upload, X } from "lucide-react";
import { uploadFileToIPFS } from '../../lib/uploadToIPFSClient';

interface ImageUploadProps {
    onUpload: (url: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        try {
            setIsUploading(true);
            setError(null);

            // Create local preview URL immediately
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);

            // Upload to IPFS using API route
            const ipfsHash = await uploadFileToIPFS(file);
            const ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash.replace('ipfs://', '')}`;
            onUpload(ipfsGatewayUrl);

        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image");
            if (previewUrl) {
                 URL.revokeObjectURL(previewUrl);
                 setPreviewUrl(null);
            }
            onUpload("");
        } finally {
            setIsUploading(false);
        }
    }, [onUpload, previewUrl]);

    const handleRemove = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        onUpload("");
    }, [previewUrl, onUpload]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Label
                        htmlFor="image-upload"
                        className="cursor-pointer flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Uploading..." : previewUrl ? "Change Image" : "Choose Image"}
                    </Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                    />
                </div>
                {previewUrl && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                        disabled={isUploading}
                    >
                        <X className="w-4 h-4" />
                        Remove
                    </Button>
                )}
            </div>

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            {isUploading && (
                <div className="text-sm text-muted-foreground">
                    Uploading image...
                </div>
            )}

            {!isUploading && previewUrl && (
                <div className="mt-2">
                    <img
                        src={previewUrl}
                        alt="NFT Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                    />
                </div>
            )}
        </div>
    );
} 