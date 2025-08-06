# Pull Request Templates

This directory contains templates for Pull Requests in the Hermes project.

## Available Templates

1. **feature_to_develop.md**
   - Use for PRs from feature branches to the develop branch
   - Used for development and implementation of new features

2. **develop_to_main.md**
   - Use for PRs from develop branch to main branch
   - Represents promotion to production environment

## How to Use

When creating a PR, GitHub will automatically detect these templates and offer a choice between them.

Alternatively, you can manually add the `template` parameter to the PR creation URL:

- For PRs to develop:
  ```
  https://github.com/hermes-tek/hermes/compare/develop...your-branch?template=feature_to_develop.md
  ```

- For PRs to main:
  ```
  https://github.com/hermes-tek/hermes/compare/main...develop?template=develop_to_main.md
  ```
