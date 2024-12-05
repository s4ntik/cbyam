// emojiLibrary.js

const emojiLibrary = {
    ':shy:': 'https://cdn.7tv.app/emote/638767f24cc489ef45239272/4x.webp',
    ':nope:': 'https://cdn.7tv.app/emote/60ae4bb30e35477634610fda/4x.webp',
	':classic:': 'https://cdn.7tv.app/emote/01HE20R320000EW388NZZBT6CR/4x.avif',
	':madgeclap:': 'https://cdn.7tv.app/emote/01HFP8SQQ800053PHAJVKF4AMX/4x.avif',
	':boomies:': 'https://cdn.7tv.app/emote/01FN5FV7NR00071FCSB63SBGGN/4x.avif',
	':angry:': 'https://cdn.7tv.app/emote/62ec2ff0d2e11183867d91d9/4x.webp',
	':feelswait:': 'https://cdn.7tv.app/emote/62eb9664d0d227927b542bb1/4x.webp',
	':pepejam:': 'https://cdn.7tv.app/emote/01FNEZPP28000FZADBM40VPGPH/4x.avif',
	':pee:': 'https://cdn.7tv.app/emote/63d157ae784e2f866f1e90e8/4x.webp',
	':change:': 'https://cdn.7tv.app/emote/01HE8JH1GG0001JRBFJP6DGTFJ/4x.avif',
    // Add more mappings as needed
};

function replaceEmojiShortcodesWithImage(text) {
    for (const shortcode in emojiLibrary) {
        if (emojiLibrary.hasOwnProperty(shortcode)) {
            const regex = new RegExp(shortcode.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            const image = `<img src="${emojiLibrary[shortcode]}" alt="${shortcode}" style="height: 70px; width: auto;" />`;
            text = text.replace(regex, image);
        }
    }
    return text;
}
