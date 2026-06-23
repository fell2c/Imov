# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# URL da API usada em tempo de build pelo Vite (chamada a partir do navegador)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

# Confia na raiz do antivírus (Norton) que intercepta o TLS na rede local,
# senão o npm não consegue baixar pacotes do registry.
COPY norton-root.crt /tmp/norton-root.crt
ENV NODE_EXTRA_CA_CERTS=/tmp/norton-root.crt

# Instala dependências primeiro (melhor cache)
COPY package.json package-lock.json ./
RUN npm ci

# Build de produção
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
