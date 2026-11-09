# Setup Google authentication

- Login at https://console.cloud.google.com/. When asked, choose the free tier
- Create a new project or select an existing project

<img width="736" height="167" alt="Schermafbeelding 2026-10-18 092949" src="https://github.com/user-attachments/assets/b6ac7d05-7d53-427e-be48-4fe2e8f3674d" />

- Navigate to the project dashboard

<img width="136" height="59" alt="Schermafbeelding 2026-10-18 093255" src="https://github.com/user-attachments/assets/12d81c2d-b5a7-4179-822d-b38a98b3082a" />

- In the project select 'APIs & Services' plus 'Credentials' from the menu

<img width="343" height="451" alt="Schermafbeelding 2026-10-18 093235" src="https://github.com/user-attachments/assets/a35243bf-9c6d-4009-86c0-4119658603ab" />

- Click 'Create Credentials' plus 'OAuth client ID'

<img width="241" height="144" alt="Create Credentials" src="https://github.com/user-attachments/assets/61fcbbfb-a7a7-4d18-8988-8eb52816e8c5" />

- First get started with the Branding

<img width="420" height="331" alt="image" src="https://github.com/user-attachments/assets/1a678e7a-ae85-4e9c-a792-30d7312b89ed" />

- select External Audience

- After finishing the 'Get started' branding, select branding again
- Fill in the app domain, privacy url and terms url

<img width="614" height="413" alt="Schermafbeelding 2026-10-18 095955" src="https://github.com/user-attachments/assets/a309d35b-84ec-4a13-83ca-c4b3592a68e7" />

- Fill in the authorized domain. Normally that is: \<Your Cloudflare subdomain\>.workers.dev

- Select the 'Clients' tab
- Create client
- Choose web application type: Web application
- Enter a name
- Add authorized redirect Url's. One with your production url, and another one for local development

<img width="258" height="113" alt="Add authorized redirect Url's" src="https://github.com/user-attachments/assets/17c07141-5cee-497c-b878-3d3cfdd7db34" />


- Push the create button
- Download or copy the client id and client secret. Put them in the `.env` file. Also put the client id in `wrangler.jsonc`. Use the `bun wrangler secret put GOOGLE_CLIENT_SECRET` command to upload the secret to Cloudflare.
- In the audience tab, click on 'Publish app'

<img width="396" height="332" alt="image" src="https://github.com/user-attachments/assets/9917ca7a-7bbf-4980-93a0-53ebb24bb51e" />


[More info](https://developers.google.com/identity/openid-connect/openid-connect)
