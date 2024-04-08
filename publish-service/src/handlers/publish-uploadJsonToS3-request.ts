import { deleteFolder } from "../s3/s3";
import * as Config from '../config/config';

export const publishUploadJsonToS3Handler = async (event: any): Promise<any> => {
     try {
        console.info(event);
        const s3TempDestinationPath = `tmp/`;

        await deleteFolder(Config.INPUT_BUCKET, s3TempDestinationPath);
        return event
     } catch (err) {
         console.error('Error:', err);
         throw err;
     }
}