<script>
	import 'prismjs/themes/prism-tomorrow.css';
	import Prism from 'prismjs';
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

	async function postData(inputText, language) {
		let outputText = '';
		try {
			const response = await fetch('/stuff', {
				method: 'POST',
				body: JSON.stringify({ inputText: inputText, language: language }),
				headers: {
					'content-type': 'application/json'
				}
			});
			outputText = await response.json();
			// console.log('🚀 ~ file: +page.svelte:17 ~ postData ~ outputText:', outputText);
		} catch {
			outputText = 'An error occurred👽';
		}
		return outputText;
	}

	let storedUsage;
	var lastUsage = 0;
	let outputFinalText;

	async function submit() {
		const now = Date.now();
		const secondsSinceLastCall = Math.floor((now - lastUsage) / 1000);
		if (Date.now() - lastUsage >= 5 * 1000) {
			//5 seconds
			outputFinalText = 'loading..';
			let allowedInput = await postModData(code);
			if (allowedInput.toLowerCase().includes('good')) {
				outputFinalText = await postData(code, language);
				console.log('🚀 ~ file: +page.svelte:53 ~ submit ~ outputFinalText:', outputFinalText);
				let codeBlocks = outputFinalText.match(/```(.*?)```/gs);
				console.log('🚀 ~ file: +page.svelte:55 ~ submit ~ codeBlocks:', codeBlocks);
				gptCPP = codeBlocks[0];
				gptCPP = gptCPP.replaceAll('`', '');
				gptJS = codeBlocks[1];
				gptJS = gptJS.replaceAll('`', '');
				gptPython = codeBlocks[2];
				gptPython = gptPython.replaceAll('`', '');
				gptJava = codeBlocks[3];
				gptJava = gptJava.replaceAll('`', '');
				// outputFinalText = codeBlocks;
				console.log(gptJS, gptPython, gptJava, gptCPP);

				lastUsage = Date.now();
				storedUsage.subscribe(() => {
					localStorage.setItem('storedUsage', JSON.stringify(Date.now()));
				});
			} else {
				outputFinalText = 'This input is not allowed 😡';
			}
		} else {
			outputFinalText = 'Please wait a moment...';
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
			<textarea class="w-full h-64 px-3 py-2 border rounded-lg" bind:value={code} />
		</div>
		<div class="mb-4">
			<select class="w-full h-10 px-3 py-2 border rounded-lg" bind:value={language}>
				<option value="javascript">JavaScript</option>
				<option value="python">Python</option>
				<option value="clike">C++</option>
				<option value="java">Java</option>
			</select>
		</div>
		<div>
			<button
				on:click={async () => {
					await submit();
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
						console.log('waiting');
					}, 100);

					console.log('Highlighest');
				}}
				class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700">Translate</button
			>
		</div>
	</div>
	<div class="w-1/2 p-8">
		<!-- {#if language === 'javascript'} -->
		<p class="text-white">JavaScript🌐</p>
		<pre class="rounded-md"><code class="language-javascript">{gptJS}</code></pre>
		<!-- {:else if language === 'python'} -->
		<p class="text-white">Python🐍</p>
		<pre class="rounded-md"><code class="language-python">{gptPython}</code></pre>
		<!-- {:else if language === 'clike'} -->
		<p class="text-white">C++🐢</p>
		<pre class="rounded-md"><code class="language-clike">{gptCPP}</code></pre>
		<!-- {:else if language === 'java'} -->
		<p class="text-white">Java☕</p>
		<pre class="rounded-md"><code class="language-java">{gptJava}</code></pre>
		<!-- {/if} -->
		<!-- <p>{outputFinalText}</p> -->
	</div>
</div>
