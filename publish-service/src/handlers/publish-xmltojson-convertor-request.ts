import * as fs from 'fs';
import * as Config from "../config/config";

import { DownloadZipFromS3Schema } from '../schemas/download-zip-from-s3-schema';
import { downloadAndUnZipFromS3Service } from '../services/publish-download-and-unzip-from-s3-service';
import { xmlToJSONParser } from '../utils/common';
import { uploadToS3 } from '../s3/s3';

export const publishXmlToJsonConvertorHandler = async (event: any): Promise<any> => {
    try {
        const unzipDestination = '/tmp/unzipped-files/';
        const s3TempDestinationPath = `convertedJsonFiles/`;
        const inputBucket = Config.INPUT_BUCKET;
        const consolidatedJsonData: any[] = [];

        console.info(event);
        if (event && "Payload" in event && Array.isArray(event["Payload"])) {
            for (let s3ZipFilePath of event.Payload) {
                const object: DownloadZipFromS3Schema = {
                    bucket: inputBucket,
                    key: s3ZipFilePath,
                    unzipDestination: unzipDestination,
                    s3TempDestinationPath: s3TempDestinationPath
                }
                console.info(object);
                const files = await downloadAndUnZipFromS3Service(object);
                const xmlFile = files.filter((fileName: string) => fileName.includes(".xml"));
                
                if (xmlFile.length) {
                    const filePath = `${unzipDestination}/${xmlFile[0]}`;
                    const xmlString = fs.readFileSync(filePath).toString("utf-8");
                    const jsonData = await xmlToJSONParser(xmlString);
                    consolidatedJsonData.push(jsonData); // Collect JSON data from each XML file
                    console.info("consolidated JSON data push....")
                    // const s3ObjectKey = `${s3TempDestinationPath}${xmlFile[0].replace(".xml", ".json")}`;
                    // await uploadToS3(inputBucket, s3ObjectKey, JSON.stringify(jsonData));
                    fs.unlinkSync(filePath); // Optionally, remove the file after uploading
                }
            }
            // Consolidate JSON data into a single file
            const consolidatedJsonFilePath = '/tmp/consolidated-data.json';
            fs.writeFileSync(consolidatedJsonFilePath, JSON.stringify(consolidatedJsonData));
            // Upload consolidated JSON file to S3
            const s3ObjectKey = `${s3TempDestinationPath}consolidated-data.json`;
            await uploadToS3(inputBucket, s3ObjectKey, fs.createReadStream(consolidatedJsonFilePath));
            fs.unlinkSync(consolidatedJsonFilePath); // Remove the local file after uploading
            console.info('Consolidated JSON file uploaded successfully.');
        }

        return "Consolidated JSON file uploaded successfully";

           // console.info('Files uploaded successfully.');
       // }

       // return "JSON Files uploaded successfully";

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}