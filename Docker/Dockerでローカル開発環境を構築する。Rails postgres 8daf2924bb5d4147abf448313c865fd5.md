 

🙄

# Dockerでローカル開発環境を構築する。Rails/postgres

---

[

Dockerで開発環境を構築する。 Rails6.1/postgreSQL14

コンテナ基盤での本番環境構築やCIなどの導入も見据えて、dockerを学習し始めました。第一歩として、お手元のPCで開発していた環境をコンテナでほぼ再現させた記録です。 自身で開発環境をdocker上で構築しようと思った際に、Docker公式のquick ...

![](Docker/Attachments/logo-transparent.png)https://zenn.dev/masanao/articles/d24a07385e4d0c

![](Docker/Attachments/og-base_z4sxah.png)](https://zenn.dev/masanao/articles/d24a07385e4d0c)

## エラーログ

開発の環境は整えたものの、capybaraでのjavascriptも含めたテストについて,

driverが設定できずに詰んだ。

大枠での解決案。

chromeコンテナを用意して、ドライバを新たに登録する。設定項目のdesired_capabilitesは

```YAML
`Failure/Error: visit root_path
          
          ArgumentError:
            unknown keyword: :desired_capabilities
```

となってしまうので、以下のように設定すること。

```Ruby
Capybara.register_driver :remote_chrome do |app|
  url = 'http://chrome:4444/wd/hub'
  capabilities = ::Selenium::WebDriver::Remote::Capabilities.chrome(
    'goog:chromeOptions' => {
      'args' => [
        'no-sandbox',
        'headless',
        'disable-gpu',
        'window-size=1680,1050'
      ]
    }
  )
  Capybara::Selenium::Driver.new(app, browser: :remote, url: url, capabilities: capabilities)
end
```

また、capybara のホスト設定をrailsコンテナであると、明示的に指定して、

```Ruby
config.before(:each, type: :system, js: true) do
    driven_by :remote_chrome
    Capybara.server_host = IPSocket.getaddress(Socket.gethostname)
    Capybara.server_port = 4444
    Capybara.app_host = "http://#{Capybara.server_host}:#{Capybara.server_port}"
  end
# これらの内容については、docker-composeで設定されているよ。
```

cf）

[https://qiita.com/mass584/items/c30e0762050a10503da7](https://qiita.com/mass584/items/c30e0762050a10503da7)

[https://qiita.com/ryo_kh/items/2249c13d30648f50b9c8](https://qiita.com/ryo_kh/items/2249c13d30648f50b9c8)

- debug環境

dev環境のlogに入れないといけないので、まずはserver立ち上げて、サーバーを構築しているコンテナのIDを調べる。(docker-compose psもしくはcontainerでもいい？)

[(tips)コンテナ上でデバッグする](\(tips\)%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E4%B8%8A%E3%81%A7%E3%83%87%E3%83%90%E3%83%83%E3%82%B0%E3%81%99%E3%82%8B%204a832afaaae84296b91184bf57ce84f4.html)

### エラーログ

[postgresのコンテナがアプリから繋げない (1)](Docker%E3%81%A7%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%99%E3%82%8B%E3%80%82Rails%20postgres/postgres%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%81%8C%E3%82%A2%E3%83%97%E3%83%AA%E3%81%8B%E3%82%89%E7%B9%8B%E3%81%92%E3%81%AA%E3%81%84%20\(1\)%204aebd395d3014b1c9b40cfbdb996a2c7.html)

[なぜだか、database.ymlを正常に読み込まない (1)](Docker%E3%81%A7%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%99%E3%82%8B%E3%80%82Rails%20postgres/%E3%81%AA%E3%81%9C%E3%81%A0%E3%81%8B%E3%80%81database%20yml%E3%82%92%E6%AD%A3%E5%B8%B8%E3%81%AB%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BE%E3%81%AA%E3%81%84%20\(1\)%20b835c7d7b0d84f3687d0fe04f52e9adf.html)