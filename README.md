# Sarah's Curling Stats

A searchable record of curling tournaments, team selections and trophy wins. The site uses plain HTML, CSS and JavaScript, so it has no build step or paid dependencies.

## Run locally

### Dev container

Open the repository in VS Code and run **Dev Containers: Reopen in Container**. The container uses a prebuilt Ubuntu image and installs Live Server plus the tools needed to work with Azure Static Web Apps:

- Azure CLI (`az`)
- Azure Static Web Apps CLI (`swa`)
- Node.js LTS and npm
- Azure CLI and Azure Static Web Apps VS Code extensions

Open `index.html`, then select **Open with Live Server** from the editor context menu or click **Go Live** in the status bar. VS Code forwards port `5500` and opens the preview.

Sign in to Azure when needed with `az login`. To run the site through the Azure Static Web Apps emulator, use:

```bash
swa start http://localhost:5500
```

### Without a container

From the repository root, start any static file server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Add a competition

Add another `article.competition` to the competition list in `index.html`. Include all searchable words in its `data-search` attribute. Use the existing records as the template.

## Deploy to Azure Static Web Apps

1. Push this repository to GitHub.
2. In the Azure portal, create a **Static Web App** using the free plan and connect the repository.
3. Set the app location to `/`.
4. Leave the API location and output location empty.
5. Azure will add a GitHub Actions workflow and publish the site.

`staticwebapp.config.json` supplies the fallback route and security headers automatically.