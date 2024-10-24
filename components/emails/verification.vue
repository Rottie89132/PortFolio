<script lang="ts" setup>
	import { Body, Container, Head, Html, Img, Link, Preview, Section, Text, Hr } from "@vue-email/components";

	defineProps({
		url: { type: String, default: "/" },
		email: { type: String, default: "Bezoeker" },
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

	const text = {
		margin: "0 0 10px 0",
		textAlign: "left",
		lineHeight: 1.2,
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
		<Preview> Verificatieverzoek </Preview>
		<Body :style="main">
			<Container :style="container">
				<Img :style="image" src="https://rottie.onrender.com/icons/test.png" width="32" height="32" alt="Github" />
				<Text :style="title"><strong>{{ email }}</strong>, bedankt voor het aanmelden van een account</Text>
				<Text :style="text"> Bedankt voor het aanmaken van een account om u account te activeren klik op de onderstaande link. </Text>
				<Text :style="links"><Link :style="link" :href="url"> U kunt deze link gebruiken om je account te activeren </Link></Text>
				<Text class="text-[#878f99]" :style="hint"> Deze link is 24 uur geldig. Als u geen account hebt aangemaakt, kun je deze e-mail negeren.</Text>
				<Text :style="footer"> © 2024 Rottie.onrender.com </Text>
			</Container>
		</Body>
	</Html>
</template>
