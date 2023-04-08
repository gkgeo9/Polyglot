# Code Translator Web App 🌐💻🔥

This is a web app that allows users to translate code from one programming language to another. The app currently supports translation between JavaScript, Python, C++, and Java. The app is built using SvelteKit and Tailwind CSS, and it utilizes OpenAI's API for code translation.

**Live Demo: https://codetranslator.vdoc.dev/ **

## Installation 🛠️

To run the app locally, you will need to have Node.js installed on your machine. Once you have Node.js installed, you can clone this repository and install the necessary dependencies by running the following commands:

```bash
git clone https://github.com/Gabriel-code21/CodeTranslator.git
cd code-translator-web-app
npm install
```

## Usage 🚀

To start the app locally, run the following command:

`npm run dev`

This should start a development server at http://127.0.0.1:5173/. If not, it will be listed in the terminal.

To translate code, simply paste your code into the input box and select the source language from the dropdown menus. Then click the "Translate" button to see the translated code. It may take some time depending on the length of the user's code.

## API Usage 🔑

The app utilizes OpenAI's GPT-3 API for code translation. You will need to provide your own API key in order to use the app. Once you have obtained an API key from OpenAI, you can set it as an environment variable by creating a file called .env in the root of the project directory and adding the following line:

`API_URL=your-open-ai-api-key`

## Contributing 👥

If you would like to contribute to the development of this app, feel free to submit a pull request. Before submitting a pull request, please make sure that your code adheres to the project's code style guidelines.

🙏 Thank you for checking out my project!
