import Constants from 'expo-constants';
import S3 from 'aws-sdk/clients/s3';
import SES from 'aws-sdk/clients/ses';


//const API_URL = Constants.manifest.extra.API_URL || 'http://localhost:8000';
const API_URL = Constants.manifest.extra.API_URL || 'http://192.168.1.159:8000';
const AWS_ACCESS_KEY = Constants.manifest.extra.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = Constants.manifest.extra.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = Constants.manifest.extra.BUCKET_NAME || 'mytoybox';
const BUCKET_NAME_TWO = Constants.manifest.extra.BUCKET_NAME_TWO || 'myuserbox';
const AWS_REGION = Constants.manifest.extra.AWS_REGION || 'us-east-1';

const awsConfig = {
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
};

const s3 = new S3(awsConfig);
const ses = new SES(awsConfig);

export { API_URL, s3 as S3Client, ses as SESClient, BUCKET_NAME, BUCKET_NAME_TWO };