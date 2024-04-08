import * as Constants from '../utils/constants';

const getEnvironment = (envName: string, defaultValue?: string): string => {
    const value = process.env[envName];
    if (value) return value;
    if (defaultValue) return defaultValue;
    return '';
}

export const INPUT_BUCKET = getEnvironment(Constants.INPUT_BUCKET, "publish-upload-eu-central-1-452010797180");
export const XMLTOJSON_STEP_FUNCTION_ARN = getEnvironment(Constants.XMLTOJSON_STEP_FUNCTION_ARN, "arn:aws:states:eu-central-1:452010797180:stateMachine:publish-xmltojson-statemachine");