import { NextResponse } from "next/server";
import OpenAI from "openai";

const jsonTemplate = `{
  "vacation_budget": {
    "total_budget": null,
    "money_spent": null,
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
    const data = await req.json();

    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": `You are an AI model that only returns JSON. Here is the template: ${jsonTemplate}
            Always edit and return the JSON template based on user input. Do not include any text outside the JSON structure. For the money_spent key can you input the total amount of money spent 
            from the expenses.`},
            ...data,
            {
              "role": "system",
              "content": "Remember, your response must only contain a valid JSON structure. Do not include any explanations or text outside the JSON. Also only update the stored values of the json, don't try to add any keys. For the money_spent key can you input the total amount of money spent from the expenses."
            }
          ],
        model: "gpt-4o-mini",
      });
    
      // console.log(completion.choices[0].message.content);

      return new NextResponse(completion.choices[0].message.content);
}
