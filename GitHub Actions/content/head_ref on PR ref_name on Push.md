---
tags:
  - github-actions
  - workflow
  - ci
  - secrets
created: 2026-01-03
status: active
---

# head_ref on PR/ ref_name on Push

```YAML
name: Branch Name Test

on:
  push:
    branches: ['**']
  pull_request:
    branches: ['**']

jobs:
  test-branch-variables:
    runs-on: ubuntu-latest
    steps:
      - name: Display all relevant variables
        run: |
          echo "=== Event Type ==="
          echo "Event name: ${{ github.event_name }}"
          echo ""
          echo "=== Raw Variables ==="
          echo "github.ref: ${{ github.ref }}"
          echo "github.ref_name: ${{ github.ref_name }}"
          echo "github.head_ref: ${{ github.head_ref }}"
          echo "github.base_ref: ${{ github.base_ref }}"
          echo ""
          echo "=== Recommended Solution ==="
          echo "BRANCH=${{ github.head_ref || github.ref_name }}"
          echo ""
          echo "=== Commit SHA ==="
          echo "github.sha: ${{ github.sha }}"
          echo "PR head sha: ${{ github.event.pull_request.head.sha }}"
          echo "Unified SHA: ${{ github.event.pull_request.head.sha || github.sha }}"
          echo ""
          echo "=== Other Info ==="
          echo "Repository: ${{ github.repository }}"
          echo "Actor: ${{ github.actor }}"

      - name: Set branch name as environment variable
        run: |
          BRANCH_NAME="${{ github.head_ref || github.ref_name }}"
          echo "BRANCH_NAME=$BRANCH_NAME" >> $GITHUB_ENV
          echo "✅ Branch name set to: $BRANCH_NAME"

      - name: Verify branch name is consistent
        run: |
          echo "Branch name from ENV: $BRANCH_NAME"
          echo "This value should be the same for both push and pull_request events"

      - name: Display JSON context (debug)
        run: |
          echo "=== GitHub Context (JSON) ==="
          echo '${{ toJSON(github) }}' | jq '.' || echo '${{ toJSON(github) }}'
```