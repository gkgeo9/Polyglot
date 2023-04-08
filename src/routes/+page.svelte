<script>
	import Prism from 'prismjs';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-python';
	import 'prismjs/components/prism-java';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let code = '';
	let language = 'javascript';

	let gptJS = ``;
	let gptPython = ``;
	let gptCPP = ``;
	let gptJava = ``;

	onMount(async () => {
		storedUsage = writable(localStorage.getItem('storedUsage'));
		storedUsage.subscribe((value) => {
			// console.log(value);
			if (value != null) {
				lastUsage = JSON.parse(value);
			} else {
				lastUsage = Date.now();
			}
		});
		// const auth = await getAuth(app);
	});
	let outputText = ['', '', '', ''];
	async function postData(inputText, language) {
		let languagesToTranslate = ['javascript', 'python', 'c++', 'java'];
		// if (language == 'c++') {
		// 	languagesToTranslate.push('javascript');
		// 	languagesToTranslate.push('python');
		// 	languagesToTranslate.push('java');
		// } else if (language == 'python') {
		// 	languagesToTranslate.push('c++');
		// 	languagesToTranslate.push('javascript');
		// 	languagesToTranslate.push('java');
		// } else if (language == 'javascript') {
		// 	languagesToTranslate.push('c++');
		// 	languagesToTranslate.push('python');
		// 	languagesToTranslate.push('java');
		// } else if (language == 'java') {
		// 	languagesToTranslate.push('c++');
		// 	languagesToTranslate.push('javascript');
		// 	languagesToTranslate.push('python');
		// }
		let outputText = ['JS', 'Python', 'C++', 'Java'];
		try {
			for (let tempLanguage in languagesToTranslate) {
				console.log(
					'🚀 ~ file: +page.svelte:52 ~ postData ~ tempLanguage:',
					languagesToTranslate[tempLanguage]
				);

				status = `loading ${languagesToTranslate[tempLanguage]}...`;

				const response = await fetch('/api', {
					method: 'POST',
					body: JSON.stringify({
						inputText: inputText,
						language: language,
						tempLanguage: languagesToTranslate[tempLanguage]
					}),
					headers: {
						'content-type': 'application/json'
					}
				});
				if (languagesToTranslate[tempLanguage] == 'javascript') {
					outputText[0] = await response.json();
					gptJS = outputText[0];
				} else if (languagesToTranslate[tempLanguage] == 'python') {
					outputText[1] = await response.json();
					gptPython = outputText[1];
				} else if (languagesToTranslate[tempLanguage] == 'c++') {
					outputText[2] = await response.json();
					gptCPP = outputText[2];
				} else if (languagesToTranslate[tempLanguage] == 'java') {
					outputText[3] = await response.json();
					gptJava = outputText[3];
				}
				console.log('🚀 ~ file: +page.svelte:17 ~ postData ~ outputText:', outputText);
			}
		} catch {
			outputText = 'An error occurred👽';
		}
		return outputText;
	}

	let storedUsage;
	var lastUsage = 0;
	let outputFinalText;
	let status = '';
	async function submit() {
		status = '⏱️loading...';
		const now = Date.now();
		if (Date.now() - lastUsage >= 5 * 1000) {
			//5 seconds
			outputFinalText = 'loading..';
			let allowedInput = await postModData(code);
			if (allowedInput.toLowerCase().includes('good')) {
				outputFinalText = await postData(code, language);
				lastUsage = Date.now();
				storedUsage.subscribe(() => {
					localStorage.setItem('storedUsage', JSON.stringify(Date.now()));
				});
				// status = '';
			} else {
				outputFinalText = 'This input is not allowed 😡';
				status = 'This input is not allowed 😡';
			}
		} else {
			outputFinalText = 'Please wait a moment...';
			status = 'Please wait a moment...';
		}
	}

	async function postModData(inputText) {
		let outputText = '';
		try {
			const response = await fetch('/mod', {
				method: 'POST',
				body: JSON.stringify({ inputText: inputText }),
				headers: {
					'content-type': 'application/json'
				}
			});
			outputText = await response.json();
		} catch {
			outputText = 'An error occurred👽';
		}
		return outputText;
	}
</script>

<div class="flex h-screen bg-[#2d2d2d]">
	<div class="w-1/2 px-4 py-8">
		<div class="mb-4">
			<textarea
				class="w-full h-64 px-3 py-2 border rounded-lg"
				placeholder="enter your code here"
				bind:value={code}
			/>
		</div>
		<div class="mb-4">
			<select class="w-full h-10 px-3 py-2 border rounded-lg" bind:value={language}>
				<option value="javascript">JavaScript</option>
				<option value="python">Python</option>
				<option value="c++">C++</option>
				<option value="java">Java</option>
			</select>
		</div>
		<div class="flex">
			<button
				on:click={async () => {
					await submit();
					status = 'loading color🎨...';
					console.log(gptJS, gptPython, gptJava, gptCPP);

					let jsBlock = document.querySelector('.language-javascript');
					jsBlock.innerHTML = `<code class="language-javascript">${gptJS}</code>`;
					let pythonBlock = document.querySelector('.language-python');
					pythonBlock.innerHTML = `<code class="language-python">${gptPython}</code>`;
					let javaBlock = document.querySelector('.language-java');
					javaBlock.innerHTML = `<code class="language-java">${gptJava}</code>`;
					let cppBlock = document.querySelector('.language-clike');
					cppBlock.innerHTML = `<code class="language-clike">${gptCPP}</code>`;

					setTimeout(() => {
						Prism.highlightAll();
					}, 100);
					status = '';
					// console.log('Highlight');
				}}
				class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700">Translate</button
			>
			<p class="p-3 text-white">{status}</p>
		</div>
	</div>
	<div class="w-1/2 p-8">
		<p class="text-white">JavaScript🌐</p>
		<pre class="rounded-md"><code class="language-javascript">{gptJS}</code></pre>
		<p class="text-white">Python🐍</p>
		<pre class="rounded-md"><code class="language-python">{gptPython}</code></pre>
		<p class="text-white">C++🐢</p>
		<pre class="rounded-md"><code class="language-clike">{gptCPP}</code></pre>
		<p class="text-white">Java☕</p>
		<pre class="rounded-md"><code class="language-java">{gptJava}</code></pre>
	</div>
</div>
