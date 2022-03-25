# react-sitecore-personalize
### React Sitecore Personalize Module

The [Sitecore Personalize](https://www.sitecore.com/knowledge-center/digital-marketing-resources/what-is-a-cdp) react module is a wrapper for Sitecore Boever [Direct Client Script](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/javascript-tagging-examples-for-web-pages.html) allowing you to add this script to react based apps. Making it easier for you to get started Personalizing your react based apps and sending events to Sitecore Personalize.

## Installation

```bash
npm install --save react-sitecore-personalize

```

or

```bash
yarn add react-sitecore-personalize

```

## How to Use

**initClientScript** Function is used to add Sitecore Direct Client Script within Body tag. For [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/javascript-tagging-examples-for-web-pages.html). Parameters: 
- clientKey - Your Client Key. 
- cookieDomain - Your top level cookie domain of the website that is being integrated e.g ".example.com" and not "www.example.com".
- apiEndpoint - Your API target endpoint specific to your data center region. [Europe](https://api.boxever.com/v1.2), [United States](https://api-us.boxever.com/v1.2), [Asia Pacific](https://api-ap-southeast-2-production.boxever.com/v1.2)
- clientVersion - Client Versions the [Release Notes JS Library](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/release-notes-for-javascript-library.html) provides the available versions. 
- eventSettings - Common Event properties LogEvents: enable/disable console logs, Pos: Your Point Of Sale, Currency: Currency used in POS ex 'USD', Language: Language in use ex 'EN', Channel: The channel captured ex 'WEB'.  

```js
import { useEffect } from 'react'
import { initClientScript } from 'react-sitecore-personalize'

export default function MyApp({ Component, pageProps }: AppProps) {
...
    useEffect(()=>{
        initClientScript('[Your api clientKey]','[domain]','https://api.boxever.com/v1.2','1.4.6', {LogEvents:true,Pos:'[your point of sale]',Currency:'USD',Language:'EN',Channel:'WEB'})
    })
...
}
```

**sendViewEvent** - Function Sends View event to Sitecore Personalize for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-view-event-to-the-sitecore-cdp.html). Parameters:
 - page - The name of the webpage the guest visited.

 **sendAddEvent** - Function Sends ADD event to Sitecore Personalize 
 for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-an-add-event-to-sitecore-cdp.html). Parameters:
 - page - The name of the webpage the guest visited. Required.
 - productType - The type of product added to cart. Required
 - itemId - The item id of the product added to cart. Required.
 - productName - The name of the product added to the cart. Required.
 - productId - The product ID of the product added. Used in analytics for reporting. Required.
 - orderDate - The date and time the product was ordered. Required.
 - qty - The number of unit added. Total price of the product is calculated by unit price multiplied by quantity. Required
 - price - The unit price of the product. 
 
 **sendConfirmEvent** Function Sends CONFIRM order event for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-confirm-event-to-sitecore-cdp.html). Parameters:
 - page - The name of the webpage the guest visited. Required.
 - orderItems - array containing a list of item_id objects to be confirmed, where item_id maps to the productId to be confirmed, for example: lineItems.map(lineitem => ({item_id:lineitem.productId}). Required

**sendCheckoutEvent** Function Sends CHECKOUT event to Sitecore Personalize for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-checkout-event-to-sitecore-cdp.html). Parameters:
- page - The name of the webpage the guest visited. Required.
- orderReferenceId - The reference of the order. Required.
- orderStatus - The status of the order. Required.

**sendPaymentEvent** Function Sends PAYMENT event using Direct Client Script, for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-payment-event-to-sitecore-cdp.html). Parameters:
- page - The name of the webpage the guest visited.
- paymentType - The method of payment associated with a checkout.

**sendIdentityByEmailEvent** Sends IDENTITY event using Direct Client Script   
  email provider for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-an-identity-event-to-sitecore-cdp.html). Parameters:
 - page - The name of the webpage the guest visited. Required
 - email - The email address of the guest. Required
 - title - The title of the guest. Optional
 - firstName - The first name of the guest. Optional
 - lastName - The last name of the guest. Optional
 - gender - The gender of the guest. Optional
 - dob - The date of birth of the guest. Optional
 - mobile - The mobile number of the guest. Optional
 - phone - The phone number of the guest. Optional
 - street - The street address of the guest. Optional
 - city - The city address of the guest. Optional
 - state - The state address of the guest. Optional
 - country - The country address of the guest. Optional
 - postalCode - The postal code of the guest. Optional
 
 **sendSearchEvent** Function Sends SEARCH event using Direct Client Script for [more info](https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-search-event-to-sitecore-cdp.html). Parameters: 
 - page - The name of the webpage the guest visited.
 - productName - The product name the guest searched for.
 - productType - The product type the guest searched for.
 
