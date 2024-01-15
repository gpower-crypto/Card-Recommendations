# Credit Card Recommendation Service

## Overview

This service aims to create a Credit Card Recommendation Service using OpenAI and external APIs. The service allows users to inquire about the best credit card to use for a specific merchant and receive recommendations based on merchant information and credit card rewards.

## Components

### OpenAI Integration

The project utilizes the OpenAI GPT-3.5 Turbo model for natural language processing.

### Credit Card Recommendation

The service includes a function to extract the merchant name from user queries. It makes an API call to the merchant credit card reward [API](https://rapidapi.com/max-now-max-now-default/api/merchant-credit-card-reward) provided by Heymax AI to get information about credit card rewards for a specific merchant. This can also be achieved by querying the database and obtaining the respective credit card data for a specific merchant. This process is called Retrieval-Augmented Generation.

The obtained data is used in conjunction with the user's query to prompt the OpenAI model for credit card recommendations.

Here are the prompt training examples used for the OpenAI model:

```javascript
const messages = [
   {
        role: "user",
        content: `Context: User is asking about merchant names. Return only the name of the merchant if mentioned in the query.`,
   },
   {
        role: "user",
        content: `Question: ${query}`,
   },
  {
    role: "user",
    content: `Context: User is asking about which credit cards are best to be used for the given merchant. Make sure to be straight to the point.`,
  },
  { role: "user", content: `Query: ${query}` },
  {
    role: "assistant",
    content: `CreditCardInfo: ${JSON.stringify(creditCardInfo)}`,
  },
];
```

## Example

### Input:

```json
{
  "query": "Which card is best for shopping with merchant Singapore airline."
}
```

### Output:

```json
{
  "response": "Based on the available credit cards, the best card for shopping with Singapore Airlines would be the American Express Singapore Airlines Business (HighFlyer) Card. It offers a high reward rate of 8.5 miles per dollar spent on Singapore Airlines flights when booked through the HighFlyer Account on the SIA website. It also provides a signup bonus of 30,000 HighFlyer Points when you spend S$4,000 within the first 3 months. The annual fee for this card is S$301.79. You can find more information and apply for the card on the American Express website."
}
```

Feel free to use and contribute to this Credit Card Recommendation Service!
