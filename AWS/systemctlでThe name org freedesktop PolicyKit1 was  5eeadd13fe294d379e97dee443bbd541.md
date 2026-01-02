 

# systemctlで****The name org.freedesktop.PolicyKit1 was not provided by any .service filesエラーがある時****

---

[

【AWS】エラー対処法：systemctlのFailed to start サービス名: The name org.freedesktop.PolicyKit1 was not provided by any .service files

AWSにターミナルでログインして、systemctlコマンドなどを実行した場合に、以下のようなエラーが発生することがあります。 このエラーの対処法について。 エラーの原因はコマンドの実行権限がないためです。 AWSのサーバーにアクセスしたデフォルトの状態では、すべての実行権限を持っていません。 このため、全ての実行権限をもつスーパーユーザーとしてコマンドを実行する必要があります。 コマンド冒頭に、 sudo をつけて実行します。 sudoとは？ 別の利用者権限でプログラムを実行させるコマンドです。ユーザーを指定しない場合は、すべての実行権限を持つスーパーユーザーとしてコマンドを実行します。 sudoはsuperuser doの略です。└ 特権を与えられたスペシャルなユーザーとして実行。 ユーザーを指定する場合は -u オプションを使います。

![](AWS/Attachments/cropped-7ae63ebcd302897cd8cbf97b5f2a73b2-192x192.png)https://prograshi.com/platform/aws/aws-error-failed-to-start/

![](AWS/Attachments/image-774.png)](https://prograshi.com/platform/aws/aws-error-failed-to-start/)

権限の問題らしいので、sudoしてあげれば取り上えず解決しそう。