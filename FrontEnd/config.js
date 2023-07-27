import Constants from 'expo-constants';

const API_URL = Constants.manifest.extra.API_URL || 'http://localhost:8000';
const AWS_ACCESS_KEY = Constants.manifest.extra.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = Constants.manifest.extra.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = Constants.manifest.extra.BUCKET_NAME || 'mytoybox';
const AWS_REGION = Constants.manifest.extra.AWS_REGION || 'us-east-1';

const awsConfig = {
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
};

const s3 = new S3(awsConfig);
const ses = new SES(awsConfig);

export { API_URL, s3 as S3Client, ses as SESClient, BUCKET_NAME };
