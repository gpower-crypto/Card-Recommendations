const OpenAI = require("openai");
const axios = require("axios");

const OPENAI_API_KEY = "###";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Function to get the merchant name from the query
async function getMerchantName(query) {
  try {
    const messages = [
      {
        role: "user",
        content: `Context: User is asking about merchant names. Return only the name of the merchant if mentioned in the query.`,
      },
      {
        role: "user",
        content: `Question: ${query}`,
      },
    ];

    const response = await openaiCompletion(messages);

    if (response.includes("no answer")) {
      return null;
    }

    return response.trim();
  } catch (error) {
    console.error(`Error in getMerchantName: ${error}`);
    return null;
  }
}

// Function to get credit card information from the merchant API
async function getCreditCardInfo(merchantName) {
  try {
    const url = `https://merchant-credit-card-reward.p.rapidapi.com/api/rapidapi/merchant_reward?query=${encodeURIComponent(
      merchantName
    )}&country=SG`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "91e15c6d45msh6d97428a969f13ep120ac3jsn4332849ad9c6",
        "X-RapidAPI-Host": "merchant-credit-card-reward.p.rapidapi.com",
      },
    };

    const response = await axios.get(url, options);
    console.log(response.data);

    if (response.status === 200) {
      const creditCards = response.data[0]?.credit_cards?.slice(0, 6);
      return creditCards;
    } else {
      console.error(
        `Error fetching credit card information. Status code: ${response.status}`
      );
      return null;
    }
  } catch (error) {
    console.error(`Error fetching credit card information: ${error}`);
    return null;
  }
}

// Function to perform OpenAI completion
async function openaiCompletion(messages, model = "gpt-3.5-turbo") {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in openaiCompletion:", error);
    return null;
  }
}

// Main function
async function main() {
  try {
    const query = process.argv[2];

    if (!query) {
      console.error("Missing query argument.");
      console.log(
        JSON.stringify({
          response:
            "Please provide a query related to credit card recommendations.",
        })
      );
      process.exit(0); // Exit without an error
    }

    const merchantName = await getMerchantName(query);

    if (!merchantName) {
      console.error("Unable to extract merchant name from the query.");
      console.log(
        JSON.stringify({
          response: "Please provide a valid query with a merchant name.",
        })
      );
      process.exit(0); // Exit without an error
    }

    const creditCardInfo = await getCreditCardInfo(merchantName);

    if (!creditCardInfo) {
      console.error("Error fetching credit card information.");
      console.log(
        JSON.stringify({
          response: "An error occurred while fetching credit card information.",
        })
      );
      process.exit(0); // Exit without an error
    }

    const messages = [
      {
        role: "user",
        content: `Context: User is asking about which credit cards is best to be used for the given merchant. Make sure to be straight to the point. Dont ask the user to go to any other webiste.`,
      },
      { role: "user", content: `Query: ${query}` },
      {
        role: "assistant",
        content: `CreditCardInfo: ${JSON.stringify(creditCardInfo)}`,
      },
    ];

    const response = await openaiCompletion(messages);

    console.log(JSON.stringify({ response }));
  } catch (error) {
    console.error(`Unexpected error: ${error}`);
    console.log(JSON.stringify({ response: "An unexpected error occurred." }));
    process.exit(1); // Exit with an error
  }
}

main();
