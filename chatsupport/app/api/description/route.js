import { NextResponse } from "next/server";
import OpenAI from "openai"


const jsonTemplate = `{
    "vacation_budget": {
      "total_budget": null,
      "expenses": {
        "flight": null,
        "accommodation": null,
        "activities": null,
        "food": null,
        "transportation": null,
        "souvenirs": null
      }
    }
  }`;

export async function POST(req)
{
    const openai = new OpenAI();
    const { conversation, expenseJson } = await req.json();

    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": `You are an AI model that only returns JSON. Here is the template: ${jsonTemplate}
            Always edit and return the JSON template based on user input. The JSON should not include the prices mentioned, but rather a small description that explains how that price was reached. Only change the description of the key if you detect a change in that specific key's price`},
            ...conversation,
            {
              "role": "system",
              "content": "Remember, your response must only contain a valid JSON structure. Do not include any explanations or text outside the JSON. Also only update the stored values of the json, don't try to add any keys. Only change the description of the key if you detect a change in that specific key's price"
            }
          ],
        model: "gpt-4o-mini",
      });
    
      console.log(completion.choices[0].message.content);

      return new NextResponse(completion.choices[0].message.content);
}