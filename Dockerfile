FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN javac -cp "lib/sqlite-jdbc-3.53.2.0.jar" Main.java WebServer.java

EXPOSE 10000

CMD ["java", "-cp", ".:lib/sqlite-jdbc-3.53.2.0.jar", "Main"]
