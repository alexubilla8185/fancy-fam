import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { id } = event.queryStringParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Card ID is required" }),
    };
  }

  try {
    const store = getStore("cards");
    const cardData = await store.get(id, { type: "json" });

    if (!cardData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Card not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(cardData),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error fetching card:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve card data" }),
    };
  }
};

export { handler };
