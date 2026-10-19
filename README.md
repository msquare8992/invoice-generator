# Invoice Generator

A browser-based invoice generator based on the supplied Bisleri invoice format. Edit the invoice details, particulars, mandays, and rates; amounts, GST, grand total, and amount in words recalculate automatically. Use **Print / Save PDF** to create an A4 invoice.

## Run locally

```sh
npm ci
npm run dev
```

## Publish with GitHub Pages

1. Create a GitHub repository named `invoice-generator` and push this folder's contents to its `main` branch.
2. In the repository, open **Settings > Pages** and set the build and deployment source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys the site after each push to `main`. The published URL is shown in the workflow deployment and Pages settings.

The site is static and runs entirely in the visitor's browser. Edits are not saved to a server or shared between devices. The default invoice data is included in the public site, so change any sensitive values before publishing publicly.
