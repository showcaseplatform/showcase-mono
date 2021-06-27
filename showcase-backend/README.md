# Showcase - backend

## Getting started

Make sure to install:

- yarn
- Docker

## Local development

- Create `.env` file based on the contents of `.env.example`
- Run `yarn`
- Seed DB with `yarn prisma:seed`
- Run dev server: `yarn start:dev`

## Modify database schema / add new migrations

- Step1: Modify entities as needed
- Step 2 (optional): To make sure that db state is synced with current migrations
- Step 3 (optional): generate the new schema types for prisma client `yarn prisma:generate`
- Step 4 (optional): for local development you can push the changes to db without migration `yarn prisma:push`
- Step 5 generate and apply migration : `yarn prisma:migrate`
