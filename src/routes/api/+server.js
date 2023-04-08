import { Configuration, OpenAIApi } from 'openai';
import { API_URL } from '$env/static/private';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let originAddress = await request.headers.get('origin');
	if (
		originAddress == 'https://codetranslator.vdoc.dev/' ||
		originAddress == 'https://codetranslator.vdoc.dev' ||
		originAddress == 'http://127.0.0.1:5173'
	) {
		const configuration = new Configuration({
			apiKey: API_URL
		});
		const openai = new OpenAIApi(configuration);
		let { inputText, language, tempLanguage } = await request.json();

		let outputText = '';

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: `You are a code translator. Translate the following ${language} code to ${tempLanguage}. Only write the code, don't add any extra character such as "\`"`
				},
				{ role: 'user', content: `${inputText}` }
			],
			max_tokens: 500,
			temperature: 0.7
		});
		outputText = response.data.choices[0].message.content;

		return new Response(JSON.stringify(outputText));
	}
	return new Response(JSON.stringify('No no no 😉'));
}
