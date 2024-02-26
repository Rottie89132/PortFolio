export default (interested: boolean, Text: any) => {
  let bericht =
    `Beste ${Text.value.Response.name},\n
    Bedankt voor u interesse in mijn portfolio website. Nadat ik uw bericht heb gelezen, heb ik besloten om u een bericht terug te sturen. u kunt mijn reactie op uw bericht hieronder lezen.

    Indien gewenst, kunt u uw bericht teruglezen via de volgende link.\n
    http://${location.host}/berichten/${Text.value.Response._id}

    [REACTIE]

    Met vriendelijke groeten,
    Roland Meijer
    `

  if (!interested) bericht = `
  Beste ${Text.value.Response.name},\n
  Bedankt voor u interesse in mijn portfolio website maar, helaas ben ik momenteel niet geïnteresseerd in uw aanbod. Ik wil u dan ook bedanken voor uw bericht.
  
  Indien gewenst, kunt u uw bericht teruglezen via de volgende link.\n
  http://${location.host}/berichten/${Text.value.Response._id}
  
  Met vriendelijke groeten,
  Roland Meijer
  `

  const subject = encodeURIComponent("Reactie op uw bericht over mijn portfolio website");
  const body = encodeURIComponent(bericht);

  return `mailto:${Text.value.Response.email}?subject=${subject}&body=${body}`;
}