<script>
	import '../app.postcss';
	import './styles.css';
</script>

<div class="app">
	<p class="text-6xl text-white m-3 max-md:text-center">Polyglot Code • AI Code Translator🖥️</p>
	<main>
		<slot />
	</main>
	<p class="text-left p-3 max-md:hidden text-blue-400">
		This program will make mistakes when translating code & it is limited to 150 words of code.
	</p>
	<!-- <footer class="text-white flex flex-col p-3">
		<p class="max-md:text-center">
			Made by gkgeo9 with 💖. The program will make mistakes and have errors.
		</p>
	</footer> -->
</div>
