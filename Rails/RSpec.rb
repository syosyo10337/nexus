[RSpec]===============================

***RSpec.describe "" do end --テストのグループ化を宣言。
describeはあくまで、テストのグループ化
*describe には describe User のように、文字列ではなくクラスを渡すこともできます。
*また、該当クラスのインスタンスメソッドをテストすると言う意味で、
"#greet"などもよく使われる。
ex)
RSpec.describe User do
	describe "#greet" do
		it '12歳以下の場合、ひらがなで答えること' do
			user = User.new(name: 'たろう', age: 12)
			expect(user.greet).to eq 'ぼくはたろうだよ。'
		end
		it '13歳以上の場合、漢字で答えること' do
			user = User.new(name: 'たろう', age: 13)
			expect(user.greet).to eq '僕はたろうです。'
		end
	end
end


*itはテストをexampleという単位にまとめる役割をします
it do ... end の中のexpectation（期待値と実際の値の比較）がすべてパスすれば、その example はパスしたことになります。一つのテストdescribeの中には複数のexample(it do endの塊)を記述できる。

(命名tips) -- itに後述する形で"振る舞いを表す"動詞を繋げて、英文に近い表現をします。

*it/specify/example -exampleを表すエイリアス

***expect(X).to eq Y で記述するのがexpectationです。
このexpect構文ではテストする値をexpect()メソッドに渡し、れに続けてマッチャを呼び出します。(これはexpect構文と呼ばれる,昔はshould構文を使ってたよ)
*一つのexmapleに複数のexpectationを記述できる。ただ、failした時にどこが問題が分かりづらいため、原則として「1つの example につき1つのエクスペクテーション」で書いた方がテストの保守性が良くなります。

ex)

RSpec.describe '四則演算' do	
	#一番外側のdescribe以外はRSpec.を省略可
	describe '足し算' do
		it '1 + 1 は 2 になること' do
			expect(1 + 1).to eq 2
		end
	end
	describe '引き算' do
		it '10 - 1 は 9 になること' do
			expect(10 - 1).to eq 9
		end
	end
end

適切にグループ化すると、「この describe ブロックはこの機能をテストしてるんだな」と読み手がテストコードを理解しやすくなります

**context --describe同様にテストをグループ化する。昨日はdescribe同様だが、条件分岐するときなどによく使われる。

describe と同様、 context で適切にグループ化すると、「この context ブロックはこういう条件の場合をテストしてるんだな」と読み手がテストコードを理解しやすくなります

(命名tips) --contextの中の説明で、'when~（～であるとき）' や 'with ～（～がある場合）' 、 'without ～（～がない場合）' といった説明の文字列を渡すと、条件でグループ分けしていることが明確になります。)
ex)'when 12 years old or younger'

ex)

require_relative "../lib/user.rb"

RSpec.describe User do
	describe "#greet" do
		context "12歳以下の場合" do
			it 'ひらがなで答えること' do
				user = User.new(name: 'たろう', age: 12)
				expect(user.greet).to eq 'ぼくはたろうだよ。'
			end
		end
		context "13歳以上の場合" do
			it '漢字で答えること' do
				user = User.new(name: 'たろう', age: 13)
				expect(user.greet).to eq '僕はたろうです。'
			end
		end
	end
end

**before で共通の前準備をする --before do ... end で囲まれた部分は example の実行前に毎回呼ばれます。
before ブロックの中では、テストを実行する前の共通処理やデータのセットアップ等を行うことが多いです(Minitestでいうsetupみたいだね。)

*before は describe や context ごとに用意することができます。
つまり、ネストしたbeforeの呼び出しも可能。(親->子の順番で)
*before(:each/:exapmle/:all/:suite)オプションもある。
- each(exmaple)だと、describeまたはcontextブロック内の各テストごとに実施される。デフォルトだとこれ
- all(context)をつけると、ブロック内の前テストの前に１度だけ実行される。可能な限りオプションなしの:eachを推奨



**@変数の代わりに、letを使う
let(:foo) { ... } のように書くと、 { ... } の中の値が foo として参照できる、というのが let の基本的な使い方です。

*letのメリット
let は「before + インスタンス変数」を使うsetupとは異なり、 遅延評価される という特徴があります。
すなわち、 let は必要になる瞬間まで呼び出されません。
	
ex)上の例のリファクタリング

require_relative "../lib/user.rb"

RSpec.describe User do
	describe "#greet" do
		let(:user) { User.new(**params) }
		let(:params) { { name: 'たろう', age: age }}
		context "12歳以下の場合" do
			let(:age) { 12 }
			it 'ひらがなで答えること' do
				expect(user.greet).to eq 'ぼくはたろうだよ。'
			end
		end
		context "13歳以上の場合" do
			let(:age) { 13 }
			it '漢字で答えること' do
				expect(user.greet).to eq '僕はたろうです。'
			end
		end
	end
end


**subjectを使ってテスト対象のオブジェクトを1箇所にまとめる
テスト対象のオブジェクト（またはメソッドの実行結果）が明確に一つに決まっている場合は、 subject という機能を使ってテストコードをDRYにすることができる

***テストコードは「DRYさ」よりも「読みやすさ」を大事にしてください。
アプリケーション側のコードとは異なり、多少の重複は許容するようにしましょう。


**shared_examples/it_behave_likeを使って、exampleを再利用する
#shared_examples 'foo' do ... end で再利用したいexampleを定義し、 it_behaves_like 'foo' で定義したexampleを呼び出すイメージです。
ex)
RSpec.describe User do
	describe "#greet" do
		let(:user) { User.new(name: 'たろう', age: age) }
		subject { user.greet }
		
		context 'when 0 year-old' do
			let(:age) { 0 }
			it { is_expected.to eq 'ぼくはたろうだよ。' }
		end
		context "when 12 years old or younger" do
			let(:age) { 12 }
			it { is_expected.to eq 'ぼくはたろうだよ。' }
		end
		context "when 13 years old or older" do
			let(:age) { 13 }
			it { is_expected.to eq '僕はたろうです。' }
		end
		context "when 100 year-old" do
			let(:age) { 100 }
			it { is_expected.to eq '僕はたろうです。' }
		end
	end
end


RSpec.describe User do
	describe "#greet" do
		let(:user) { User.new(name: 'たろう', age: age) }
		subject { user.greet }
		
		shared_examples "Child greeting" do
			it { is_expected.to eq 'ぼくはたろうだよ。'}
		end
		context 'when 0 year-old' do
			let(:age) { 0 }
			it_behaves_like 'Child greeting'    
		end
		context "when 12 years old or younger" do
			let(:age) { 12 }
			it_behaves_like 'Child greeting'    
		end
		
		shared_examples "Adult greeting" do
			it { is_expected.to eq '僕はたろうです。' }
		end
		context "when 13 years old or older" do
			let(:age) { 13 }
			it_behaves_like "Adult greeting"
		end
		context "when 100 year-old" do
			let(:age) { 100 }
			it_behaves_like "Adult greeting"
		end
	end
end


**shared_context と include_contextで重複を避ける(再利用する)
shared_context 'foo' do ... end で再利用したいcontextを定義し、 include_context 'foo' で定義した context を呼び出すイメージです。

let! --遅延評価(let)ではなく、事前に実行するもの。beforeブロックで、各example前にセットアップした場合と同じ。テストスイートにおいて、どのようなデータのセットアップが必要か？に応じて使い分けると良い。

RSpec.describe Blog do
	let(:blog) { Blog.create(title: 'RSpec必勝法', content: 'あとで書く') }
	it 'ブログの取得ができること' do
		expect(Blog.first).to eq blog
	end
end

#Blog.firstの部分ではなく、後述のblogで初めて let(:blog)が実行されるため、nil.to eq blog(の値)と言う評価式となりテストが失敗する。

let!(:blog) { Blog.create(title: 'RSpec必勝法', content: '後で書く') }
のように書くと、後述のexample実行前にlet!で定義された値が作られる。


**どうしても動かないテストを保留にするpending
ex)
RSpec.describe '繊細なクラス' do
	it '繊細なテスト' do
		expect(1 + 2).to eq 3
		
		pending 'この先はなぜかテストが失敗するのであとで直す'
		# パスしないエクスペクテーション（実行される）
		expect(foo).to eq bar
	end
end

#pending以降のexampleはあくまで実行はされ、テストが失敗した際には、pendingというマークが出るよ。
最後までテストがパスした場合は pending にならず、「なんでパスすんねん！！」とRSpecに怒られてテストが失敗します。

**問答無用でテストの実行を止める: skip

*手早く、example全体をskipする --xit(xはバツのイメージ)
同様にxspecify/xexampleも同様に、exampleをスキップしてpendingのマークをつけます

**ループ全体をまとめてskipさせる: xdescribe / xcontext
it だけでなく、 describe や context にも x を付けることができます。

**中身がない状態のit 
User#good_bye
を実装したい時に、ある種Todoリスト的に仕様を設計する時に活用できる。

RSpec.describe User do
	describe '#good_bye' do
		context '12歳以下の場合' do
			it 'ひらがなでさよならすること'
		end
		context '13歳以上の場合' do
			it '漢字でさよならすること'
		end
	end
end




***{Matcher(マッチャー)}----
*マッチャーとは、期待値と実際の値を比較して、一致した（もしくは一致しなかった）という結果を返すオブジェクト

(RSpecのメソッド)
*expect(actual).to be(expected)
*to -- 「~であること」を期待する時に使う
ex)expect(1 + 2).to eq 3
*not_to/(to_not) --「~ではないこと」を期待する時に使う

**eq --期待値と実際の値が等しいかを検証する時に使う。
**be --等号/不等号と組み合わせて、値を大小比較を検証する時に使う。
ex)#1 + 2 が 3 以上であることの検証
expect(1 + 2).to be >= 3

*.to be/.to eqの違い --.to beの時は、2つの値が同一インスタンスであるかと検証している(内部的にequal?メソッドを使った結果で検証している。)。一方で.to eqの時は同値性(値を検証)している。(内部的には==を使って比較している)
#同一インスタンスであるかを検証する機会はあまりないと思うので、eqを使っておけばなんとかなりそう。
但し、true / false / nil や、整数値、シンボルは特殊で、「同じ値であれば同じインスタンス」になるため、be を使ってもテストはパスします（eq でもパスします）。


***predicateマッチャー(be_xxx) --述語を表す形容詞predicateマッチャー。?で終わり、真偽値を返すメソッドについてbe_xxxの形で、検証できる。ex)be_valid）

ex)expect([]).to be_empty 
#empty?がtrueであることのexpectation
つまり、以下と同義です。
expect([].empty?).to be true

RailsのモデルのValidationについての検証の際にも
ex)
user = User.new(name: 'Tom', email: 'tom@example.com')
expect(user).to be_valid 
# user.valid? が true なることのexpectation
#be_validはrspec-rails固有のマッチャ

**be_truthy / be_falsey --?で終わらないが、真偽値を返すメソッドについて検証するためのマッチャー
*厳密に言えば、Rubyは、「false/nilであれば偽、それ以外は真」という真偽値についての仕様があり、be_falsey(falseっぽい)というのは、nilやfalseである場合という意味になる。

ex)be_falseyじゃないと成功しない検証
expect(nil).to be false #expectationとしてはfailure


ex) #Railsのモデルでsaveする時
class User < ActiveRecord::Base
	validates :name, :email, presence: true
end
# 必須項目が入力されていないので保存できない（結果はfalse）
user = User.new
expect(user.save).to be_falsey 


**change + from/to/by --あるものが状態Aから状態Bに変化することを検証できる

tpl)expect{ X }.to change{ Y }.from(A).to(B)
#Xが、対象Yを状態Aから状態Bに変更することを期待

ex)
x = [1, 2, 3]
expect{ x.pop }.to change{ x.size }.from(3).to(2)

#注目する点として、expect/changeに対してブロック{}を渡しているという点

*byを使って、変化の差分に注目したexpectationを書くこともできる。　
tpl)expect{ x.pop }.to change{ x.size }.by(-1)  
#popは組み込みメソッド

***配列 + include --includeは繰り返し可能な値(enumerable value)の中に、指定した値が含まれるかをチェックする.
ex1)
x = [1, 2, 3]
# 1が含まれていることを検証する
expect(x).to include 1
# 1と3が含まれていることを検証する
expect(x).to include 1, 3

ex2)
#名がなければ無効な状態であること
it "is invalid without a first name" do
	user = User.new(first_name: nil)
	user.valid?
	#errrorsハッシュの中でkey:first_nameとなる値(配列の中に)"can't be blank"が含まれることを期待する
	expect(user.errors[:first_name]).to include("can't be blank")
end



*raise_error -エラーが起きることを検証する。
ex)
expect{ 1 / 0 }.to raise_error ZeroDivisionError
ブロックをとりましょう！！
raise_errorの引数には、エラーメッセージや、エラーのクラスを渡して検証できる。


---------------------


***{Mock}
モックとはざっくりいうと 「本物のふりをするニセモノのプログラム」 のことです。
何らかの理由で本物のプログラムが使えない、もしくは使わない方がよいケースでモックが使われます。
ex)外部のAPIを利用しなければならない場合
ファクトリやPOROの代役として振る舞うこともできる --この場合にはデータベースにアクセスしないという点でテスト時間の短縮につながる。
#Don't mock what you don't own(自分で管理できていないコードをモック化するな。)<-ActiveRecord#find/Deviseの認証レイヤーに関するmockを作成するなってこと。
x
***{フィーチャスペック（feature spec）}
ブラウザ上の操作をシミュレートして、実行結果を検証するテストです。
こうしたテストは一般的に「統合テスト」や「エンドツーエンドテスト（E2Eテスト）」と呼ばれるものです。
#Railsでフィーチャスペックを書く場合は rspec-rails や Capybara といったgemのインストールや、設定ファイルの作成が必要になります。


(フィーチャスペックで使われるエイリアスの対応関係)
itとかでも動作するよ。
describe <=> feature
it <=> scenario
let <=> given
let! <=> given!
before <=> background
context や after にはエイリアスがないのでそのまま使います。

ex)
require 'rails_helper'

RSpec.feature 'ログインとログアウト' do
	background do
		# ユーザを作成する
		User.create!(email: 'foo@example.com', password: '123456')
	end
	scenario 'ログインする' do
		# トップページを開く
		visit root_path
		# ログインフォームにEmailとパスワードを入力する
		fill_in 'Email', with: 'foo@example.com'
		fill_in 'Password', with: '123456'
		# ログインボタンをクリックする
		click_on 'ログイン'
		# ログインに成功したことを検証する
		expect(page).to have_content 'ログインしました'
	end
end




**{RSpecの入門書}=======================
(テストを書く上でのtips集)
**テスト作成のtips --viewのテストをせずに、UI関連のテストは統合テストで実施すること。
**{テストが誤判定していないかを調べる方法}
1. -.to ..を .to_not(/not_to)でfailするかを確認する
2. アプリ側のコードを変更(ex:validationの一部をコメントアウトするとか)


**モデルスペックの4つのベストプラクティス
1. 期待する結果をまとめてdescribeしていること。
(例えば、Userモデルがどんなモデルでどんな振る舞いをするのかということを説明する)といったこと
2. example1つにつき、結果を1つだけ期待すること
3. 正常系（成功するテストケース）と、エラーが起こるケースについてもテストしましょう。(数値だけ許可する属性に文字列がはいっているケースなど、)
4. 境界値テストをすること
5. 可読性をあげること。describeやcontextでexampleをグループ化する。共通の処理はbeforeブロックに書く。DRYにこだわりすぎることはNG


**{モデルスペック逆引き}
*インスタンスメソッドをテストする。-テストデータを作り、期待する振る舞いをRSpecに教えてあげる。
ex)
# User#nameのテスト
it "returns a user's full name as a string" do
	user = User.new(
	first_name: "John",
	last_name: "Doe",
	email: "johndoe@example.com",
	)
	expect(user.name).to eq "John Doe"
end


**Factory bot(gem)の導入
#Gemfile
gem 'factory_bot_rails'

ファクトリの生成
ex)
$ bin/rails g factory_bot:model user
#spec/factrories/が作られて、中にusers.rbという名前のファイルが配置される

factoryファイルの中で次のように記述することでテストデータを設定する。ブロック{}を使って、動的に定義する必要があります。
ex)

FactoryBot.define do
	factory :user do
		first_name { "Aaron" }
		last_name { "Sumner" }
		email { "tester@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end

呼び出す時はFactoryBot.create(:user)とすることで作成できる。

また、テストスペックで呼び出す際に特定の属性だけをオーバーライドすることができる。

e.g.)
it "is invalid without a first name" do
	user = FactoryBot.build(:user, first_name: nil)
	#first_nama属性をオーバーライドさせている。
	user.valid?
	expect(user.errors[:first_name]).to include("can't be blank")
end


**{Factory作成のメソッド}
*build --新しいテストオブジェクト
をメモリ内に保存します(インスタンス化)

*create --アプリケーションのテスト用
データベースにオブジェクトを永続化

**シーケンスの利用 
--テストユーザを複数定義したいときに、
user1 = FactoryBot.create(:user)
user2 = FactoryBot.create(:user)というふうにすると、uniqueness: trueのバリデーションを持つ属性がエラーを起こす。(それはそう。だって一つのEmailを複数回参照しているだけだもの )
この時、シーケンスを利用すると、ユニークであるべき属性に干渉しないようにインクリメンタルなカウンタを追加して属性値を設定する。

#:before
FactoryBot.define do
	factory :user do
		first_name { "Aaron"}
		last_name { "Sumner "}
		email { "tester@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end

#:after
FactoryBot.define do
	factory :user do
		first_name { "Aaron"}
		last_name { "Sumner "}
		sequence(:email) { |n| "tester#{n}@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end
#sequence(:属性名) { |n| #{n} }
という形で記述することで、1-originのインクリメンタルな値がオブジェクト作成されるたびに設定される。

**関連付けされているActiverecordとFactoryBot


FactoryBot.define do
	factory :note do
		message { "My important note." }
		association :project #project
		association :user
	end
end
#このようにすることで、specファイルで以下のように書くと、
#紐づいた、ファクトリも自動で生成される。
##モデル同士の関連付けについてはアプリでの設定の話
note = FactoryBot.create(:note)

ただし、このときに、
まず、noteに関連づいたprojectを作成します。そのときproject自身にもuser(owner)との関連付けが別ファイルに記述されているので、note -> project1-user1という紐づいたnoteが作成され、
その後、noteに関連づいたuserを作成してくれる。
note -> user2

そのため、note自体には、user1のprojectと、user2との紐付けがされていることになって良くない・・・

ex)#association :userの部分を以下のように変えることで整合性がとれる

user { project.owner }


**Associationでの関連付け名に、FactoryBotも対応させる。これによって、テストファイルでもproject.userではなく、project.ownerのような書き方で振る舞いを確認できる。

ex)
class Project < ApplicationRecord
	belongs_to :owner, class_name: 'User', foreign_key: :user_id
end

このとき、FactoryBot側でも


FactoryBot.define do
	#ownerという名前で参照される可能性があることを伝える必要がある。
	factory :user, aliases: [:owner] do
		first_name { "Aaron"}
		last_name { "Sumner "}
		sequence(:email) { |n| "tester#{n}@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end



**ファクトリ内での重複をなくする工夫。
前提として、同じ型を作成するファクトリ複数定義可能、そのときモデル名を指定すること

ex)

#このときモデル名とファクトリー名が一致しないときに、class: Projectとモデルを指定することで、そのモデルスペックでファクトリを使用できるようになる。(今回の場合はProjectモデル)

#昨日が締切のプロジェクト
factory :project_due_yesterday, class: Project do
	sequence(:name) { |n| "Test Project #{n}" }
	description { "Sample project for testing purposes"}
		due_on { 1.day.ago }
		association :owner
	end
#今日締切のプロジェクト
factory :project_due_today, class: Project do
	sequence(:name) { |n| "Test Project #{n}" }
	description { "Sample project for testing purposes"}
		due_on { Date.current.in_time_zone }
		association :owner
	end
#明日が締切のプロジェクト
factory :project_due_yesterday, class: Project do
	sequence(:name) { |n| "Test Project #{n}" }
	description { "Sample project for testing purposes"}
		due_on { 1.day.from_now }
		association :owner
end

ref)***モデルスペックにおける魔法のマッチャーについて
モデルスペックファイルでは、require "rails_helper"しているので、あるモデルに定義されているメソッドを参照できる。
このとき、たとえば、スペックファイルにてbe_lateなどというマッチャを使うと、RSpecは当該モデル内にlateもしくはlate?で真偽値を返すメソッドを探し、存在する場合はそのメソッドの結果に応じた検証をしてくくれる。

上のような例の時、ファクトリは重複した要素が多く、モデル属性の変更があった場合には、すべてのファクトリを修正する必要がある。このようにファクトリの重複を減らすテクニックが2つある。

①ファクトリの継承 --具体的には、継承元になるファクトリに対して入れ子になるようにファクトリを定義し、変更したい属性の値のみを、オーバーライドする。(#このとき、class: でモデル名の指定の必要もなくなる。継承元で:モデル名(単数小文字)と指定している部分で、モデル名は指定しており、それを継承しているから。

ex)
FactoryBot.define do
	factory :project do
		
		factory :project_due_yesterday do
		end
		factory :project_due_today do
		end
		factory :project_due_tomorrow do
		end
	end
end


②trait --トレイトを使ってテストデータを構築する。トレイトでは属性値の集合をファクトリで定義する。

ex)
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Project #{n}" }
		description { "A test project." }
		due_on { 1.week.from_now }
		association :owner
		
		#昨日が締切のプロジェクト
		trait :due_yesterday do
			due_on {1.day.ago }
		end
		#昨日が締切のプロジェクト
		trait :due_today do
			due_on { Date.current.in_time_zone }
		end
		#昨日が締切のプロジェクト
		trait :due_tomorrow do
			due_on {1.day.from_now }
		end
		
	end
end


transientで動的に値を設定できるtraitになる。

trait :autcion_details do
	transient do
		end_time { '2024-01-10T19:45:27+09:00' }
	end
	
	auction_details do
		{
			bid_price:              100,
			tax_included_bid_price: (100 * 1.1).to_i,
			bid_count:              67,
			end_time:               end_time,
			status:                 'open'
		}
	end
end



trait :skip_validation do
	to_create { |instance| instance.save(validate: false) }
end

#スペックファイルにて
FactoryBot.create(:ファクトリの名前, :トレイト名前)
として、型となるファクトリをトレイトで指定された属性値で上書きして作成するイメージ。

**コールバック --FactoryBotのcreate前後、stub/buildの前後にアクションを追加すること。before_アクションみたいですね。
#時短の強力な材料にもなるが、同時に遅いテストや無駄に複雑なテストの原因にもなる。


ex)
 FactoryBot.define do
	 factory :project do
		 sequence(:name) { |n| "Test Project #{n}" }
		 description { "Sample project for testing purposes" }
		 due_on { 1.week.from_now }
		 association :owner
		
		
		#メモ付きのプロジェクト　
		trait :with_notes do
			after(:create) { |project| create_list(:note, 5, project: project) }
		end
		
	end
end

*create_listメソッド --create_list(生成するオブジェクトのモデル名, 個数, 関連付け名: 対応するモデルを指定して,,







***{コントローラスペック}======================
$ bin/rails g rspec:controller home --controller-specs --no-request-specs

#以前はbin/rails g rspec:controller home というコマンドでコントローラのテストが作成
#できましたが、RSpec Rails 4.0.0以降ではリクエストスペックが優先的に作成されるようになったため、--controller-specs --no-request-specs というオプションを付ける必要があります。

**コントローラスペックをもし作成する場合には、Access controlに限定して書くと良い。つまり、権限がないユーザが編集/削除できない.ログインしていないと見ることができない。等

ex)

RSpec.describe HomeController, type: :controller do
	describe "#index" do
		#正常なレスポンスの返すこと
		it "responds successfully" do
			get :index
			expect(response).to be_successful
			#be_successfulマッチャは200レスポンスであるということ。
		end
	end
	
end

*get :アクション名 --HTTPのGETリクエストが :アクションに来た時
*paramsを受け取るリクエスト時はgetの第二引数に、params: { id: 入れたい値 }と表記する
ex)get :show, params: { id: @project.id }

**response --ブラウザに返すべきアプリケーションの全データを保持しているオブジェクトです。つまり、HTTPレスポンス

{matcherまとめ}
**have_http_status "ステータスコード" --マッチャ。httpのステ−タスコードがmatchするかと検証する。

ex)
#正常なレスポンスの返すこと
it "responds successfully" do
	get :index
	expect(response).to have_http_status "200"
end


*be_successful -このマッチャは200レスポンスであるということ。

*redirect_to パス名 --指定されたパスへリダイレクトすることを検証。Named routeでも、相対パスでもだいじょぶ






**認証が必要なコントローラスペックで、ユーザのログイン状態をシュミレートしてテストを書いていく。

①まず,Deviseの提供する、認証が必要なコントローラアクションに対して、ユーザのログイン状態をシュミレートするへルパーを追加して、

#spec/rails_helper.rb

RSpec.configure do |config|
	 # 設定ブロックの他の処理は省略...
	
	 # コントローラスペックでDevise のテストヘルパーを使用する
	 config.include Devise::Test::ControllerHelpers, type: :controller
end


②sign_in "ユーザモデル"とテストで記述し、テストユーザログインしている状態をシュミレートする
ex)
describe "#index" do
	before do
		@user = FactoryBot.create(:user)
	end
	
	
	#正常なレスポンスを返すこと
	it "responds successfully" do
		sign_in @user
		get :index
		expect(response).to be_successful
	end
end


また、guest（未認証のユーザ）のアクセスがあったとして、対応すると
ex)

context "as a guest" do
	#302レスポンスを返すこと
	it "returns a 302 response" do
		get :index
		expect(response).to have_http_status "302"
	end
	
	#サインイン画面にリダイレクトする
	it "redirects to the sign-in page" do
		get :index
		expect(response).to redirect_to new_user_session_path
		
	end
end

**ユーザの入力をテストする

project_params = FactoryBot.attributes_for(:project)
# =>
#{:name=>"Project 1",                                                            
#	:description=>"A test project.",                                               
#	:due_on=>Wed, 19 Oct 2022 11:58:19.483726000 UTC +00:00}      
を代入。つまり、プロジェクトのファクトリ(インスタンス)ではなく、属性値を、ハッシュの形で保持して、
#:createアクションにPOSTリクエストを、params[:project]値として、ハッシュを送信した時
expect { post :create, 
			   params: { project: project_params } 
				}.to change(@user.projects, :count).by(1)

#@user.projects <-ユーザに関連づいたプロジェクト, :countの数が1つ増えることを検証

このとき
changeマッチャーはchange(obj, :msg)もしくはchange { block }
の書式を取ることができる

ex)
change(@user.projects, :count).by(1)
change { @user.projects.count }.by(1)
は同義


**controllerスペックで、HTML以外の出力を扱う。
#get :アクション指定, format: :jsonで形式指定して,
#expect(response.content_type).to include "application/json"の部分で、application/json のContent-Type でレスポンスを返すことを確認

require 'rails_helper'

RSpec.describe TasksController, type: :controller do
	before do
		@user = FactoryBot.create(:user)
		@project = FactoryBot.create(:project, owner: @user)
		@task = @project.tasks.create!(name: "Test task")
	end
	
	describe "#show" do
		#JSON形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			sign_in @user
			get :show, format: :json,
			params: { project_id: @project.id, id: @task.id}
			expect(response.content_type).to include "application/json"
		end
	end
end


***システムスペック(統合テスト)を書く。~UIをテストする~


*SystemSpecの必要性。--単体テストでは表現しきれない。ユーザと作成中のアプリケーションとのやりとりを再現し、それをテストできる。ということ。

*Rails標準でインストールされているCapybaraは統合テストの環境を提供するが、ジェネレータは用意されていないよ！

**システムテストファイルのジェネレートコマンド
$ rails generate rspec:system projects

**コントローラスペックとシステムスペックの違い。
コントローラスペックでは、UIを無視して、ユーザから送信されるであろうパラメータを直接コントローラのメソッド(アクション)に送信する。
システムスペックでは、複数のコントローラの複数のメソッドを一つのスペックでテストすることができる。(devise::session＃new~~~project＃newまでさまざま)

ex)
#ユーザは新しいプロジェクトを作成する
scenario " user creats a new project" do
	user = FactoryBot.create(:user)
	
	visit root_path
	click_link "Sign in"
	fill_in "Email", with: user.email
	fill_in "Password", with: user.password
	click_button "Log in"
	
	expect { 
		click_link "New Project"
		fill_in "Name", with: "Test Project"
		fill_in "Description", with: "Trying out Capybara"
		click_button "Create Project"
		
		expect(page).to have_content "Project was successfully created"
		expect(page).to have_content "Test Project"
		expect(page).to  have_content "Owner: #{user.name}"
	}.to change(user.projects, :count).by(1)
end
end
#click_linkなどは、CapybaraのDSL(固有の言語)

**click_button を使うと、起動されたアクションが完了する前に次の処理へ移ってし
まうことがあります。そこで、click_button を実行したexpect{} の内部で最低で
も1個以上のエクスペクテーションを実行し、処理の完了を待つようにするのが良い
でしょう


*senarioはexampleを宣言するitのエイリアス。どちらで書いても挙動は同様。より自然は英文を書くために使い分けると良いでしょう。

*システムスペックでは、1つのexampleに複数のexpectationを書くのはOK!

*ログイン機能の詳細なシステムスペックと、ログインしてからプロジェクトを作成するまでのシステムスペックは、別に書かれるほうが好まれる。
->どのようなシナリオ(ユーザからの一連のアクション)に対するテストなのかを明確にしたい。　


**{CapybaraのDSL/メソッド達}-----
#指定されたぺーじを開く
visit 名前付きルートor"パス（URL）"

#指定した文字列のリンクをクリックする
#(画面上の"sign_in" aタグをクリック )
click_link "sign_in" 


#指定したボタンのラベルをクリックする
click_button "Log in"

##click_link + click_button
#"文字列"という文言のある。ボタン/リンクをクリックする
click_on "文字列"



# チェックボックスのラベルをチェックする
check "A checkbox label"
# チェックボックスのラベルのチェックを外す
uncheck "A checkbox label"

# ラジオボタンのラベルを選択する
choose "A radio button label"
# セレクトメニューからオプションを選択する
select "An option", from: "A select menu"
# ファイルアップロードのラベルでファイルを添付する
attach_file "A file upload label", "/some/file/in/my/test/suite.gif"

#フォームに入力する。with: "この文言を"
#HTMLファイル内でフォームを選択する時は、タグ内のテキスト要素もしくは、idタグを指定すること。
#"Emailラベルのあるフォームに、user.emailの値を入力する。
fill_in "Email", with: user.email

#have_content -表示されているページに 指定した文字列がコンテンツとして表示されていることを検証する
expect(page).to have_content "Project was successfully created"

#have_css -指定したCSS に一致する要素が存在することを検証する
expect(page).to have_css "h2#subheading"
#have_css -CSSの指定に一致するかつ、中のtextを検証する時
expect(page).to have_css "label.completed", text: name


#have_selector -指定したセレクタに一致する要素が存在することを検証する
expect(page).to have_selector "ul li"
#have_current_path -現在のパスが指定されたパスであることを検証する
expect(page).to have_current_path "/projects/new"

#ダイアログボックスについてのメソッド

:accept_alert
:accept_confirm
:dismiss_confirm
:accept_prompt
:dismiss_prompt

ex)page.accept_confirm

**withinブロックをつかって、スコープを限定する

ex)
<div id="node">
<a href="http://nodejs.org">click here!</a>
</div>
<div id="rails">
<a href="http://rubyonrails.org">click here!</a>
</div>
上のようなHTML では次のようにしてアクセスしたいclick here! のリンクを選択できます。
within "#rails" do
	click_link "click here!"
end

また、Capybara にはさまざまなfind メソッドもあります。これを使うと値を指定して特
定の要素を取り出すこともできます。たとえば次のような感じです。
language = find_field("Programming language").value
expect(language).to eq "Ruby"
find("#fine_print").find("#disclaimer").click
find_button("Publish").click

詳細については
https://github.com/teamcapybara/capybara#the-dsl


**driven_by(:rack_test)メソッドを使うと、Capybara はヘッドレスブラウザ（UI を持たないブラウザ）を使ってテストを実行するため、処理が比較的高速ではあるが、処理ステップを一つずつ目で
確認することはできません
ex)
before do
	driven_by(:rack_test)
end

*save_and_open_page --このメソッドをスペックの中に差し込むと、テストが失敗した時に、Railsがブラウザに返したHTMLを見ることができる。(debug用のメソッドなのでテストがパスするようになったら削除するのを忘れずに)

saveされたページのURLが発行され、それをブラウザで見ることができる。/コンテナ環境ではsave_pageメソッドを使って、HTMLファイルをtmp/capybaraに保存したのを見てください。

さらにLaunchy(gem)をインストールすると、自動でブラウザを起動してくれる

```
gem 'launchy' 




***{Javascriptを用いた操作のテストを行う}
Capybaraはシンプルなブラウザシミュレータ（つまりドライバ）を使って、テストに書かれたタスクを実行してきました。このドライバはRack::Test というドライバで、速くて信頼性が高いのですが、JavaScript の実行はサポートしていません。


scenario "user toggles a task", js: true do ~end
#このシナリオにおいて、js: trueというオプションを渡すことで、JavaScriptが使えるドライバの使用を指定できる。
	
	また、使用するドライバはdriven_by メソッドを使ってテストごとに変更することができます。
	

#spec/rails_helpr.rbにて

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }
のコメントをアウトを外すことで、自前の設定ファイルをspec/support/下に配置することができる。

#例  ドライバの出し分け設定

spec/support/capybara.rb
RSpec.configure do |config|
	config.before(:each, type: :system) do
		driven_by :rack_test
	end
	config.before(:each, type: :system, js: true) do
		driven_by :selenium_chrome
	end
end


**Continuous Integration環境ではCLI上でテストが実行される必要があるので、Capybaraはヘッドレスドライバが使えるよ。

**Capybaraのデフォルト設定では、ボタンが現れるまで2秒待ちます。2秒経っても表示されないときは諦めます。この時間も設定できます。

rails_helperが読み込まれるファイル内で

Capybara.default_max_wait_time = 15などと記述するか

特定のシナリオの際だけ、待ち時間を長くするシナリオを設定すると良い。
# 本当に遅い処理を実行する
scenario "runs a really slow process" do
	using_wait_time(15) do
		# テストを実行する
	end
end

##Rubyのsleepメソッドを使うのはNG

***スクリーンショットをとってデバッグを実行する。

- JasaScriptドライバ(selenium-webdriver)などを使うテスト環境では、take_scrrenshotメソッドをテスト内に埋め込んで、ブラウザの実行状況のスクショが見れる。テストが失敗した場合には、自動でスクショされる。保存先は(tmp/capybara)

- Rack::Testドライバを使用している場合には、save_page/save_and_open_pageメソッドを使ってブラウザを開けたり、tmp/capybaraにHTMLファイルを出力させることができる。


**cookiesについてのsystemスペックを書きたいなら、
showmecookies gemをインストールすると良い。

https://qiita.com/CoGee/items/49fd706dd2fc17f991e0

**SystemSpecとFeatureSpec ---歴史的にはシステムスペックの方が新しく、Rails 5.1から導入されたシステムテストを利用している。
フィーチゃスペックはRSpec Rails独自の統合テスト機能だった。

**両者の違いについて(feature_specsの特徴まとめ)
- spec/system -> spec/featuresにファイルを保存している。
- describeの代わりにfeatureメソッドを使っている
- type: オプションには :featureが指定されている
- let/let!のエイリアスにgiven/given!が使える　
- beforeのエイリアスとしてbackgroundが使える
- save_screenshotが使えて,take_scrreenshotは使えない
- テスト失敗時に自動的にスクショをしてくれない

#以降についての注意点

spec/rails_helper.rb のconfig.include などで、type: :feature になっている設定があれ
ばtype: :system に変更する
Deviseのヘルパーとかね

***リクエストスペックでAPIをテストする
Rspecの場合には、API関連の統合テストはspec/requsetsディレクトリに配置するのがベスト。システムスペックとは区別しましょう。リクエストスペックではCapybara も使いません。<- プログラム上のやりとりをシュミレートしないため。
HTTPリクエストに対応するメソッド(get, post, delete, patch)を使う。

コントローラースペックの時はgetメソッドに対して、そのコントローラの持つアクション名を指定していましたが、(つまり、スコープをそのコントローラのアクションに限定）。リクエストスペックでは、好きなルーティングにアクセスできます。

ex)
#some_controller_spec

get :show, params: { id: @project.id }

#some_request_spec

get api_projects_path,  params: {
	user_emai: user.email,
	user_token: user.authentication_token
}


*さらに、APIのテストだけでなく、コントローラスペックをリクエストスペックで置き換えることもできます。

***Deviseが用意するsign ヘルパーを使うには、設定で
config.include Devise::Test::ControllerHelpers, type: :controller
などのように追加する必要がある。


**設定ファイルをrails_helper.rb以外に用意して、理解しやすいディレクトリ構成にする。
#spec/rails_helper.rbにて

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

と追記して、設定ファイルをspec/supportディレクトリ下に置く。



***{specをDRYにする工夫(Everyday Rspec Chapter08)}--

**サポートモジュールの作成。
複数のsystemスペックにまたがるような共通のワークフローをspec/support/に切り出す。ex)userのlogin動作など

ex)
#spec/support/login_support.rb


module LoginSupport
	def sign_in_as(user)
		visit root_path
		click_link "Sign in"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"
	end
end

#RSpec全体にこのカスタムモジュールをinclude
RSpec.configure do |config|
	config.include LoginSupport
end

**deviseのへルパーである。sign_inメソッドを使ってみる。
この時、deviseのヘルパーはセッションを作成するだけで、実際のワークフロー、つまり、ユーザが行うページの遷移を実行できていない。
もし、Deviseヘルパーを使うなら,,,


sign_in user #deviseヘルパー

visit root_path #<-これにより、ワークフロー開始を明示的に記述する必要がある。

deviseヘルパーでセッションの実現を手軽に行うのか？
それとも、サポートメソッドをカスタムするのか？

*結論は、ログインまでの流れ自体をワークフローを文書化しているので、
例えば、ユーザのログインに関するsystemスペックでは、カスタムサポートメソッドを使って、end-to-endでユーザの動作を再現できる方が好ましい。(その中で、テスト間で共通する動作を切り出すイメージ)

*逆に、project作成/microposts作成など、ログインに関するステップがテスト上で重要な機能になっていない時は、Deviseヘルパーを活用して、簡便に済ませて良い。



*letをつかった遅延読み込み --無効なデータをチェックする時に、実際に有効なデータは不要である。そのため、before と＠変数を用意するよりも、より速いテストが書ける。

**注意点
ユーザの総数など、countする際にはletを呼び出していないexampleでは、zeroになるので呼び出すことを意識する。



*shared_contextで、複数のテストファイルで必要なセットアップを行う。

前述のように、

RSpec. ...do 
のブロック内で定義しても良いし、
end

別ファイルを用意して
#spec/support/contexts.rbというようにして

RSpec.shared_context "project setup" do
let(:user) { FactoryBot.create(:user) }
let(:project) { FactoryBot.create(:project, owner: user) }
let(:task) { project.tasks.create!(name: "Test task") }
end
というように書いても良い。


**カスタムマッチャ

RSpec::Matchers.define :have_content_type do |expected|
	match do |actual|
		content_types = {
										 html: "text/html",
										 json: "application/json",
										 }
		
		actual.content_type.include?　content_types[expected.to_sym]
	end
end

マッチャを自作する時には、(一応DSL)matchメソッドを使う.
二つの値を、利用（引数として取る？）expected/actual

このメソッドでは、
actual.content_type の部分が'actual value'のcontentタイプの配列を意味し、その配列(text/html等)に対してinclude?メソッドを使用。その引数に用意したcontent_typesハッシュの中で、keyが'expected value'をto_symでシンボル化ものがあるか？でboolean値を返すように設定している。
ex)メソッドを定義して、リファクタリング
RSpec::Matchers.define :have_content_type do |expected|
	match do |actual|
		begin
			actual.content_type.include? content_type(expected)
		rescue ArgumentError
			false
		end
		
	end
	
	def content_type(type)
		types =  {
							html: "text/html",
							json: "application/json",
							}
		types[type.to_sym] || "unknown content type"
	end
	
end




ただ、このままだと、failした時のエラーメッセージがかなり読みづらいので、カスタムマッチャをリファクタリングしていく。

DSLに
failure_message/failure_message_when_negated(to_notで失敗した時のエラーメッセージ)メソッドが用意されている。

**ただ、カスタムマッチャを使うと、メンテするコードが増えるし。ロジックを組む必要がある。shoulda-matchers gemでマッチャを拡張できるので、導入を検討すること。


**aggregate_failures(失敗の集約) --テスト失敗時に即時停止するのではなく、残りのステップも続行させること  aggregate--集約の意の英単語
#エスクペクテーションが失敗しても最後までテストを実行するので、エスクペクテーション内での失敗をまとめて管理できる。
#{注意点} エクスペクテーション以外での失敗については、即時停止でエラーが発生する。(sign_in @user <-ユーザが無効な場合など)
ex)
describe "#index" do
	context "as an authenticated user" do
		before do
			@user = FactoryBot.create(:user)
		end
		
		it "responds successfully" do
			sign_in @user
			get :index
			aggregate_failures do
				expect(response).to be_successful
				expect(response).to have_http_status "200"
			end
		end
	end
end


**また、システムスペックでテスト内容が煩雑になった時は、まとまったアクションをヘルパーメソッドに切り出すと良い。　

ex)
scenario "user toggles a task", js: true do
	sign_in user
	go_to_project "RSpec tutorial"
	
	complete_task "Finish RSpec tutorial"
	expect_complete_task "Finish RSpec tutorial"
	
	undo_complete_task "Finish RSpec tutorial"
	expect_incomplete_task "Finish RSpec tutorial"
end

def go_to_project(name)
	visit_root_path
	click_link name
end

def complete_task(name)
	check name
end

def undo_complete_task(name)
	uncheck name
end

def expect_complete_task(name)
	aggregate_failures do
		expect(page).to have_css "label.completed", text: name
		expect(task.reload).to be_completed
	end
end

def expect_incomplete_task(name)
	aggregate_failures do
		expect(page).to_not have_css "label.completed", text: name
		expect(task.reload).to_not be_completed
	end
end



***Make it work, make it right, make it fast
まず、動くものを書く
次にリファクタリングをして重複をなくする。
最後に速く書く。速くとは、1つには、スペックの実行時間を速くする。
2つ目に、わかりやすく、綺麗なスペックを素早く書くという意味。


**subjectを使って、テストの対象物(主語)を宣言する。

**is_expectedをつかって it xx do ~endのブロックで記述されているテストをワンライナーにする。
、subject が一つのテストでしか使われない場合もsubject を使いません
ref) everyday spec p164


**{Shoulda Matchers を導入する。}
Shoulda Matchers --gemで、ActiveModel/ActiveRecord/ActionControllerに使える豊富なマッチャのコレクションを提供するgem（Minitestでも使うことができる。）

1. gem 'shoulda-matchers'を#bundle installして

2. spec/rails_helpers.rbで設定変更する　
Shoulda::Matchers.configure do |config|
	config.integrate do |with|
		with.test_framework :rspec
		with.library :rails
	end
end


ex)

RSpec.describe User, type: :model do
_	it { is_expected.to validate_presence_of :last_name }
	it { is_expected.to validate_presence_of :email }
	#Userモデルが、大文字小文字を区別しない一意性を持つというexpectation
	it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
end



スタブ --オブジェクトのメソッドをオーバーライドし、事前に決められた値を返す。つまり、呼び出されるとテスト用に本物の結果を返す、ダミーメソ
ッドです。メソッドのでフォルト機能をオーバーライドするケースが多く、データベースやネットワークを使う処理が対象になる。




{Mock/test doubles} 前述のノートも参照するように
ex)Userモデルについての実装についても記述されたイマイチなテスト例
#つまりUserのnameが last_name + first_nameで導出されることをNoteモデルのスペックで知っている必要がないということ。
it "delegates name to the user who created it" do
	user = FactoryBot.create(:user, first_name: "Fake", last_name: "User")
	note = Note.new(user: user)
	expect(note.user_name).to eq "Fake User"
end

ex2)#モックをユーザオブジェクトとテスト対象のメモに設定したスタブメソッドを使用。

#userのテストダブルを作成して,.name/_nameというメソッド（メッセージ）にだけに反応する
user = double("user", name: "Fake User")
note = Note.new

#スタブの作成.テスト内でnote.userが呼び出されることを伝えている。
#また、その時の対応に、return(user)で、作成したテストダブルを返すように指定
allow(note).to receive(:user).and_return(user)
expect(note.user_name).to eq "Fake User" #user_name -> user.nameを同じ。

#つまり、以下のようなテストは通らない。
expect(note.user.first_name).to eq "Fake"


この時注意しなければならないのは、User＃name というメソッドの名前を変えたり、このメソッドを削除したりしても、このテストはパスし続けてしまう、と
いう点

**基本的なRSpecのテストダブルには、代役になろうとしているオブジェクトが、スタブ化されたメソッドを持つかを検証しない。つまり、この場合user.name/user_nameが実際のアプリ内で実装されているメソッドで有るかに依存性がない。make upできるってことだね
->verified double(検証機能付きテストダブル)を作成してより、実装に近しいテストダブルを作る。

1. instance_doubleを使う。
ex)
user = instance_double("User", name: "Fake User")
#このモックでは、プレインなuserモック(name->Fake Userを持つ)を作るだけでなく、
#Userクラスのインスタンスとしてのモックを作成し、.nameメッセージに対しては、"Fake User"を返すようなモックオブジェクトを作成している。つまり、Userクラス内にnameメソッドが定義されていない場合には、エラーを発生させる。

このように、あえて独立したテストダブル(mock)ではなく、実際のモデルに依存性のあるテストオブジェクトを作成するようにすると、アプリケーションとしての質を担保するテストが書ける。


**DBへのアクセスをモックとスタブで再現するコントローラのテスト

require 'rails_helper'

RSpec.describe NOtes Controller, type: :controller do
	#"user"モックを作成,userで呼び出し時に作成される
	let(:user) { double("user") }
	#"Project"モックの作成、この場合にはowner/idの属性を取得するので、instance_doubleを使用。
	let(:project) { 
		instance_double("Projcet", owner: user, id: "123")
	}
	
	before do 
		#deviseジェムが用意するメソッドをスタブ化。<-passによって保護されているページだから。
		allow(request.env["warden"]).to receive(:authenticate!).and_return(user)
		allow(contoller).to receive(:current_user).and_return(user)
		#ActiveRecord#findメソッドもスタブ化
		#findでDBへのアクセスをさせないため。
		allow(Project).to receive(:find).with("123").and_return(project)
	end
	
	describe "#index" do
		#入力されたキーワードでメモを検索すること
		it :"seacrhes notes by the provided keyword" do
			expect(procject).to receive_message_chain(:notes, :search).with("rotate tires")
			get :index,
			params: { project_id: project.id, term: "rotate tires" }
			end
		end
	end


**receive_message_chain --RSpecの組み込みメソッド。allowと併用されて、あるオブジェクトが、任意のメソッドチェインを持つことを表す
ex)下の例だと、project.notes.searchを参照している。

describe "#index" do
	#入力されたキーワードでメモを検索すること
	it :"seacrhes notes by the provided keyword" do
		expect(project).to receive_message_chain(:notes, :search).with("rotate tires")
		get :index,
		params: { project_id: project.id, term: "rotate tires" }
		end
	end
end

**上の例で注意する点があるので、get :index, params: {}が後に来て不自然な点です。これは、expectで検証したいエクスペクテーションを前に書いた後で、get...でアプリケーションを動作させるためにこの語順になっています。
そうしないと、ここで、mock化しているprojectが、.notesメッセージを受け取ることが設定されていないからです。

先に、allowのようにexpectationを書いて、こうなること！(検証文)を書き、その後に実際にアプリケーションを実行して、結果が得られるようになってます。(なかなか複雑ですね。)


**タグ機能を使って、特定のテストだけを実行する。
$ bundle exec rspec --tag focus#EverydayRailsではfocusというタグを作っていた
$ bundle exec rspec --tag <タグ名>
$ bundle exec rspec --tag <~タグ名> #特定のタグ名のついたテストをskipする。

specでは、
it "processes a credit card", focus: true do
というようにタグづけする。

#spec/spec_helper.rbにて、
テストスイートの中に特定のタグがあったら、CLIで指定しなくとも、そのタグのついたテストだけを実行するように設定できる(特定のタグが見つからなかった場合には全てのテストスイートが実行される。)

#暗示に的にfocusタグがあるテストを実行する設定
RSpec.configure.do |config|
	config.filter_run_when_matching :focus
	# 他の設定が続く...
end
end
#暗示的にslowタグのあるテストをスキップする設定
	RSpec.configure do |config|
		config.filter_run_excluding slow: true
		# 他の設定が続く...
end


skipをつけて、不要なテストを避ける。もう必要がなければ削除しても構わない。


**allow_any_instance_of --allowの仲間、引数にクラス(モデル)を取り、any指定したオブジェクトに対して、updateメソッドが呼び出されると宣言し、その時に渡すparams:をwithで指定。戻り値まで指定を設定するスタブを作成
#他のテストスイートで使用されると、アプリの仕様を改変したテストが実行される危険があるため、仕様したいブロックを限定すること。



テストをする時の方針/
例えば新しい機能を追加したいと思った時には、その機能の正常系の動作をsystemspecやrequest specを使って、仕様を決定し、TDDで開発する。その後
より低次のテスト(modelすぺっく等)で、異常系の細微なテストを行う。と良い。

**意識としては、エンドユーザが実際にアプリを使って機能を操作する手順から、テストとして書いていき、その後細かい異常系などについては低レベルのテストで確認していく。



# [request spec]

- spec/requestsディレクトリを作成する。
概要としては、Capybaraを使うことなく、HTPTPメソッドに対応する(get等のメソッド)を使って、テストを行う。

e.g.) 認証トークン付きgetリクエスをする時の一例 (p 127)
```
RSpec.describe "Projects API", type: :request do
	it 'loads a project' do
		user = FactoryBot.create(:user)
		FactoryBot.create(:project, name: 'Sample Project')
		FactoryBot.create(:project,
		name: 'Second Sample Project',
		owner: user)
		
		get api_projects_path, params: {
			user_email: user.email,
			user_token: user.authentication_token
		}
		
		expect(response).to have_http_status(:success)
		json = JSON.parse(response.body)
		expect(json.length).to eq 1
		project_id = json[0]['id']
	end
end

## get の引数には好きなルーティングを取ることができる。

```

APIのテストなので、データのやり取りをする際には、毎回tokenが必要になる。

# Postリクエストもテストする。


# controller スペックをrequestスペックに置き換える

```
## 違いと言えば、postの引数に取るのが :createではなく、具体的なパス名になるということ。
e.g.)
RSpec.describe 'Projects', type: :request do
	context 'as an authenticated user' do
		before do
			@user = FactoryBot.create(:user)
		end
		
		context 'with valid attributes' do
			it 'adds a project' do
				project_params = FactorBot.attributes_for(:project)
				sign_in @user
				expect {
					post projects_path, params: {
						project: project_params
					}
				}.to change(@user.projects, :count).by(1)
			end
		end
		
		context 'with invalid attributes' do
			it 'doesnt add a project' do
				project_params = FactorBot.attributes_for(:project, :invalid)
				sign_in @user
				expect {
					post projects_path, params: {
						project: project_params
					}
				}.to_not change(@user.projects, :count)
			end
		end
	end
end
```


- 例外をテストする際には、
```
subject { -> { described_class.summary(zas_user) }}
```
などで、テスト対象を遅延評価させないと、アプリコード側で例外を発生させてしまう