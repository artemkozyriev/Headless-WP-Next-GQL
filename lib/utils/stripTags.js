export const stripAnchorTags = (html, keepInnerText = true) => {
	return html.replace(/<a.*>(.*)<\/a>/gm, keepInnerText ? '$1' : '');
}