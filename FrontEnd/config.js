import { S3 } from 'aws-sdk';

//const API_URL = 'http://127.0.0.1:5000';
// const API_URL = 'http://localhost:5000';
//const API_URL = 'http://192.168.1.142:5000';
//const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'http://192.168.1.142:8000'

const awsConfig = {
  accessKeyId: 'AKIA5WL22M73IQ2N7F4K',
  secretAccessKey: '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',
  region: 'us-east-1',
};

const bucketName = 'mytoybox';

const s3 = new S3(awsConfig);

export { API_URL, s3 as S3Client, bucketName };


