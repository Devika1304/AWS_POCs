// import unzipper from 'unzipper';
import * as fs from 'fs';

import { deleteFolder, uploadToS3 } from '../s3/s3';
import { DownloadZipFromS3Schema } from '../schemas/download-zip-from-s3-schema';
import { downloadAndUnZipFromS3Service } from '../services/publish-download-and-unzip-from-s3-service';
import { chunkArray } from '../utils/common';

export const publishGetS3ZipHandler = async (event: any): Promise<any[]> => {
    console.info(event);
    const unzipDestination = '/tmp/unzipped-files/';
    const inputBucket = event.Payload.bucketName; // event.Records[0].s3.bucket.name
    const inputKey = event.Payload.key; // event.Records[0].s3.object.key

    console.info('Bucket,key line 12::', inputBucket, inputKey);
    try {
        let awsS3TempfileNames: any[] = [];

        const s3TempDestinationPath = `tmp/`;

        await deleteFolder(inputBucket, s3TempDestinationPath);

        console.info(`deleted folder ${s3TempDestinationPath} successfully.`);

        const object: DownloadZipFromS3Schema = {
            bucket: inputBucket,
            key: inputKey,
            unzipDestination: unzipDestination,
            s3TempDestinationPath: s3TempDestinationPath
        }

        const files = await downloadAndUnZipFromS3Service(object);

        for (const file of files) {
            const filePath = `${unzipDestination}/${file}`;
            const fileBuffer = fs.readFileSync(filePath);
            const s3ObjectKey = `${s3TempDestinationPath}${file}`;
            await uploadToS3(inputBucket, s3ObjectKey, fileBuffer);
            fs.unlinkSync(filePath); // Optionally, remove the file after uploading
            awsS3TempfileNames.push(s3ObjectKey);
        }
    
        console.info('Files uploaded successfully.');
    
        const bundleWith25Files = chunkArray(awsS3TempfileNames, 25);
        return bundleWith25Files;

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}