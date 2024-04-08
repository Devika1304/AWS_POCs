import aws from 'aws-sdk';

const s3 = new aws.S3();

export const deleteFolder = async (bucketName: string, folderPrefix: string): Promise<void> => {
    console.info("deleteFolder line 11 bucketName: ", bucketName, " folderPrefix: ", folderPrefix);
    // Ensure folderPrefix ends with a slash
    const folderPrefixWithSlash = folderPrefix.endsWith('/') ? folderPrefix : folderPrefix + '/';

    const params = {
        Bucket: bucketName,
        Prefix: folderPrefixWithSlash // Ensure prefix ends with a slash
    };
    console.info("deleteFolder line 19 params: ", params);
    try {
        const data = await s3.listObjectsV2(params).promise();
        console.info("data line 22::: ", data);
        if (data.Contents && data.Contents.length) {
            console.info("data line 24::: ", data);
            const objects = data.Contents.map(obj => ({ Key: obj.Key })) as AWS.S3.Types.ObjectIdentifierList;
            console.info("data line 26::: ", objects);
            const deleteParams: AWS.S3.Types.DeleteObjectsRequest = {
                Bucket: bucketName,
                Delete: {
                    Objects: objects
                }
            };
            console.info("data line 33 deleteParams::: ", deleteParams);
            await s3.deleteObjects(deleteParams).promise();
            console.log(`Successfully deleted objects in folder: ${folderPrefix}`);
        }
    } catch (err) {
        console.error(`Error deleting objects: ${err}`);
        throw err;
    }
}

// Function to upload a file to S3
export async function uploadToS3(bucket: string, key: string, data: any): Promise<void> {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data
  };

  try {
    await s3.upload(params).promise();
    console.log(`File uploaded successfully to S3 at s3://${bucket}/${key}`);
  } catch (err) {
    console.error(`Error uploading file to S3: ${err}`);
    throw err;
  }
}

// Function to download a file from S3
export async function downloadFromS3(bucket: string, key: string): Promise<Buffer> {
    const params = {
      Bucket: bucket,
      Key: key
    };
  
    try {
      const data = await s3.getObject(params).promise();
      return data.Body as Buffer;
    } catch (err) {
      console.error(`Error downloading file from S3: ${err}`);
      throw err;
    }
  }