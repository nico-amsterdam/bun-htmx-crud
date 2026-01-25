# Setup Google authentication

- Login at https://console.cloud.google.com/. When asked, choose the free tier
- Create a new project or select an existing project
- Navigate to the project dashboard

<img width="248" height="105" alt="Project dashboard" src="https://github.com/user-attachments/assets/8ce92bc4-7e67-4ca6-96e4-2e4776b5f901" />

- In the project select 'APIs & Services' plus 'Credentials' from the menu

<img width="312" height="260" alt="APIs & Services" src="https://github.com/user-attachments/assets/b19d55e4-59f9-4ed6-86a0-e8d767fd52d4" />

- Click 'Create Credentials' plus 'OAuth client ID'

<img width="241" height="144" alt="Create Credentials" src="https://github.com/user-attachments/assets/61fcbbfb-a7a7-4d18-8988-8eb52816e8c5" />

- Choose web application type: Web application
- Enter a name
- Add authorized redirect Url's. One with your production url, and another one for local development

<img width="258" height="113" alt="Add authorized redirect Url's" src="https://github.com/user-attachments/assets/17c07141-5cee-497c-b878-3d3cfdd7db34" />


- Push the create button
- Download or copy the client id and client secret. Put them in the `.env` file. Also put the client id in `wrangler.jsonc`. Use the `bun wrangler secret put GOOGLE_CLIENT_SECRET` command to upload the secret to Cloudflare.
- In the audience tab, click on 'Publish app'

<img width="396" height="332" alt="image" src="https://github.com/user-attachments/assets/9917ca7a-7bbf-4980-93a0-53ebb24bb51e" />


[More info](https://developers.google.com/identity/openid-connect/openid-connect)
