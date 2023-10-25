FROM python:3.9                                                                                                                                                                                               
WORKDIR /app
RUN pip install --no-cache-dir Flask Flask-CORS speedtest-cli jsonify
RUN apt-get update && \
    apt-get install -y nodejs npm
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 4173
EXPOSE 5000
CMD ["sh", "-c", "python server/tester.py & npm run preview"]
