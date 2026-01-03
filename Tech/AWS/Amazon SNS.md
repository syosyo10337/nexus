---
tags:
  - aws
  - ec2
  - networking
  - sns-sqs
created: 2026-01-03
status: active
---

# **Amazon** SNS

**Amazon Simple Notification Service**

[

Amazon とは SNS - Amazon Simple Notification Service

Amazon を使用して、サブスクライブしているエンドポイントまたはクライアントへのメッセージの配信または送信を調整して管理しますSNS。

![](AWS/Attachments/favicon%201.ico)https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html

![](AWS/Attachments/aws_logo_smile_179x109.png)](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html)

SQSをSNSにsubscribe

[https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-sqs-as-subscriber.html](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-sqs-as-subscriber.html)

When you subscribe an Amazon SQS queue to an Amazon SNS topic, you can publish a message to the topic and Amazon SNS sends an Amazon SQS message to the subscribed queue. The Amazon SQS message contains the subject and message that were published to the topic along with metadata about the message in a JSON document. The Amazon SQS message will look similar to the following JSON document.

```JSON
{
   "Type" : "Notification",
   "MessageId" : "63a3f6b6-d533-4a47-aef9-fcf5cf758c76",
   "TopicArn" : "arn:aws:sns:us-west-2:123456789012:MyTopic",
   "Subject" : "Testing publish to subscribed queues",
   "Message" : "Hello world!",
   "Timestamp" : "2012-03-29T05:12:16.901Z",
   "SignatureVersion" : "1",
   "Signature" : "EXAMPLEnTrFPa3...",
   "SigningCertURL" : "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
   "UnsubscribeURL" : "https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:123456789012:MyTopic:c7fe3a54-ab0e-4ec2-88e0-db410a0f2bee"
}
```

# SNS Publish on Rails

[https://docs.aws.amazon.com/sdk-for-ruby/v3/developer-guide/ruby_sns_code_examples.html](https://docs.aws.amazon.com/sdk-for-ruby/v3/developer-guide/ruby_sns_code_examples.html)

[https://upgarage.atlassian.net/wiki/spaces/newdevelopment/pages/2577629185/ZKS+AmazonSNS](https://upgarage.atlassian.net/wiki/spaces/newdevelopment/pages/2577629185/ZKS+AmazonSNS)

イベントとトピックごとに送信先をマッピングする形式と

SNSでトピックをfilterするので、subcsription時にfilterする方法

```Mermaid
sequenceDiagram
    participant DB as Datastore
    participant SNS
    participant SQS
    participant Worker as cityhall-worker (shoryuken)
    participant Trailer
    participant FCM
    participant App as Mobile App

    DB ->> DB: after_commit on specific column
    DB ->> SNS: Trigger SNS event
    SNS ->> SQS: Publish event to SQS
    Worker ->> SQS : Poll message
    Worker ->> Worker: Process message
    Worker ->> Trailer: Send REST API request
    Trailer ->> FCM: Send event to FCM
    FCM ->> App: Push notification
```