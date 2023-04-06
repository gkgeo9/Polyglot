import { Configuration, OpenAIApi } from 'openai';
import { API_URL } from '$env/static/private';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	// let originAddress = await request.headers.get('origin');
	// if (
	// 	originAddress == 'https://facts.vdoc.dev/' ||
	// 	originAddress == 'https://facts.vdoc.dev' ||
	// 	originAddress == 'https://vdoc.dev' ||
	// 	originAddress == 'https://vdoc.dev/'
	// ) {
	const configuration = new Configuration({
		apiKey: API_URL
	});
	const openai = new OpenAIApi(configuration);
	let { inputText, language } = await request.json();
	let flagged = false;
	const moderationResponse = await openai.createModeration({
		input: inputText
	});
	flagged = moderationResponse.data.results[0].flagged;
	if (flagged) {
		return new Response(JSON.stringify('This input was flagged!'));
	} else {
		let outputText = '';
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are a translator that can write code in C++, JavaScript, Python, and Java. Given the language name and the code in any of the previously listed languages, you will need to convert to each of the other languages. Output the result like this: C++```<CODE>``` JS```<CODE>``` Python```CODE>``` Java```<CODE>```'
				},
				{ role: 'user', content: `Language ${language}:\n${inputText}` }
			],
			max_tokens: 500,
			temperature: 0.7
		});
		outputText = response.data.choices[0].message.content;
		return new Response(JSON.stringify(outputText));
	}
	// }
	// return new Response(JSON.stringify('No no no 😉'));
}
