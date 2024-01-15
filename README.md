# Credit Card Recommendation Service

## Overview

This service aims to revolutionize the Credit Card Recommendation experience by allowing users to inquire about the best credit cards for one or more merchants simultaneously. Users can receive comprehensive recommendations based on a list of merchants and their corresponding credit card rewards.

## Components

### OpenAI Integration

The project utilizes the OpenAI GPT-3.5 Turbo model for natural language processing.

### Credit Card Recommendation

The service  supports queries for one or more merchants. It includes a function to extract the list of merchant names from user queries. The system then makes API calls to the merchant credit card reward API provided by Heymax AI, obtaining information about credit card rewards for each specified merchant. Alternatively, this information can be retrieved by querying the database for the respective credit card data for each merchant—a process known as Retrieval-Augmented Generation.

The obtained data is utilized with the user's query to prompt the OpenAI model for comprehensive credit card recommendations tailored to the specified list of merchants.

Here are the prompt training examples used for the OpenAI model:

```javascript
const messages = [
   {
        role: "user",
        content: `Context: User is providing a list of one or more merchants. Return only the names of the merchants if mentioned in the query.`,
   },
   {
        role: "user",
        content: `Question: ${query}`,
   },
  {
    role: "user",
    content: `Context: User is asking about which credit cards are best to be used for the given list of merchants. Make sure to be straight to the point.`,
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
  "query": "Which cards are best for shopping with merchants: Singapore Airlines, Nike, and Apple Store."
}
```

### Output:

```json
{
  "response": "Based on the available credit cards, the following recommendations are provided:\n\n1. For Singapore Airlines: [Credit Card Information]\n2. For Nike: [Credit Card Information]\n3. For Apple Store: [Credit Card Information]\n\nThese recommendations are tailored to maximize your rewards for each specific merchant. For detailed information on each credit card, please refer to the respective issuer's website."
}
```

Now, users can efficiently explore the best credit card options for their preferred list of merchants in a single interaction.

### Possible Use Cases:

- **Users can receive optimal card and reward suggestions from a selection of merchants based on their current or chosen location, store category, and store open/closed status.**
