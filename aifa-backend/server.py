from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_ollama import OllamaLLM
import subprocess
import json

app = Flask(__name__)
CORS(app)

# ollama list to get model
def get_available_models():
    result = subprocess.run(["ollama", "list"], stdout=subprocess.PIPE, text=True)
    lines = result.stdout.strip().split("\n")
    models = []
    for line in lines[1:]:
        model_name = line.split()[0]
        models.append(model_name)
    return models

@app.route('/api/models', methods=['GET'])
def models_list():
    try:
        available_models = get_available_models()
        return jsonify(available_models)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_ollama():
    data = request.json
    user_prompt = data.get('prompt')
    selected_model = data.get('model')

    if not user_prompt or not selected_model:
        return jsonify({"error": "Prompt and model name are required."}), 400

    try:
        llm = OllamaLLM(model=selected_model)

        # use langchain to call model
        response = llm.invoke(user_prompt)

        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)