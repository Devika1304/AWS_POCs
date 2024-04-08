import * as fs from 'fs';
import AdmZip from 'adm-zip';
import { parseString } from 'xml2js';

// Function to unzip a buffer
export const unzipBuffer = (buffer: Buffer, unzipDestination: string): void => {
    const zip = new AdmZip(buffer);
    zip.extractAllTo(unzipDestination, true);
}

export function readDirectoryAsync(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

export function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export const xmlToJSONParser = (xmlData: any): Promise<any> => {
    return new Promise((resolve) => {
        // let resolvedPathFileName = path.resolve(__dirname, file);
        // let xmlData = fs.readFileSync(resolvedPathFileName);
        console.info(`xmlData xmlToJSONParser:`, xmlData.toString());
        return parseString(xmlData, {trim: true, normalize: true},(err: any, result: any) => {
            if (result) {
                console.info("xmlTOJSONParser result: ", JSON.stringify(result));
                resolve(result);
            } else {
                console.error("xmlTOJSONParser err: ", err);
                resolve(null);
            }
        })
    });
}