---
tags:
  - php
  - laravel
  - syntax
created: 2026-01-03
status: active
---

🤪

# CustomValidatorの実装

Laravelソースコード上で確認出来る`Validation\Validator`を拡張する形で、`functionXxxx`と定義した値が、rulesで`’xxxx’`として使用できる。っぽい。

```PHP
public functionXxxx ($attribute, $value, $parameters) {
	return (bool) //実際のvalidationルールの実装
}
```

(実装例)

`app/laravel/app/Validator.php`にて

```PHP

<?php
declare(strict_types=1);

namespace App;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Validator as BaseValidator;

/**
 * カスタムバリデータ
 *
 * NOTE: このクラスには汎用的なもののみを実装。コンテンツ固有など個別的なものはトレイトで実装する。
 */
class Validator extends BaseValidator
{
    public function __construct($translator, $data, $rules, $messages = [], $attributes = [])
    {
        parent::__construct($translator, $data, $rules, $messages, $attributes);

        // 暗黙の拡張に追加
        //$this->implicitRules[] = '';
    }

    /**
     * validateKatakana カタカナのバリデーション
     *
     * @param string $value
     * @access public
     * @return bool
     */
    public function validateKatakana($attribute, $value, $parameters)
    {
        return (bool) preg_match('/^[ァ-ヾ 　〜ー−]+$/u', $value);
    }

    /**
     * validateHiragana ひらがなのバリデーション
     *
     * @param string $value
     * @access public
     * @return bool
     */
    public function validateHiragana($attribute, $value, $parameters): bool
    {
        return (bool) preg_match('/^[ぁ-ん 　〜ー−]+$/u', $value);
    }

    /**
     * validateTel 電話番号のバリデーション
     */
    public function validateTel($attribute, $value, $parameters): bool
    {
        if($value){
            return (bool) preg_match('/^(([0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4})|([0-9]{8,11}))$/', $value);
        } else {
            return true;
        }
    }
}
```

(使用例)

`app/laravel/app/Http/Requests/KaitoriYoyakuApi/KaitoriYoyakuReservationRequest.php`

にて

```PHP
<?php
declare(strict_types=1);

namespace App\Http\Requests\KaitoriYoyakuApi;

use App\Http\Requests\ApiRequest;
use Illuminate\Validation\Rule;

class KaitoriYoyakuReservationRequest extends ApiRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tenpo_id'                                 => [
                'required',
                'string',
                Rule::exists('mysql_slave.tenpo', 'id'),
            ],
            'reservation_date'                         => [
                'required',
                'string',
                'date_format:Y-m-d',
            ],
            'reservation_time'                         => [
                'required',
                'date_format:H:i',
            ],
            'customer_name'                            => [
                'required',
                'string',
                'max:64',
            ],
            'customer_name_kana'                       => [
                'required',
                'string',
                'katakana',
                'max:64',
            ],
            'customer_phone'                           => [
                'required',
                'string',
                'tel',
            ],
            'customer_email'                           => [
                'required',
                'email',
                'max:255',
            ],
            'how_to_contact'                           => [
                'required',
                Rule::in(['電話', 'メール', 'どちらでも可']),
            ],
            'when_to_contact'                          => [
                'nullable',
                'date_format:H:i',
            ],
            'use_count'                                => [
                'required',
                Rule::in(['初めて利用', '2回目の利用', '3回以上利用']),
            ],
            'parts_installed_flag'                     => [
                'required',
                Rule::in([0, 1]),
            ],
            'reservation_details'                      => [
                'required',
                'array',
            ],
            'reservation_details.*.category'           => [
                'required',
                'string',
            ],
            'reservation_details.*.quantity'           => [
                'required',
                Rule::in([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
            ],
            'reservation_details.*.parts_name'         => [
                'nullable',
                'string',
            ],
            'reservation_details.*.parts_model_number' => [
                'nullable',
                'string',
            ],
            'reservation_details.*.car_model'          => [
                'nullable',
                'string',
            ],
            'reservation_details.*.detail'             => [
                'nullable',
                'string',
            ],
            'reservation_details.*.images'             => [
                'nullable',
                'array',
            ],
            'reservation_details.*.images.*'           => [
                'nullable',
                'string',
            ],
        ];
    }

    public function attributes()
    {
        return [
            'tenpo_id'                                 => '店舗ID',
            'reservation_date'                         => '予約日',
            'reservation_time'                         => '予約時間',
            'customer_name'                            => '氏名',
            'customer_name_kana'                       => '氏名(カナ)',
            'customer_phone'                           => '電話番号',
            'customer_email'                           => 'メールアドレス',
            'how_to_contact'                           => 'ご希望の連絡方法',
            'when_to_contact'                          => 'ご希望の連絡時間帯',
            'use_count'                                => 'アップガレージの買取利用回数',
            'parts_installed_flag'                     => '査定依頼パーツは現在車両についていますか',
            'reservation_details'                      => '買取査定パーツ',
            'reservation_details.*.category'           => 'カテゴリー',
            'reservation_details.*.quantity'           => '点数',
            'reservation_details.*.parts_name'         => '商品名',
            'reservation_details.*.parts_model_number' => '型番（サイズ）',
            'reservation_details.*.detail'             => '詳細',
            'reservation_details.*.images'             => 'パーツ画像',
            'reservation_details.*.images.*'           => 'パーツ画像',
        ];
    }

    public function messages()
    {
        $message = [
        ];
        return array_merge(parent::messages(), $message);
    }
}
```

### 参考資料置き場

ググるとFacades\Validatorを使う例はたくさんででくるんだけどね…

614行目に動的にルールを生成している記述は確認しました！詳しくはわかっていません。

[

framework/Validator.php at 7d15f7eef442633cff108f83d9fe43d8c3b8b76f · laravel/framework

The Laravel Framework. Contribute to laravel/framework development by creating an account on GitHub.

![](PHP/Laravel/contents/Attachments/fluidicon.png)https://github.com/laravel/framework/blob/7d15f7eef442633cff108f83d9fe43d8c3b8b76f/src/Illuminate/Validation/Validator.php#L614

![](PHP/Laravel/contents/Attachments/framework.png)](https://github.com/laravel/framework/blob/7d15f7eef442633cff108f83d9fe43d8c3b8b76f/src/Illuminate/Validation/Validator.php#L614)

https://github.com/ZERO-TO-ONE-TEAM/upg-service/pull/499/commits/c21da69b733d866833426396097e70d3953188de

[

Laravelでカスタムバリエーションを本格的にやる - Qiita

Laravel5時代にかなりつくり込んで、Laravel8で久しぶりに触ったのでメモ。 カスタムバリデーションに関してドキュメントにはRulesってのを追加するというものが書かれています。 https://readouble.com...

![](PHP/Laravel/contents/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)https://qiita.com/gungungggun/items/51c123fda1152e5c6fce

![](PHP/Laravel/contents/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad.png)](https://qiita.com/gungungggun/items/51c123fda1152e5c6fce)