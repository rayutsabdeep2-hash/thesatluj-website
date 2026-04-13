import fs from 'fs';

let content = fs.readFileSync('e:/the-satluj/index.html', 'utf8');

content = content.replace(/<img([^>]*)>/gi, (match, p1) => {
    // Skip hero image and lightbox image
    if (match.includes('Himalayan mountain sunrise snow peaks')) return match;
    if (match.includes('id="lightbox-image"')) return match;

    let newAttrs = p1;

    // Add loading="lazy" if not there
    if (!newAttrs.includes('loading="lazy"')) {
        newAttrs += ' loading="lazy"';
    }

    // Extract width and height from unsplash URL: source.unsplash.com/WIDTHxHEIGHT/
    const dimMatch = newAttrs.match(/source\.unsplash\.com\/(\d+)x(\d+)/);
    if (dimMatch) {
        const width = dimMatch[1];
        const height = dimMatch[2];
        if (!newAttrs.includes('width=')) {
            newAttrs += ` width="${width}"`;
        }
        if (!newAttrs.includes('height=')) {
            newAttrs += ` height="${height}"`;
        }
    }

    return `<img${newAttrs}>`;
});

fs.writeFileSync('e:/the-satluj/index.html', content);
console.log('Images fixed successfully!');
