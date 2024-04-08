import { invokeStateMachine } from '../utils/sm-client';
import * as Config from '../config/config';

export const publishXmlToJsonHandler = async (event: any): Promise<any> => {
    console.log('Received event:', event);
    const inputBucket = event.Records[0].s3.bucket.name
    const inputKey = event.Records[0].s3.object.key

    console.info('Bucket,key line 12::', inputBucket, inputKey);
    try {
        const params = {
            bucketName: inputBucket,
            key: inputKey
        }
        await invokeStateMachine(Config.XMLTOJSON_STEP_FUNCTION_ARN, params);
        console.log('Invoked statemachine from lambda successfully');

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
