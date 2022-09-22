# Pelago - Next.js, SWR, NextAuth.js & Prisma vacation homes app
Fullstack Next.js vacation homes app with [magic email link authentication](https://next-auth.js.org/providers/email), [Supabase Postgres database](https://supabase.com/docs/guides/database), [Supabase bucket image hosting](https://supabase.com/docs/guides/storage) and [Prisma ORM](https://www.prisma.io/).

## Project setup
```
npm install
```
### Rename .env.example to .env
```environment
DATABASE_URL="YOUR-POSTGRES -URL"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR-NEXTAUTH-SECRET"
EMAIL_SERVER_HOST="YOUR-MAIL-SMTP-SERVER"
EMAIL_SERVER_PORT="YOUR-MAIL-SMTP-SERVER-PORT"
EMAIL_SERVER_USER="YOUR-MAIL-SMTP-SERVER-USER"
EMAIL_SERVER_PASSWORD="YOUR-MAIL-SMTP-SERVER-PASSWORD"
EMAIL_FROM="YOUR-MAIL-FOR-SENDING-OUT-AUTHENTICATION-LINKS"
SUPABASE_URL="YOUR-SUPABASE-STORAGE_BUCKET"
SUPABASE_KEY="YOUR-SUPABASE-STORAGE-BUCKET-KEY"
SUPABASE_BUCKET="YOUR-SUPABASE-STORAGE-BUCKET-NAME"
```

## Development
```
npm run dev
```

## Build
```
npm run build
```

## Run production build locally
```
npm run build && npm run start
```

## Prisma model
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Home {
  id          String   @id @default(cuid())
  image       String?
  title       String
  description String
  price       Float
  guests      Int
  beds        Int
  baths       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  owner       User     @relation("ListedHomes", fields: [ownerId], references: [id])
  ownerId     String
  favoritedBy User[]   @relation("FavoriteHomes")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
  oauth_token_secret String?
  oauth_token        String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  listedHomes   Home[]    @relation("ListedHomes")
  favoriteHomes Home[]    @relation("FavoriteHomes")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```