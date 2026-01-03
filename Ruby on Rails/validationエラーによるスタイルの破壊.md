---
tags:
  - rails
  - controller
  - view
  - config
created: 2026-01-03
status: active
---

# validationエラーによるスタイルの破壊

---

<div class=”field_with_errors”>で囲まれることで,

inlineからblockで囲まれたりするので注意が必要

- 対策1 、d-inline(bootstrap)などで、displayをblock/inlineを調整

- configを変更して、自動で追加されないようにする

```Ruby
#config/application.rb

module SampleApp
	class Application < Rails::Application
	# 他省略..
		config.action_view.field_error_proc = Proc.new { |html_tag, instance| html_tag }
	end
end
```