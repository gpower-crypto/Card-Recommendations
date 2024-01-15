const OpenAI = require("openai");
const axios = require("axios");

const OPENAI_API_KEY = "###";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Function to get the list of merchants from the query
async function getMerchantsList(query) {
  try {
    const messages = [
      {
        role: "user",
        content: `Context: User is providing a list of one or more merchants. Return only the names of the merchants if mentioned in the query.`,
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

    // Extract and return the list of merchants
    const merchantsList = response
      .trim()
      .split(",")
      .map((merchant) => merchant.trim());
    return merchantsList;
  } catch (error) {
    console.error(`Error in getMerchantsList: ${error}`);
    return null;
  }
}

// Function to get credit card information for a specific merchant from the API
async function getCreditCardInfoForMerchant(merchantName) {
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

    if (response.status === 200) {
      const creditCards = response.data[0]?.credit_cards?.slice(0, 6);
      return creditCards;
    } else {
      console.error(
        `Error fetching credit card information for ${merchantName}. Status code: ${response.status}`
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

    const merchantsList = await getMerchantsList(query);

    if (!merchantsList || merchantsList.length === 0) {
      console.error("Unable to extract the list of merchants from the query.");
      console.log(
        JSON.stringify({
          response: "Please provide a valid query with a list of merchants.",
        })
      );
      process.exit(0); // Exit without an error
    }

    const creditCardInfoPromises = merchantsList.map(async (merchant) => {
      const creditCardInfo = await getCreditCardInfoForMerchant(merchant);
      return { merchant, creditCardInfo };
    });

    const creditCardInfoList = await Promise.all(creditCardInfoPromises);

    const messages = creditCardInfoList.map(({ merchant, creditCardInfo }) => ({
      role: "assistant",
      content: `CreditCardInfo for ${merchant}: ${JSON.stringify(
        creditCardInfo
      )}`,
    }));

    const response = await openaiCompletion(messages);

    console.log(JSON.stringify({ response }));
  } catch (error) {
    console.error(`Unexpected error: ${error}`);
    console.log(JSON.stringify({ response: "An unexpected error occurred." }));
    process.exit(1); // Exit with an error
  }
}

main();
