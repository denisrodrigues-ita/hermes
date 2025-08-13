# Pull Request Templates

This directory contains templates for Pull Requests in the Hermes project.

## Available Templates

1. **default.md**
   - Use for PRs from feature branches to the develop branch
   - Template for development and implementation of new features, bug fixes, and other changes
   - Includes detailed checklist and type categorization

2. **deploy.md**
   - Use for PRs from develop branch to main branch
   - Represents promotion to production environment
   - Focuses on release stability and validation

## How to Use

When creating a PR, GitHub will automatically present these templates via the main pull_request_template.md file, which provides links to choose between them.

Alternatively, you can manually add the `template` parameter to the PR creation URL:

- For PRs to develop:
  ```
  https://github.com/hermes-tek/hermes/compare/develop...your-branch?template=default.md
  ```

- For PRs to main:
  ```
  https://github.com/hermes-tek/hermes/compare/main...develop?template=deploy.md
  ```

## Template Contents

### Default Template (for feature to develop)
Includes:
- Description field
- Type of change categorization (feature, bug fix, etc.)
- Comprehensive checklist for code quality
- Evidence section for screenshots or logs
- Related links for tickets/issues
- Additional notes section

### Deploy Template (for develop to main)
Includes:
- Key changes summary
- Release validation checklist
- Evidence section
- Additional notes for production deployment information
