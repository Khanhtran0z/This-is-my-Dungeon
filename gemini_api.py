# Gemini API integration (placeholder)
import requests

class GeminiAPI:
    def __init__(self, api_key=None):
        self.api_key = api_key or self.load_api_key()
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    def load_api_key(self):
        try:
            with open("gemini_api_key.txt", "r") as f:
                return f.read().strip()
        except FileNotFoundError:
            print("Gemini API key file not found. Please create 'gemini_api_key.txt'.")
            return None

    def ask(self, prompt):
        if not self.api_key:
            return "No API key set."
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        params = {"key": self.api_key}
        response = requests.post(self.base_url, headers=headers, params=params, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return f"Error: {response.status_code} - {response.text}"
