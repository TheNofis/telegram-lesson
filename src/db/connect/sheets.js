import { google } from "googleapis";

const auth = await new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
}).getClient();

export default google.sheets({ version: "v4", auth: auth });
