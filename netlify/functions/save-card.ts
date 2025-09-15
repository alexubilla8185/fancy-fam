import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { randomBytes } from "crypto";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: "Card data is required" }) };
  }

  let cardData;
  try {
    cardData = JSON.parse(event.body);
  } catch (error) {
    console.error("Invalid JSON in request body:", error);
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid card data format." }) };
  }

  try {
    const id = randomBytes(6).toString("hex"); // 12-char ID, URL-safe

    const store = getStore("cards");
    await store.setJSON(id, cardData);

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error saving card to blob store:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not save card data due to a server issue." }),
    };
  }
};

export { handler };