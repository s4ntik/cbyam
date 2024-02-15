// emojiLibrary.js

const emojiLibrary = {
    ':shy:': 'https://cdn.7tv.app/emote/638767f24cc489ef45239272/4x.webp',
    ':nope:': 'https://cdn.7tv.app/emote/60ae4bb30e35477634610fda/4x.webp',
	':classic:': 'https://cdn.7tv.app/emote/630db7e07b84e74996da9552/4x.webp',
	':madgeclap:': 'https://cdn.7tv.app/emote/60bcb675926e7345939ac41b/4x.webp',
	':boomies:': 'https://cdn.7tv.app/emote/60b27a4a6fa46cea3c8772ab/4x.webp',
	':angry:': 'https://cdn.7tv.app/emote/62ec2ff0d2e11183867d91d9/4x.webp',
	':feelswait:': 'https://cdn.7tv.app/emote/62eb9664d0d227927b542bb1/4x.webp',
	':pepejam:': 'https://cdn.7tv.app/emote/6040a8bccf6746000db10348/4x.webp',
	':pee:': 'https://cdn.7tv.app/emote/63d157ae784e2f866f1e90e8/4x.webp',
	'::': '',
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
