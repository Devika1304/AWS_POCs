export type DownloadZipFromS3Schema = {
    bucket: string,
    key: string,
    unzipDestination: string,
    s3TempDestinationPath: string,
}