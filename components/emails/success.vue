<script lang="ts" setup>
	
	import { Body, Container, Head, Html, Img, Link, Preview, Section, Text, Hr } from "@vue-email/components";

	
	defineProps({
		Username: { type: String, default: "Bezoeker" },
	
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

	const text = {
		margin: "0 0 10px 0",
		textAlign: "left",
		lineHeight: 1.2
	};

	const hint = {
		margin: "0 0 10px 0",
		textAlign: "left",
		color: "#878f99",
		lineHeight: 1.1,
		fontSize: "12px",
	};

	const links = {
		textAlign: "left",
	};

	const link = {
		color: "#0366d6",
		fontSize: "12px",
	};

	const footer = {
		color: "#6a737d",
		fontSize: "12px",
		textAlign: "left",
		marginTop: "60px",
	};

	const image = {
		"border-radius": "100%",
	};

</script>

<template>
	<Html>
		<Head></Head>
		<Preview> 
			Account activatie succesvol.
		</Preview>
		<Body :style="main">
			<Container :style="container">
				<Img :style="image" src="https://rottie.onrender.com/icons/test.png" width="32" height="32" alt="Github" />
				<Text :style="title"><strong>{{ Username }}</strong>, uw account is succesvol geactiveerd.</Text>
				<Text :style="text">Beste <strong>{{ Username }}</strong>,<br />Ik ben blij u te informeren dat uw account succesvol is geverifieerd en geactiveerd, waardoor u nu volledige toegang heeft tot mijn portfolio.</Text>
				<Text :style="links"><Link :style="link" href="https://rottie.onrender.com">Bezoek mijn portfolio</Link></Text>
				<Text :style="footer"> © 2024 Rottie.onrender.com </Text>
			</Container>
		</Body>
	</Html>
</template>
