(function() {
  // Check if we're on an eBay item page
  if (!window.location.href.includes('ebay.com/itm/')) {
    return;
  }

  // Check if button is already added
  if (document.getElementById('ebay-md-button')) {
    return;
  }

  // Create and inject the MD button
  const buttonStyle = `
    position: fixed;
    top: 120px;
    right: 20px;
    z-index: 9999;
    background-color: #3665f3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

  const button = document.createElement('button');
  button.id = 'ebay-md-button';
  button.textContent = 'MDで保存';
  button.setAttribute('style', buttonStyle);
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#2b4fb8';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#3665f3';
  });
  button.addEventListener('click', extractAndSaveMd);
  document.body.appendChild(button);

  // Main function to extract data and save as markdown
  function extractAndSaveMd() {
    try {
      const markdown = generateMarkdown();
      
      // Both copy to clipboard and save as file
      copyToClipboard(markdown);
      saveAsFile(markdown);
      
      showNotification('マークダウンをコピーし、ファイルをダウンロードしました！');
    } catch (error) {
      console.error('Error extracting eBay data:', error);
      showNotification('エラーが発生しました。コンソールを確認してください。');
    }
  }

  // Generate markdown from page data
  function generateMarkdown() {
    // Extract basic information
    const title = extractTitle();
    const price = extractPrice();
    const condition = extractCondition();
    const availability = extractAvailability();
    const seller = extractSeller();
    
    // Extract detailed information
    const itemDetails = extractItemDetails();
    const conditionDetails = extractConditionDetails();
    const shippingInfo = extractShippingInfo();
    const paymentMethods = extractPaymentMethods();
    const additionalInfo = extractAdditionalInfo();

    // Format current date
    const today = new Date();
    const formattedDate = `${today.toLocaleString('en-US', { month: 'short' })} ${today.getDate()}, ${today.getFullYear()}`;

    // Build markdown
    let md = `# ${title}\n\n`;
    
    // Basic Information section
    md += `## Basic Information\n`;
    md += `- **Price**: ${price}\n`;
    md += `- **Condition**: ${condition}\n`;
    if (availability) md += `- **Availability**: ${availability}\n`;
    md += `- **Seller**: ${seller}\n\n`;
    
    // Item Details section
    md += `## Item Details\n`;
    for (const [key, value] of Object.entries(itemDetails)) {
      md += `- **${key}**: ${value}\n`;
    }
    md += '\n';
    
    // Condition Details section
    md += `## Condition Details\n`;
    for (const [key, value] of Object.entries(conditionDetails)) {
      md += `- **${key}**: ${value}\n`;
    }
    md += '\n';
    
    // Shipping Information section
    md += `## Shipping Information\n`;
    for (const [key, value] of Object.entries(shippingInfo)) {
      md += `- **${key}**: ${value}\n`;
    }
    md += '\n';
    
    // Payment Methods section
    md += `## Payment Methods\n`;
    for (const method of paymentMethods) {
      md += `- ${method}\n`;
    }
    md += '\n';
    
    // Additional Information section
    if (additionalInfo.length > 0) {
      md += `## Additional Information\n`;
      for (const info of additionalInfo) {
        md += `- ${info}\n`;
      }
      md += '\n';
    }
    
    // Footer
    md += `---\n\n`;
    md += `*This data was automatically extracted from eBay*  \n`;
    md += `*Date: ${formattedDate}*`;
    
    return md;
  }

  // Helper functions for extracting specific data
  function extractTitle() {
    const titleElement = document.querySelector('h1.x-item-title__mainTitle span');
    return titleElement ? titleElement.textContent.trim() : 'Unknown Title';
  }

  function extractPrice() {
    const priceElement = document.querySelector('.x-price-primary span');
    const approxPriceElement = document.querySelector('.x-price-approx__price span');
    
    let price = priceElement ? priceElement.textContent.trim() : 'Unknown Price';
    let approxPrice = approxPriceElement ? ` (approx. ${approxPriceElement.textContent.trim()})` : '';
    
    // Check if "or Best Offer" exists
    const bestOfferElement = document.querySelector('.x-additional-info__textual-display span:nth-child(2)');
    let bestOffer = '';
    if (bestOfferElement && bestOfferElement.textContent.includes('Best Offer')) {
      bestOffer = ' or Best Offer';
    }
    
    return `${price}${approxPrice}${bestOffer}`;
  }

  function extractCondition() {
    const conditionElement = document.querySelector('.x-item-condition-text .ux-textspans');
    return conditionElement ? conditionElement.textContent.trim() : 'Not specified';
  }

  function extractAvailability() {
    const availabilityElement = document.querySelector('.x-quantity__availability');
    return availabilityElement ? availabilityElement.textContent.trim() : '';
  }

  function extractSeller() {
    const sellerNameElement = document.querySelector('.x-sellercard-atf__info__about-seller a span');
    const sellerRatingElement = document.querySelector('.x-sellercard-atf__data-item button span');
    
    let seller = sellerNameElement ? sellerNameElement.textContent.trim() : 'Unknown Seller';
    let rating = sellerRatingElement ? ` (${sellerRatingElement.textContent.trim()})` : '';
    
    return `${seller}${rating}`;
  }

  function extractItemDetails() {
    // This would need to be customized based on the category of item
    // For a video game, we might extract platform, release year, genre, etc.
    const details = {};
    
    // Extract platform from title
    const title = extractTitle();
    if (title.includes('Super Famicom') || title.includes('SFC')) {
      details['Platform'] = 'Super Famicom (SFC)';
    } else if (title.includes('PlayStation') || title.includes('PS')) {
      details['Platform'] = title.match(/PlayStation\s*\d+|PS\d+/)[0];
    }
    
    // Extract product ID if available
    const productIdMatch = title.match(/\b\d{4}\s*[a-zA-Z]{1,3}\b/);
    if (productIdMatch) {
      details['Product ID'] = productIdMatch[0];
    }
    
    // Extract the actual title (without platform, etc.)
    const mainTitle = title.split(' ')[0]; // This is very simplistic
    details['Title'] = mainTitle;
    
    return details;
  }

  function extractConditionDetails() {
    const details = {};
    
    // Get condition description
    const conditionDescElement = document.querySelector('.x-item-condition-desc');
    if (conditionDescElement) {
      const conditionText = conditionDescElement.textContent.trim();
      
      // Parse condition details from the description
      // These are very specific to the format used in the example
      const cartridgeMatch = conditionText.match(/Cartridge\s*-\s*([A-Z])\s*\(/);
      if (cartridgeMatch) {
        details['Cartridge'] = `${cartridgeMatch[1]} (Standard Used Condition)`;
      }
      
      const caseMatch = conditionText.match(/Case\s*-\s*([A-Z])/);
      if (caseMatch) {
        details['Case'] = `${caseMatch[1]} (See photos)`;
      }
      
      // Add generic note
      details['Notes'] = 'Photo shown everything you will have';
    } else {
      details['Notes'] = 'See listing for details';
    }
    
    return details;
  }

  function extractShippingInfo() {
    const info = {};
    
    // Shipping cost
    const shippingCostElement = document.querySelector('.ux-labels-values__values-content div:first-child');
    if (shippingCostElement) {
      const costText = shippingCostElement.textContent.trim();
      const costMatch = costText.match(/(US \$[\d.]+)/);
      const approxMatch = costText.match(/\(approx ([^)]+)\)/);
      
      if (costMatch) {
        let cost = costMatch[1];
        if (approxMatch) {
          cost += ` (approx. ${approxMatch[1]})`;
        }
        info['Shipping Cost'] = cost;
      }
    }
    
    // Shipping method
    const methodElement = document.querySelector('.ux-labels-values__values-content div:first-child span:nth-child(4)');
    if (methodElement) {
      info['Shipping Method'] = methodElement.textContent.trim();
    }
    
    // Ships from
    const locationElement = document.querySelector('.ux-labels-values__values-content div:nth-child(2)');
    if (locationElement) {
      const location = locationElement.textContent.replace('Located in:', '').trim();
      info['Ships From'] = location;
    }
    
    // Estimated delivery
    const deliveryElement = document.querySelector('.ux-labels-values__values-content div:nth-child(3)');
    if (deliveryElement) {
      const deliveryText = deliveryElement.textContent.trim();
      const dateMatch = deliveryText.match(/between\s+([^a-z]+)\s+and\s+([^a-z]+)\s+to/i);
      if (dateMatch) {
        info['Estimated Delivery'] = `${dateMatch[1].trim()} - ${dateMatch[2].trim()}`;
      }
    }
    
    // Returns policy
    const returnsElement = document.querySelector('.ux-labels-values--returns .ux-labels-values__values-content');
    if (returnsElement) {
      info['Returns'] = returnsElement.textContent.split('.')[0].trim();
    }
    
    return info;
  }

  function extractPaymentMethods() {
    const methods = [];
    
    // PayPal
    if (document.querySelector('.ux-textspans--PAYPAL')) {
      methods.push('PayPal');
    }
    
    // Google Pay
    if (document.querySelector('.ux-textspans--GOOGLE_PAY')) {
      methods.push('Google Pay');
    }
    
    // Visa
    if (document.querySelector('.ux-textspans--VISA')) {
      methods.push('Visa');
    }
    
    // MasterCard
    if (document.querySelector('.ux-textspans--MASTER_CARD')) {
      methods.push('MasterCard');
    }
    
    // Other cards
    if (document.querySelector('.ux-textspans--DISCOVER')) {
      methods.push('Discover');
    }
    
    if (document.querySelector('.ux-textspans--JCB')) {
      methods.push('JCB');
    }
    
    if (document.querySelector('.ux-payment-icon[aria-labelledby*="diners"]')) {
      methods.push('Diners Club');
    }
    
    return methods.length > 0 ? methods : ['See listing for payment methods'];
  }

  function extractAdditionalInfo() {
    const info = [];
    
    // Top Rated seller
    if (document.querySelector('.icon--top-rated-seller-24')) {
      info.push('Top Rated Plus seller');
    }
    
    // Items sold
    const soldElement = document.querySelector('.x-quantity__availability');
    if (soldElement && soldElement.textContent.includes('sold')) {
      const soldMatch = soldElement.textContent.match(/(\d+)\s+sold/);
      if (soldMatch) {
        info.push(`${soldMatch[1]} sold`);
      }
    }
    
    // eBay Money Back Guarantee
    if (document.querySelector('.icon--money-back-guarantee-24')) {
      info.push('eBay Money Back Guarantee');
    }
    
    // Watching
    const watchingElement = document.querySelector('.x-watch-heart-btn-text');
    if (watchingElement) {
      info.push(`${watchingElement.textContent.trim()} watching this item`);
    }
    
    return info;
  }

  // Utility functions
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  // Save markdown as a file
  function saveAsFile(content) {
    // Get title for filename
    const title = extractTitle();
    const safeTitle = title.replace(/[^\w\s]/gi, '').substring(0, 30).trim().replace(/\s+/g, '_');
    const filename = `${safeTitle}_eBay_${Date.now()}.md`;
    
    // Create blob and download link
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    
    // Add to document, click, and clean up
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    const notificationStyle = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 16px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: opacity 0.5s ease;
    `;
    
    notification.textContent = message;
    notification.setAttribute('style', notificationStyle);
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
})();