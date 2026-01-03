---
tags:
  - rails
  - view
created: 2026-01-03
status: active
---

🔗

# link_toヘルパーの活用

```HTML
<li class="nav-item">
	<a class="nav-link active" 
		 aria-current="page" 
		 href="<%= root_path %>">
		Home
	</a>
</li>
  
```

こんな感じのいろいろな属性付き(bootstrapのクラスも入っている→スタイル付き)

のaタグをlink_toで書く時

```HTML
<li class="nav-item">
	<%= link_to "Home", root_path, 
											class: "nav-link active",
											aria_current: "page" %>
</li>
```

また、一番上のHTMLでも

`href="<%= root_path %`ここだけ、ERBをつかっている。現状どちらでも動作している。