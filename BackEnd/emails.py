import boto3

def send_email(subject, body):
    # Provide your Access Key ID and Secret Access Key
    access_key = 'AKIA5WL22M73IQ2N7F4K'
    secret_key = '5smxCiYZ85NCGQPNuSqGDps+KvxnMyeK3J0ikhnY'

    # Create an SES client
    ses_client = boto3.client('ses',
                              region_name='us-east-1',  # Replace with your desired AWS region
                              aws_access_key_id=access_key,
                              aws_secret_access_key=secret_key)

    response = ses_client.send_email(
        Source='myhoodmobileapp@gmail.com',
        Destination={
            'ToAddresses': ['myhoodmobileapp@gmail.com']
        },
        Message={
            'Subject': {
                'Data': subject,
                'Charset': 'UTF-8'
            },
            'Body': {
                'Text': {
                    'Data': body,
                    'Charset': 'UTF-8'
                }
            }
        }
    )

    print('Email sent:', response['MessageId'])


# Example usage
if __name__ == '__main__':
    subject = 'Hello from AWS SES!'
    body = 'This is the message body'

    send_email(subject, body)
