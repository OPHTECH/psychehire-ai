FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/package.json
COPY packages/core/package.json packages/core/package.json
RUN npm install
COPY . .
RUN npm run build -w packages/core && npm run build -w apps/web
CMD ["npm", "run", "start", "-w", "apps/web"]

