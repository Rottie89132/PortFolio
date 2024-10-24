<script lang="ts" setup>
	import { Body, Container, Head, Html, Img, Link, Preview, Section, Text, Hr } from "@vue-email/components";

	defineProps({
		naam: { type: String, default: "Bezoeker" },
		email: { type: String, default: "Bezoeker@mail.net" },
		bericht: { type: String, default: "Geen inhoud gevonden" },
		telefoon: { type: String, default: "" },
		url: { type: String, default: "https://rottie.onrender.com" },
	});

	const main = {
		backgroundColor: "#ffffff",
		color: "#24292e",
		fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
	};

	const container = {
		maxWidth: "480px",
		margin: "0 auto",
		padding: "20px 0 48px",
	};

	const title = {
		fontSize: "24px",
		lineHeight: 1.25,
	};

	const section = {
		padding: "24px",
		border: "solid 1px #dedede",
		borderRadius: "5px",
	};

	const message = {
		margin: "0 0 10px 0",
		textAlign: "left" ,
		"white-space": "pre-wrap",
		backgroundColor: "#ffffff",
		lineHeight: 1.2,
	};

	const links = {
		textAlign: "left" ,
	};

	const link = {
		color: "#0366d6",
		fontSize: "12px",
	};

	const footer = {
		color: "#6a737d",
		fontSize: "12px",
		textAlign: "left" ,
		marginTop: "60px",
	};

	const image = {
		'border-radius': '100%',
	}

	const subject = encodeURIComponent("Reactie op uw contactverzoek");

	const clamp = (str: string, numWords: number) => {
		const words = str.split(' ');
		return words.length > numWords ? words.slice(0, numWords).join(' ') + "..." : str;
	};

</script>

<template>
	<Html>
		<Head></Head>
		<Preview> Contactverzoek ontvangen </Preview>
		<Body :style="main">
			<Container :style="container">
				<Img :style="image" src="https://rottie.onrender.com/icons/test.png" width="32" height="32" alt="Github" />
				<Text :style="title"><strong>{{ naam.charAt(0).toUpperCase() + naam.slice(1).toLowerCase() }}</strong>, Heeft zojuist een contactverzoek aangevraagt, bekijk het verzoek hieronder.</Text>
				<Section :style="section">
					<Text :style="message">{{ clamp(bericht, 150) }}</Text>
					<Text :style="links">
						<Link :style="link" :href="`mailto:${email}?subject=${subject}`">Reageer op het contactverzoek<br /></Link>
						<Link v-if="telefoon" :style="link" :href="`tel:${telefoon.replaceAll(' ', '')}`"> Neem telefonisch contact op <br /></Link>
						<Link :style="link" :href="url">Bekijk het volledige contactverzoek op de website</Link>
					</Text>
				</Section>
				<Text :style="footer"> © 2024 Rottie.onrender.com </Text>
			</Container>
		</Body>
	</Html>
</template>
