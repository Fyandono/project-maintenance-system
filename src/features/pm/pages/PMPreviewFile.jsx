import React, { useState, useEffect } from 'react';
import { apiController } from '../../core/api/apiController'; // ⭐️ Import your controller
import styles from './PmFilePreview.module.css'; // Optional: for loading spinner

export default function PmFilePreview({ projectPmId }) {
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let objectUrl;
        
        const fetchFile = async () => {
            if (!projectPmId) return;

            setIsLoading(true);
            setError(null);
            
            try {
                // 1. Fetch the file data securely as a BLOB
                const responseData = await apiController({
                    method: 'get',
                    endpoint: `/x/files/${projectPmId}`,
                    customConfig: { 
                        responseType: 'blob', // Request binary data
                    }, 
                });

                // responseData is the Blob object (binary data)
                const blob = new Blob([responseData]); 
                
                // 2. Create a memory URL (Blob URL)
                objectUrl = URL.createObjectURL(blob);
                
                // 3. Update state to trigger rendering the iframe
                setFileUrl(objectUrl);
                
            } catch (err) {
                console.error("Error fetching file:", err);
                setError("Failed to load file. Session may have expired.");
                // The global 401 interceptor handles logout here.
            } finally {
                setIsLoading(false);
            }
        };

        fetchFile();

        // ⭐️ CRITICAL CLEANUP FUNCTION ⭐️
        return () => {
            // When the component unmounts or the effect re-runs, 
            // revoke the old Blob URL to free up browser memory.
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [projectPmId]); // Dependency: Re-fetch if the file ID changes

    // --- Rendering ---

    if (isLoading) {
        return <div className={styles.loading}>Loading file preview...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    // 4. Display the file using an <iframe>
    // The browser will display the content based on the MIME type (PDF, image, etc.)
    return (
        <div className={styles.fileContainer}>
            {/* Setting height/width is essential for the iframe */}
            <iframe 
                title={`File Preview ${projectPmId}`} 
                src={fileUrl} 
                style={{ width: '100%', height: '800px', border: 'none' }} 
            />
        </div>
    );
}