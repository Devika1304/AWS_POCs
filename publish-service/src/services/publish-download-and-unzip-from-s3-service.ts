import { downloadFromS3 } from "../s3/s3";
import { readDirectoryAsync, unzipBuffer } from "../utils/common";
import { DownloadZipFromS3Schema } from "../schemas/download-zip-from-s3-schema";

export const downloadAndUnZipFromS3Service = async (data: DownloadZipFromS3Schema) => {

    const s3DownloadedFile = await downloadFromS3(data.bucket, data.key);

    console.log(s3DownloadedFile.length);

    console.info('Zip file downloaded successfully.');

    // Unzip the downloaded file
    unzipBuffer(s3DownloadedFile, data.unzipDestination);

    console.info('Folder unzipped successfully.');

    // Read the unzipped files and upload them to S3
    const files = await readDirectoryAsync(data.unzipDestination)

    console.info("files list: ");

    console.info(files);

    return files
}