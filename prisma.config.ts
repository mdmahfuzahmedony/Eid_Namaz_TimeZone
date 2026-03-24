import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

// @ts-ignore
export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})