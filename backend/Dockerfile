# =========================================================
# STAGE 1: Build Spring Boot 3 Executable with Maven
# =========================================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code
COPY src ./src

# Package production executable WAR or JAR
RUN mvn clean package -DskipTests=true -B

# =========================================================
# STAGE 2: Hardened, Non-Root Eclipse Temurin 17 JRE Runtime
# =========================================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Create unprivileged system user for enterprise security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy packaged JAR or WAR from builder stage
COPY --from=builder /build/target/*.[jw]ar app.jar

# Set ownership to unprivileged user
RUN chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

# Production JVM optimizations for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

# Healthcheck to verify Spring Boot is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-8080}/api/music/default || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
