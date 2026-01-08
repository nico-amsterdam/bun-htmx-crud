# Setup Github authentication

Github recommends to use a 'Github App' for authentication, but this will ask your users for permission to 'act on your behalf'. The wording is very confusing for end-users and it is an [unresolved issue since 2022](https://github.com/orgs/community/discussions/37117). Instead, you must create a Github 'OAuth App' which only ask the end-user access to 'public data only'.

To create the OAuth App:
- login with your account in [github.com](https://github.com/)
- In the upper right corner, click on your picture and goto settings:

<img width="159" height="276" alt="Github settings" src="https://github.com/user-attachments/assets/7a979212-984f-496f-a707-5a1338f5dabe" />

- Select 'Developer settings':

<img width="301" height="427" alt="Developer settings" src="https://github.com/user-attachments/assets/b68cc95d-4091-4c4b-9605-1420a4d2e2ac" />

- Select 'OAuth Apps'
- Click the 'New OAuth App' button
- Fill in the details. During local development fill in the logout url: 'http://localhost:8787/auth/github'. After deployment, change it to the url for production. In my case this is 'https://bun-htmx-crud.nico-amsterdam.workers.dev/auth/github'.

<img width="716" height="663" alt="Register OAuth App" src="https://github.com/user-attachments/assets/e2e14c48-8c02-4d45-87a3-3b68c91d049d" />

- Click on 'Register application'.
- Copy the client ID to your `.env` file and your `wrangler.jsonc` file
- Click on 'Generate a new client secret'
- Copy the secret to your clickboard and past it in your `.env` file. Use the `bun wrangler secret put GITHUB_CLIENT_SECRET` command to upload the secret to Cloudflare.




