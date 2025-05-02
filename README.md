# eBay-MD Firefox Extension

A Firefox extension that converts eBay product listings to markdown format with a single click.

## Features

- **Simple UI**: Adds a "MDで保存" (Save as MD) button to eBay product pages
- **Comprehensive Data Extraction**: Captures product details, pricing, condition, shipping, and more
- **Structured Output**: Converts data to well-organized markdown format
- **Dual Output**: Both copies to clipboard and saves as a file
- **Japanese Support**: UI elements in Japanese for ease of use

## Screenshots

*Screenshots will be added soon*

## Installation

### Temporary Installation (Development)

1. Download or clone this repository to your local machine
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to the directory where you saved this extension, and select the `manifest.json` file
6. The extension is now installed for the current session

### Permanent Installation

1. Zip the contents of this repository
2. Go to `about:addons` in Firefox
3. Click the gear icon and select "Install Add-on From File..."
4. Select the zip file you created

## Usage

1. Visit any eBay item page (URLs containing "ebay.com/itm/")
2. Look for the blue "MDで保存" button in the top-right corner
3. Click the button to:
   - Extract and structure the product information
   - Copy the markdown to your clipboard
   - Download the markdown as a file named after the product

## Extracted Information

The markdown output includes:

- **Basic Information**: Price, condition, availability, seller details
- **Item Details**: Product title, platform, product ID (when applicable)
- **Condition Details**: Parsed from the condition description
- **Shipping Information**: Cost, method, origin, estimated delivery dates
- **Payment Methods**: Available payment options
- **Additional Information**: Seller rating, number of watchers, guarantees, etc.

## Development

### Project Structure

```
ebay-to-markdown/
├── manifest.json       # Extension configuration
├── content.js          # Main functionality script
├── background.js       # Background script
└── icons/              # Extension icons
    ├── icon-19.svg
    ├── icon-48.svg
    └── icon-96.svg
```

### Customization

- **Output Format**: Edit the `generateMarkdown()` function in `content.js` to change the markdown structure
- **Data Extraction**: Modify the extraction functions in `content.js` for different data points
- **Styling**: Adjust the `buttonStyle` and `notificationStyle` variables for visual changes
- **Languages**: Change the button text and notification messages for different languages

### Modifying Selectors

The extension uses CSS selectors to extract data from eBay pages. If eBay changes their page structure, you may need to update these selectors:

1. Use browser developer tools to inspect the updated eBay page structure
2. Locate the appropriate elements
3. Update the selectors in the extraction functions

## Known Limitations

- Works only on eBay item pages
- Some special eBay listings (auctions, multi-variation items) may have incomplete data extraction
- eBay page structure changes may require selector updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Developed by Rioto Moriya
- Inspired by the need for better product research tools
- Special thanks to the Firefox Add-ons development community for documentation and examples

---

*For feature requests and bug reports, please open an issue on this repository.*
