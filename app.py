from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials

app = Flask(__name__)
CORS(app)

# ===== CONFIGURAÇÃO DO GOOGLE SHEETS =====
SCOPES = ["https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive"]
CREDS = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
client = gspread.authorize(CREDS)

# Substitua pelo nome da sua planilha
SHEET_NAME = "GreenLoop submissions"
sheet = client.open(SHEET_NAME).worksheet("Página1")


@app.route("/receber_dados", methods=["POST"])
def receber_dados():
    data = request.get_json()
    print("📦 Dados recebidos:", data)

    user = data.get("user", {})
    materials = data.get("materials", {})
    totalCrypto = data.get("totalCrypto", 0)
    timestamp = data.get("timestamp", "")

    # Monta uma linha com os dados principais
    row = [
        user.get("email", ""),
        user.get("cpf", ""),
        user.get("birthdate", ""),
        user.get("wallet", ""),
        materials.get("plastic", 0),
        materials.get("glass", 0),
        materials.get("paper", 0),
        materials.get("metal", 0),
        totalCrypto,
        timestamp
    ]

    # Adiciona ao Google Sheets
    sheet.append_row(row)

    return jsonify({"result": "success", "mensagem": "Dados enviados para o Google Sheets com sucesso!"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
