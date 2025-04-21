import OpenAI from "openai"

const client = new OpenAI(
    "https://api.aimlapi.com/v1",
    "ccd4362c4a1f4cfb99c8baa1e2611262",    
)

const response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a one-sentence story about numbers."}]
)

print(response.choices[0].messager.content)