---
tags:
  - rails
created: 2026-01-03
status: active
---

🪦

# ヘッダーの改良 active/aria_current

```HTML
<%# case request.pathとかで active/aria_currentを付け替えられるかも%>
      <ul class="navbar-nav text-end">
        <li class="nav-item">
          <% link_to "Home", root_path, class: "nav-link active",aria_current: "page" %>
        </li>
        <li class="nav-item">
          <%= link_to "About", about_path, class: "nav-link"%>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">login</a>
        </li>
```