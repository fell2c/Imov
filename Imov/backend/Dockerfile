# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Confia na raiz do antivírus (Norton) que intercepta o TLS na rede local,
# senão o Maven não consegue baixar dependências do Maven Central.
COPY norton-root.crt /tmp/norton-root.crt
RUN keytool -importcert -noprompt -trustcacerts -alias norton -file /tmp/norton-root.crt -cacerts -storepass changeit

# Baixa as dependências primeiro (melhor cache)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Compila e empacota o jar
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
