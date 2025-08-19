import dotenv from "dotenv";
dotenv.config();

const requiredVars = [
  "APILLON_API_KEY",
  "APILLON_API_SECRET",
  "APILLON_WEBSITE_UUID",
];

let allVarsSet = true;

requiredVars.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(
      `\x1b[31mError: ${variable} must be set in your .env file.\x1b[0m`
    );
    allVarsSet = false;
  }
});

if (!allVarsSet) {
  process.exit(1);
}

// Safely escape and print export statements
requiredVars.forEach((variable) => {
  const value = process.env[variable]
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/"/g, '\\"')
    .replace(/\$/g, "\\$");
  console.log(`export ${variable}="${value}"`);
});
