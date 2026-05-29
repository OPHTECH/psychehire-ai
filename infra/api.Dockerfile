FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/core/package.json packages/core/package.json
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build -w packages/core && npm run build -w apps/api
CMD ["npm", "run", "start", "-w", "apps/api"]

