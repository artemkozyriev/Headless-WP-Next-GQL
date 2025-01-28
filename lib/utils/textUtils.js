export const replaceStraightApostrophes = (text) => {
    // Regular expression to find straight apostrophes
    const regex = /'/g;
    const newText = text.replace(regex, '’');
    return newText;
};