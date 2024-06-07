from openai import AzureOpenAI

ENDPOINT = "https://itscharanteja-openai-1.openai.azure.com/"
API_KEY = "7558dddd2a8944e99356781352d9531b"

API_VERSION = "2024-02-01"
MODEL_NAME = "gpt1"

client = AzureOpenAI(
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
    api_version=API_VERSION,
)

user_prompt = input("Enter message to chat: ")

MESSAGES = [
    {"role":"system", "content":"You're an hackathon manager"},{"role":"user","content":user_prompt }
]

completion = client.chat.completions.create(
    model=MODEL_NAME,
    messages=MESSAGES,
)

generated_text = completion.choices[0].message.content
choices = completion

# Print the response
print("Response: " + generated_text + "\n")
# for choice in completion.choices:
#     print(choice.message.content)