/**
 * React Sitecore Personalize Module
 *
 * @package react-sitecore-personalize
 * @author  Neil Killen <neil.killen@gmail.com>
 */

//#region Common
declare global {
    interface Window { 
        _boxever: any; 
        Boxever: any; 
        _boxeverq: any;
        _boxever_settings: any;
        _eventSettings:{LogEvents:boolean,Currency:string,Language:string,Channel:string};
    }
}

enum EventType {
    View = "VIEW",
    Add = "ADD",
    Confirm = "CONFIRM",
    Checkout = "CHECKOUT",
    Identity = "IDENTITY",
    Search = "SEARCH",
    Payment = "PAYMENT"
  }


/**
 * Order status
 */
export enum OrderStatus {
    Purchased = "PURCHASED",
    PaymentPending = "PAYMENT_PENDING",
    Confirmed = "CONFIRMED",
    Cancelled = "CANCELLED",
    Refunded = "REFUNDED"
}

/**
 * Payment type
 */
export enum PaymentType {
    Card = "Card",
    PayPal = "PayPal",
    Voucher = "Voucher",
    Other = "Other"
}

const warn = (s: string) => {
    console.warn('[react-sitecore-personalize]..', s);
  }

const required = (name: any) => {
    throw new Error(`Parameter ${name} is required`);
};

/**
 * Logs event
 * @param eventType 
 * @param eventData 
 */
function logEvent(eventType:EventType, eventData:any) {
    if(!window._eventSettings.LogEvents) return
    console.log(`[react-sitecore-personalize] Sending ${eventType} Event`, eventData);
}

/**
 * Validates param
 * @param object 
 * @param paramName 
 * @param paramValue 
 * @returns  
 */
function validateParam(object: any, paramName:string, paramValue:any){
    if (typeof paramValue !== 'undefined') {
        object[paramName] = paramValue;
    }
    return object;
}

const DirectClientScript = {
    tags: function ({clientKey, apiEndpoint, cookieDomain, clientVersion, pos, webFlowTarget}:any) {
        if (!clientKey || clientKey.length === 0) warn('Client Key is required')
        if (!apiEndpoint || apiEndpoint.length === 0) warn('Api Endpoint is required')
        if (!clientVersion || clientVersion.length === 0) warn('Client Version is required')
        if (!pos || pos.length === 0) warn('Point of Sale is required')

    const script = `var _boxeverq=_boxeverq||[],_boxever_settings={client_key:"${clientKey}",target:"${apiEndpoint}",cookie_domain:"${cookieDomain}",pointOfSale:"${pos}",web_flow_target:"${webFlowTarget}"};
       !function(){var e=document.createElement("script");
       e.type="text/javascript",e.async=!0,e.src="https://d1mj578wat5n4o.cloudfront.net/boxever-${clientVersion}.min.js";
       var t=document.getElementsByTagName("script")[0];
       t.parentNode.insertBefore(e,t)}();`
        
      return {
        script
      }
    }
  } 


/**
 * Personalize base event
 * this method creates a base event containing  
 * required common properties used for all events 
 * @param page 
 * @param type 
 * @returns  
 */
function baseEvent(page:string, type:string){
    interface LooseObject {
        [key: string]: any
    }
    const baseEvent: LooseObject = {
        browser_id: window.Boxever.getID(),
        pos: window._boxever_settings.pointOfSale,
        channel: window._eventSettings.Channel,
        language: window._eventSettings.Language,
        currency: window._eventSettings.Currency,
        type: type,
        page: page
    };
    return baseEvent;
}
//#endregion Common

//#region Event Functions
/**
 * Adds Direct Client script
 * Method is used to add Sitecore Boxever Direct Client Script within Body 
 * For more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/javascript-tagging-examples-for-web-pages.html)
 * @param clientKey - Your Client Key. Required. 
 * @param cookieDomain - Your top level cookie domain of the website that is being integrated e.g ".example.com" and not "www.example.com".
 * @param apiEndpoint - Your API target endpoint specific to your data center region. (United States: https://api-us.boxever.com/v1.2,Europe: https://api.boxever.com/v1.2, Asia Pacific: https://api-ap-southeast-2-production.boxever.com/v1.2,  )
 * @param clientVersion - Client Versions the Release Notes JS Library (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/release-notes-for-javascript-library.html) provides the available versions.
 * @param pointOfSale - This is the pointOfSale configured for the tenant.
 * @param webFlowTarget - This is the path for the Amazon CloudFront Content Delivery Network (CDN) for Sitecore Personalize.
 * @param eventSettings - Common Event properties LogEvents: enable/disable console logs, Currency: Currency used ex 'USD', Language: Language in use ex 'EN', Channel: The channel captured ex 'WEB'.  
*/
export function initClientScript(clientKey:string, cookieDomain:string, apiEndpoint:string, clientVersion:string, pointOfSale:string, webFlowTarget:string, eventSettings:{LogEvents:boolean,Currency:string,Language:string,Channel:string}) {
    // configure event settings 
    window._eventSettings = eventSettings;
    const existingScript = document.getElementById('boxeverclientscript');
    if (!existingScript) {
        // initialize the Script tag
        const cdpSnippet = DirectClientScript.tags({
            clientKey: clientKey,
            apiEndpoint: apiEndpoint,
            cookieDomain: cookieDomain,
            clientVersion: clientVersion,
            pos:pointOfSale,
            webFlowTarget:webFlowTarget
        })
        // create the Script element
        const script = () => {
        const script = document.createElement('script')
        script.id = 'boxeverclientscript'
        script.innerHTML = cdpSnippet.script
        return script
        }
        document.body.appendChild(script())
    }
  }

 /**
  * Sends View event to Sitecore Boxever
  * for more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-view-event-to-the-sitecore-cdp.html)
  * @param page - The name of the webpage the guest visited. Required.
  */
 export function sendViewEvent(page:string) {
    if(!window._boxever) return
    window._boxeverq.push(function() {
        let viewEvent = baseEvent(page, EventType.View) 
        viewEvent = window.Boxever.addUTMParams(viewEvent);
        window.Boxever.eventCreate(viewEvent, function(data: any) {}, "json");
        logEvent(EventType.View, viewEvent);
    });
}

/**
 * Sends ADD event to Sitecore Boxever
 * for more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-an-add-event-to-sitecore-cdp.html)
 * @param page - The name of the webpage the guest visited. Required.
 * @param productType - The type of product added to cart. Required
 * @param itemId - The item id of the product added to cart. Required.
 * @param productName - The name of the product added to the cart. Required.
 * @param productId - The product ID of the product added. Used in analytics for reporting. Required.
 * @param orderDate - The date and time the product was ordered. Required.
 * @param qty - The number of unit added. Total price of the product is calculated by unit price multiplied by quantity. Required
 * @param price - The unit price of the product. Total price of the product is calculated by unit price multiplied by quantity. Required
 * @param currency - The currency of the product added to the cart. Required
 * @param referenceId - An ID generated by your organization to reference the order item. Required
 * @param originalPrice - The unit price of the order item before conversion to the organization's currency. Optional
 * @param originalCurrencyCode - The original currency code for the order item. Optional
 */
export function sendAddEvent(page:string,productType:string, itemId: string, productName:string, productId:string, orderDate:string, qty:number, price:number, currency:string, referenceId:string, originalPrice?:number, originalCurrencyCode?:string) {
    if(!window._boxever) return
    window._boxeverq.push(function() {
        let addEvent =  baseEvent(page, EventType.Add) 
        addEvent.product = {
            type: productType,
            item_id: itemId,
            name: productName,
            orderedAt: orderDate,
            quantity: qty,
            price: price,
            productId: productId,
            currency: currency ?? addEvent.currency,
            referenceId: referenceId,
            originalPrice: originalPrice,
            originalCurrencyCode: originalCurrencyCode
        }
        logEvent(EventType.Add, addEvent)
        window.Boxever.eventCreate(addEvent, function(data:any) {}, "json"); 
    });
}

/**
 * Sends CONFIRM order event to Sitecore Boxever
 * for more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-confirm-event-to-sitecore-cdp.html)
 * @param page - The name of the webpage the guest visited. Required.
 * @param orderItems - array containing a list of item_id objects to be confirmed, where item_id maps to the productId to be confirmed, for example: lineItems.map(lineitem => ({item_id:lineitem.productId}). Required
 */
export function sendConfirmEvent(page:string,orderItems:any[]) {
    if(!window._boxever) return
  
    window._boxeverq.push(function() {
        let confirmEvent = baseEvent(page, EventType.Confirm)
        confirmEvent.product = orderItems
        logEvent(EventType.Confirm, confirmEvent)
        window.Boxever.eventCreate(confirmEvent, function(data:any) {}, "json");
      });
  }

/**
 * Sends CHECKOUT event to Sitecore Boxever
 * for more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-checkout-event-to-sitecore-cdp.html)
 * @param page - The name of the webpage the guest visited. Required.
 * @param orderReferenceId - The reference of the order. Required.
 * @param orderStatus - The status of the order. Required.
 */
export function sendCheckoutEvent(page:string,orderReferenceId:string,orderStatus:OrderStatus) {
    if(!window._boxever) return
    window._boxeverq.push(function() {
        let checkoutEvent = baseEvent(page, EventType.Checkout)
        checkoutEvent.reference_id = orderReferenceId
        checkoutEvent.status = orderStatus
        logEvent(EventType.Checkout, checkoutEvent) 
        window.Boxever.eventCreate(checkoutEvent, function(data:any) {}, "json");
    });
}

/**
 * Sends PAYMENT event to Sitecore Boxever
 * for more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-payment-event-to-sitecore-cdp.html)
 * @param page - The name of the webpage the guest visited.
 * @param paymentType - The method of payment associated with a checkout.
 */
export function sendPaymentEvent(page:string,paymentType:PaymentType) {
    if(!window._boxever) return
    window._boxeverq.push(function() {
        let paymentEvent = baseEvent(page, EventType.Payment)
        paymentEvent.pay_type = paymentType
        logEvent(EventType.Payment, paymentEvent) 
        window.Boxever.eventCreate(paymentEvent, function(data:any) {}, "json");
    });
}

/**
 * Sends IDENTITY event to Sitecore Boxever
 * using email provider
 * for more info see (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-an-identity-event-to-sitecore-cdp.html)
 * @param page - The name of the webpage the guest visited. Required
 * @param email - The email address of the guest. Required
 * @param [title] - The title of the guest. Optional
 * @param [firstName] - The first name of the guest. Optional
 * @param [lastName] - The last name of the guest. Optional
 * @param [gender] - The gender of the guest. Optional
 * @param [dob] - The date of birth of the guest. Optional
 * @param [mobile] - The mobile number of the guest. Optional
 * @param [phone] - The phone number of the guest. Optional
 * @param [street] - The street address of the guest. Optional
 * @param [city] - The city address of the guest. Optional
 * @param [state] - The state address of the guest. Optional
 * @param [country] - The country address of the guest. Optional
 * @param [postalCode] - The postal code of the guest. Optional
 */
export function sendIdentityByEmailEvent(page:string, email:string, title?:string, firstName?:string, lastName?:string, 
    gender?:string, dob?:string, mobile?:string,phone?:string,street?:string,city?:string,state?:string,country?:string,postalCode?:string) {
    if(!window._boxever) return
    window._boxeverq.push(function() {
        let identityEvent = baseEvent(page, EventType.Identity) 
        identityEvent.identifiers = [{
            "provider": "email",
            "id": email
        }]
        identityEvent.email = email
        // Check Optional Parameters and send where we have values
        identityEvent = validateParam(identityEvent, 'title', title);
        identityEvent = validateParam(identityEvent, 'firstName', firstName);
        identityEvent = validateParam(identityEvent, 'lastName', lastName);
        identityEvent = validateParam(identityEvent, 'gender', gender);
        identityEvent = validateParam(identityEvent, 'dob', dob);
        identityEvent = validateParam(identityEvent, 'mobile', mobile);
        identityEvent = validateParam(identityEvent, 'phone', phone);
        identityEvent = validateParam(identityEvent, 'city', city);
        identityEvent = validateParam(identityEvent, 'state', state);
        identityEvent = validateParam(identityEvent, 'country', country)
        identityEvent = validateParam(identityEvent, 'postal_code', postalCode);;
        logEvent(EventType.Identity, identityEvent)
        window.Boxever.eventCreate(identityEvent, function(data:any) {}, "json");
    });
}

/**
 * Sends SEARCH event to Sitecore Boxever using Direct Client Script
 * for more info (https://doc.sitecore.com/cdp/en/developers/sitecore-customer-data-platform--data-model-2-1/send-a-search-event-to-sitecore-cdp.html) 
 * @param page - The name of the webpage the guest visited.
 * @param productName - The product name the guest searched for.
 * @param productType - The product type the guest searched for.
 */
export function sendSearchEvent(page:string,productName:string,productType:string) {
    if(!window._boxever) return
    window._boxeverq.push(function() {
        let searchEvent = baseEvent(page, EventType.Search)
        searchEvent.product_name = productName
        searchEvent.product_type = productType
        logEvent(EventType.Search, searchEvent) 
        window.Boxever.eventCreate(searchEvent, function(data:any) {}, "json");
    });
}
//#endregion Event Functions
