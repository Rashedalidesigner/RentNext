import dotenv from "dotenv";
import path from "node:path";

dotenv.config({path:path.join(process.cwd(),".env")});

const config = {
    database_url : process.env.DATABASE_URL,
    
    port : process.env.PORT || "4000",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
    access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
    access_token_expire: process.env.ACCESS_TOKEN_EXPIRE as string,
    refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE as string,
    access_token_salt_round : process.env.ACCESS_TOKEN_SALT_ROUND as string,
    refresh_token_salt_round : process.env.REFRESH_TOKEN_SALT_ROUND as string,
    stripe_secret_key : process.env.STRIPE_SECRET_KEY as string
};

// console.log(config.stripe_secret_key);

export default config;
